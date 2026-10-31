
import { Router } from "express";

import { createSubmissionController } from "./submission.controller.js";

const router = Router();

router.post("/", createSubmissionController);

export default router;
