import { Router } from "express";
import { requireAdmin } from "./auth.middleware.js";
import {
  getAllSubmissionsController,
  getSubmissionByIdController,
} from "./submissions.controller.js";

const router = Router();

router.get("/", requireAdmin, getAllSubmissionsController);
router.get("/:id", requireAdmin, getSubmissionByIdController);

export default router;