import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { resetAdminPassword } from "./admin.service.js";
import { resetAdminPasswordSchema } from "./admin.validation.js";
import {
  createAdminSchema,
  adminLoginSchema,
} from "./admin.validation.js";
import {
  createFirstAdmin,
  getAdminById,
  loginAdmin,
} from "./admin.service.js";

const ACCESS_COOKIE_NAME = "accessToken";
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
}

export const createAdminController: RequestHandler = async (
  req,
  res,
) => {
  const validation = createAdminSchema.safeParse(req.body);

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
    const admin = await createFirstAdmin(validation.data);

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: admin,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_ALREADY_EXISTS") {
      res.status(409).json({
        success: false,
        message: "An admin account already exists",
      });
      return;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
      return;
    }

    console.error("Create admin error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create admin account",
    });
  }
};

export const adminLoginController: RequestHandler = async (req, res) => {
  const validation = adminLoginSchema.safeParse(req.body);

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
    const result = await loginAdmin(validation.data);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    res.cookie(ACCESS_COOKIE_NAME, result.accessToken, {
      ...getCookieOptions(),
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        admin: result.admin,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

export const adminLogoutController: RequestHandler = (_req, res) => {
  res.clearCookie(ACCESS_COOKIE_NAME, getCookieOptions());

  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

export const adminMeController: RequestHandler = async (_req, res) => {
  try {
    const adminId = res.locals.adminId as string;

    const admin = await getAdminById(adminId);

    if (!admin || admin.status !== "ACTIVE") {
      res.status(401).json({
        success: false,
        message: "Admin account is unavailable",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        admin,
      },
    });
  } catch (error) {
    console.error("Admin me error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to get admin details",
    });
  }
};

export const resetAdminPasswordController: RequestHandler = async (
  req,
  res,
) => {
  const validation = resetAdminPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid password reset details",
      errors: validation.error.flatten().fieldErrors,
    });
    return;
  }

  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    res.status(500).json({
      success: false,
      message: "Authentication configuration error",
    });
    return;
  }

  let adminId: string;

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;

    const tokenAdminId =
      payload.adminId ?? payload.id ?? payload.sub;

    if (typeof tokenAdminId !== "string" || !tokenAdminId) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    adminId = tokenAdminId;
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
    return;
  }

  const { oldPassword, newPassword } = validation.data;

  try {
    await resetAdminPassword(adminId, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_OLD_PASSWORD") {
        res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
        return;
      }

      if (error.message === "ADMIN_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Admin account not found or inactive",
        });
        return;
      }
    }

    console.error("Admin password reset error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to change password",
    });
  }
};