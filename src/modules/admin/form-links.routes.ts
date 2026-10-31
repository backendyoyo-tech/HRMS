import { Router } from "express";
import { requireAdmin } from "./auth.middleware.js";
import {
  createFormShareLinkController,
  revokeFormShareLinkController,
} from "./form-links.controller.js";

const router = Router();

router.post("/", requireAdmin, createFormShareLinkController);

router.patch(
  "/:id/revoke",
  requireAdmin,
  revokeFormShareLinkController,
);

export default router;