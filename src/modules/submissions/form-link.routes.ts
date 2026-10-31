import { Router } from "express";
import { validateFormShareLinkController } from "../admin/form-links.controller.js";

const router = Router();

router.get("/validate", validateFormShareLinkController);

export default router;