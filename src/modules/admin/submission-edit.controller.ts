import type { RequestHandler } from "express";
import { prisma } from "../../lib/prisma.js";
import { createSubmissionSchema } from "../submissions/submission.validation.js";

export const editSubmissionController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !id.trim()) {
      res.status(400).json({
        success: false,
        message: "A valid submission ID is required",
      });
      return;
    }

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
      return;
    }

    // Reuse the existing submission validation rules.
    // Partial updates are allowed; unknown fields are rejected.
    const validation = createSubmissionSchema.partial().safeParse(req.body);

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

    const {
      educations,
      previousCompanyName,
      previousCompanyDesignation,
      employmentDuration,
      previousHRName,
      previousHREmail,
      previousHRContactNumber,
      ...submissionData
    } = validation.data;

    const updatedSubmission = await prisma.$transaction(async (tx) => {
      const existingSubmission = await tx.formSubmission.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingSubmission) {
        return null;
      }

      return tx.formSubmission.update({
        where: { id },
        data: {
          ...submissionData,

          // Convert explicitly supplied empty optional values to null.
          ...(previousCompanyName !== undefined && {
            previousCompanyName: previousCompanyName || null,
          }),
          ...(previousCompanyDesignation !== undefined && {
            previousCompanyDesignation: previousCompanyDesignation || null,
          }),
          ...(employmentDuration !== undefined && {
            employmentDuration: employmentDuration || null,
          }),
          ...(previousHRName !== undefined && {
            previousHRName: previousHRName || null,
          }),
          ...(previousHREmail !== undefined && {
            previousHREmail: previousHREmail || null,
          }),
          ...(previousHRContactNumber !== undefined && {
            previousHRContactNumber: previousHRContactNumber || null,
          }),

          // Replace education records only when the request includes
          // the educations property. An omitted property changes nothing.
          ...(educations !== undefined && {
            educations: {
              deleteMany: {},
              create: educations.map((education) => ({
                qualification: education.qualification,
                instituteName: education.instituteName,
                passingYear: education.passingYear,
              })),
            },
          }),
        },
        include: {
          educations: true,
        },
      });
    });

    if (!updatedSubmission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Submission updated successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    next(error);
  }
};



