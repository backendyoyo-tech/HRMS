import type { RequestHandler } from "express";
import {
  getAllSubmissions,
  getSubmissionById,
} from "./submissions.service.js";

export const getAllSubmissionsController: RequestHandler = async (
  req,
  res,
) => {
  const pageParam = req.query.page;
  const limitParam = req.query.limit;

  const page = Number(pageParam ?? 1);
  const limit = Number(limitParam ?? 20);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    res.status(400).json({
      success: false,
      message: "Page must be >= 1 and limit must be between 1 and 100",
    });
    return;
  }

  try {
    const result = await getAllSubmissions(page, limit);

    res.status(200).json({
      success: true,
      message: "Submissions retrieved successfully",
      data: result.submissions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get all submissions error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve submissions",
    });
  }
};

export const getSubmissionByIdController: RequestHandler = async (
  req,
  res,
) => {
  const id = req.params.id;

  if (typeof id !== "string" || id.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: "A valid submission ID is required",
    });
    return;
  }

  try {
    const submission = await getSubmissionById(id);

    if (!submission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Submission retrieved successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Get submission by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve submission",
    });
  }
};