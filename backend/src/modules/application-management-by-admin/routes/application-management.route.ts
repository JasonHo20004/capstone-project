import { Router } from "express";
import { ApplicationManagementController } from "@/modules/application-management-by-admin/controllers/application-management.controller";
import { authMiddleware, checkRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const controller = new ApplicationManagementController();

// Apply auth middleware
router.use(authMiddleware);
router.use(checkRole([UserRole.ADMINISTRATOR]));

// GET /api/admin/applications - Get all applications
router.get("/", controller.getAllApplications);

// GET /api/admin/applications/:id - Get application by ID
router.get("/:id", controller.getApplicationById);

// PUT /api/admin/applications/:id - Update application status
router.put("/:id", controller.updateApplicationStatus);

export default router;
