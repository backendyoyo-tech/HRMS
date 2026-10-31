import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

type AdminTokenPayload = {
  sub: string;
  role: "ADMIN";
};

function getAccessTokenSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET is missing or too short");
  }

  return secret;
}

export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      getAccessTokenSecret(),
    ) as AdminTokenPayload;

    if (!decoded.sub || decoded.role !== "ADMIN") {
      res.status(401).json({
        success: false,
        message: "Invalid admin token",
      });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!admin || admin.status !== "ACTIVE" || admin.role !== "ADMIN") {
      res.status(401).json({
        success: false,
        message: "Admin account is inactive or unavailable",
      });
      return;
    }

    res.locals.adminId = admin.id;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};