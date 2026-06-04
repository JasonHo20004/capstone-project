// =============================================================================
// Module Controller - HTTP handlers for course module operations
// =============================================================================

import type { Request, Response } from "express";
import { asyncHandler } from "@capstone/common";
import { ModuleService } from "../services/module.service.js";

export class ModuleController {
  private moduleService = new ModuleService();

  getModules = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const modules = await this.moduleService.getByCourseId(courseId);
    res.json({ success: true, data: modules });
  });

  createModule = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const sellerId = req.user!.userId;
    // Whitelist — never forward req.body verbatim (caller could smuggle courseId etc.).
    const { title, description, moduleOrder } = req.body ?? {};
    const module = await this.moduleService.create(courseId, sellerId, {
      title,
      description,
      moduleOrder: moduleOrder !== undefined ? Number(moduleOrder) : undefined,
    });
    res.status(201).json({ success: true, data: module });
  });

  updateModule = asyncHandler(async (req: Request, res: Response) => {
    const moduleId = req.params.moduleId as string;
    const sellerId = req.user!.userId;
    const { title, description, moduleOrder } = req.body ?? {};
    const module = await this.moduleService.update(moduleId, sellerId, {
      title,
      description,
      moduleOrder: moduleOrder !== undefined ? Number(moduleOrder) : undefined,
    });
    res.json({ success: true, data: module });
  });

  deleteModule = asyncHandler(async (req: Request, res: Response) => {
    const moduleId = req.params.moduleId as string;
    const sellerId = req.user!.userId;
    await this.moduleService.delete(moduleId, sellerId);
    res.json({ success: true, message: "Module deleted" });
  });
}
