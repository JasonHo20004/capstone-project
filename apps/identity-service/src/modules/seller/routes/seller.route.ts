import { Router } from "express";
import multer from "multer";
import { SellerController } from "../controllers/seller.controller.js";
import { authenticateToken, requireSeller } from "@capstone/common";

const router: Router = Router();
const controller = new SellerController();

// In-memory storage; files uploaded to S3 in controller.
// Limits: max 5MB per file, max 10 files, image MIME only.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG or WebP images are allowed"));
    }
  },
});

// ===== User Routes (Authenticated) =====

// Apply to become a course seller (multipart: images[], expertise[], message?)
router.post(
  "/apply",
  authenticateToken,
  upload.array("images", 10),
  controller.applyForSeller
);

// Get my application status
router.get("/application", authenticateToken, controller.getMyApplication);

// Get my seller profile
router.get("/profile", authenticateToken, requireSeller, controller.getMyProfile);

// Update my seller profile (multipart: images[] = new certs, certification[] = kept URLs, expertise[])
router.put(
  "/profile",
  authenticateToken,
  requireSeller,
  upload.array("images", 10),
  controller.updateMyProfile
);

export default router;
