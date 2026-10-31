import { Router } from "express";
import { requireAdmin } from "./auth.middleware.js";
import {
  getAllSubmissionsController,
  getSubmissionByIdController,
} from "./submissions.controller.js";
import { exportSubmissionsExcelController } from "./submissions-export.controller.js";

import { deleteSubmissionController } from "./submission-delete.controller.js";
const router = Router();

router.get("/", requireAdmin, getAllSubmissionsController);
router.get("/:id", requireAdmin, getSubmissionByIdController);
router.get("/export/excel", requireAdmin, exportSubmissionsExcelController);
router.delete("/:id", requireAdmin, deleteSubmissionController);
export default router;