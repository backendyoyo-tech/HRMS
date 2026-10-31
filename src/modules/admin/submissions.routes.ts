import { Router } from "express";
import { requireAdmin } from "./auth.middleware.js";
import {
  getAllSubmissionsController,
  getSubmissionByIdController,
} from "./submissions.controller.js";
import { exportSubmissionsExcelController } from "./submissions-export.controller.js";

const router = Router();

router.get("/", requireAdmin, getAllSubmissionsController);
router.get("/:id", requireAdmin, getSubmissionByIdController);
router.get("/export/excel", requireAdmin, exportSubmissionsExcelController);

export default router;