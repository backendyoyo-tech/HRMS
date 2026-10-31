
import type { Request, Response } from "express";

import { createSubmissionSchema } from "./submission.validation.js";
import { createSubmission } from "./submission.service.js";

export const createSubmissionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validation = createSubmissionSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  try {
    const submission = await createSubmission(validation.data);

    res.status(201).json({
      success: true,
      message: "HR form submitted successfully",
      data: submission,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to save HR form",
    });
  }
};
