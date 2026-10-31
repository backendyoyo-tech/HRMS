import type { RequestHandler } from "express";
import {
  createFormShareLink,
  revokeFormShareLink,
  validateFormShareToken,
} from "./form-links.service.js";

export const createFormShareLinkController: RequestHandler = async (
  req,
  res,
) => {
  const expiresAtInput = req.body?.expiresAt;

  let expiresAt: Date | undefined;

  if (expiresAtInput !== undefined && expiresAtInput !== null) {
    if (typeof expiresAtInput !== "string") {
      res.status(400).json({
        success: false,
        message: "expiresAt must be an ISO date string",
      });
      return;
    }

    expiresAt = new Date(expiresAtInput);

    if (
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt.getTime() <= Date.now()
    ) {
      res.status(400).json({
        success: false,
        message: "expiresAt must be a valid future date",
      });
      return;
    }
  }

  try {
    const adminId = res.locals.adminId as string;

    const link = await createFormShareLink(adminId, expiresAt);

    res.status(201).json({
      success: true,
      message: "Shareable HR form link created successfully",
      data: link,
    });
  } catch (error) {
    console.error("Create form share link error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create form share link",
    });
  }
};

export const validateFormShareLinkController: RequestHandler = async (
  req,
  res,
) => {
  const token = req.query.token;

  if (typeof token !== "string" || token.length !== 64) {
    res.status(400).json({
      success: false,
      message: "A valid form link token is required",
    });
    return;
  }

  try {
    const link = await validateFormShareToken(token);

    if (!link) {
      res.status(410).json({
        success: false,
        message: "This HR form link is invalid, expired, or deactivated",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "HR form link is valid",
      data: {
        valid: true,
        expiresAt: link.expiresAt,
      },
    });
  } catch (error) {
    console.error("Validate form share link error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to validate form link",
    });
  }
};

export const revokeFormShareLinkController: RequestHandler = async (
  req,
  res,
) => {
  const id = req.params.id;

  if (typeof id !== "string" || id.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: "A valid form link ID is required",
    });
    return;
  }

  try {
    const revoked = await revokeFormShareLink(id);

    if (!revoked) {
      res.status(404).json({
        success: false,
        message: "Form share link not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Form share link deactivated successfully",
    });
  } catch (error) {
    console.error("Revoke form share link error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to deactivate form share link",
    });
  }
};