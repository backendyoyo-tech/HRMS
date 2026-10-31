import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import type { CreateAdminInput, AdminLoginInput } from "./admin.validation.ts";

const ACCESS_TOKEN_EXPIRES_IN = "15m";

function getAccessTokenSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET is missing or too short");
  }

  return secret;
}

export async function createFirstAdmin(input: CreateAdminInput) {
  const existingAdminCount = await prisma.admin.count();

  if (existingAdminCount > 0) {
    throw new Error("ADMIN_ALREADY_EXISTS");
  }

  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  return prisma.admin.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function loginAdmin(input: AdminLoginInput) {
  const admin = await prisma.admin.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!admin || admin.status !== "ACTIVE") {
    return null;
  }

  const passwordIsValid = await argon2.verify(
    admin.passwordHash,
    input.password,
  );

  if (!passwordIsValid) {
    return null;
  }

  const accessToken = jwt.sign(
    {
      sub: admin.id,
      role: admin.role,
    },
    getAccessTokenSecret(),
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  return {
    accessToken,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
    },
  };
}

export async function getAdminById(id: string) {
  return prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
}