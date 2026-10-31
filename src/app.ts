
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import healthRoutes from "./modules/health/health.routes.js";
import submissionRoutes from "./modules/submissions/submission.routes.js";
import adminAuthRoutes from "./modules/admin/admin.routes.js";
import adminSubmissionsRoutes from "./modules/admin/submissions.routes.js";
import adminFormLinksRoutes from "./modules/admin/form-links.routes.js";
import formLinkRoutes from "./modules/submissions/form-link.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "https://hr-management-system-nine-lyart.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb",
  })
);

app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "YOYO HRMS Backend is running",
  });
});

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/submissions", submissionRoutes);

app.use("/api/v1/admin/auth", adminAuthRoutes);

app.use("/api/v1/admin/submissions", adminSubmissionsRoutes);

app.use("/api/v1/admin/form-links", adminFormLinksRoutes);

app.use("/api/v1/form-links", formLinkRoutes);

export default app;
