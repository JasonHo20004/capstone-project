import { Request, Response } from "express";
import { SellerService } from "../services/seller.service";
import { s3Service } from "../../../services/s3.service.js";

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter((v) => v.length > 0);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
};

export class SellerController {
  private service = new SellerService();

  /**
   * Apply to become a course seller
   * POST /api/seller/apply  (multipart/form-data)
   *   - images[]:    certificate image files (1..10, <=5MB each)
   *   - expertise[]: at least one string
   *   - message:     optional string
   */
  applyForSeller = async (req: Request, res: Response): Promise<void> => {
    const uploadedUrls: string[] = [];
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      const expertise = toStringArray(req.body?.expertise);
      const message = typeof req.body?.message === "string" ? req.body.message.trim() : undefined;

      if (files.length === 0) {
        res.status(400).json({ success: false, error: "At least one certificate image is required" });
        return;
      }
      if (expertise.length === 0) {
        res.status(400).json({ success: false, error: "At least one expertise area is required" });
        return;
      }

      // Upload all files to S3 first; collect URLs so we can roll back on error.
      for (const file of files) {
        const url = await s3Service.uploadFile(file, "seller-certifications");
        uploadedUrls.push(url);
      }

      const result = await this.service.applyForSeller(userId, {
        certification: uploadedUrls,
        expertise,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: result,
      });
    } catch (error) {
      // Best-effort cleanup of any successfully uploaded files
      await Promise.all(uploadedUrls.map((u) => s3Service.deleteFile(u)));
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit application",
      });
    }
  };

  /**
   * Get my application status
   * GET /api/seller/application
   */
  getMyApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const result = await this.service.getMyApplication(userId);
      if (!result) {
        res.status(404).json({
          success: false,
          error: "No application found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get application",
      });
    }
  };

  /**
   * Get my seller profile
   * GET /api/seller/profile
   */
  getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const result = await this.service.getSellerProfile(userId);
      if (!result) {
        res.status(404).json({
          success: false,
          error: "Seller profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get profile",
      });
    }
  };

  /**
   * Update my seller profile
   * PUT /api/seller/profile
   */
  updateMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const result = await this.service.updateSellerProfile(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  /**
   * Get all applications (Admin only)
   * GET /api/admin/seller-applications
   */
  getAllApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;

      const result = await this.service.getAllApplications(page, limit, status);
      res.status(200).json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get applications",
      });
    }
  };

  /**
   * Approve or reject an application (Admin only)
   * PATCH /api/admin/seller-applications/:id
   */
  updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const applicationId = req.params.id as string;
      const adminId = req.user?.userId;
      const result = await this.service.updateApplicationStatus(applicationId, req.body, adminId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update application",
      });
    }
  };
}
