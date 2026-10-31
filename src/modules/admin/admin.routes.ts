import { Router } from "express";
import {
  createAdminController,
  adminLoginController,
  adminLogoutController,
  adminMeController,
  resetAdminPasswordController,
} from "./admin.controller.js";
import { requireAdmin } from "./auth.middleware.js";

const router = Router();

router.post("/create-account", createAdminController);
router.post("/login", adminLoginController);
router.post("/logout", requireAdmin, adminLogoutController);
router.get("/me", requireAdmin, adminMeController);
router.post("/reset-password", requireAdmin, resetAdminPasswordController);

export default router;