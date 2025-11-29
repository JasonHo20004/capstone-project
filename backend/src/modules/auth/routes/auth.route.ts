import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "@/middlewares/validations.middleware";
import { verifyEmailDTO } from "@/modules/auth/dtos/verify-email.dto";

const router = Router();

const authController = new AuthController();
router.post("/login", authController.loginController);
router.post("/refresh", authController.refreshTokenController);
router.post("/logout", authController.logoutController);
router.get("/verify", validate(verifyEmailDTO), authController.verifyEmailController);

export default router;