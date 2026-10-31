import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../../lib/prisma.js";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getFrontendFormUrl(): string {
  const url = process.env.HR_FORM_FRONTEND_URL?.trim();

  if (!url) {
    throw new Error("HR_FORM_FRONTEND_URL is not configured");
  }

  return url.replace(/\/+$/, "");
}

export async function createFormShareLink(
  adminId: string,
  expiresAt?: Date,
) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const link = await prisma.formShareLink.create({
    data: {
      tokenHash,
      createdByAdminId: adminId,
      expiresAt: expiresAt ?? null,
    },
    select: {
      id: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  const frontendUrl = getFrontendFormUrl();
  const shareUrl = `${frontendUrl}?token=${encodeURIComponent(token)}`;

  return {
    ...link,
    shareUrl,
  };
}

export async function validateFormShareToken(token: string) {
  const tokenHash = hashToken(token);

  const link = await prisma.formShareLink.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (!link || link.revokedAt) {
    return null;
  }

  if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    id: link.id,
    expiresAt: link.expiresAt,
  };
}

export async function revokeFormShareLink(id: string) {
  const link = await prisma.formShareLink.findUnique({
    where: { id },
    select: {
      id: true,
      revokedAt: true,
    },
  });

  if (!link) {
    return false;
  }

  if (!link.revokedAt) {
    await prisma.formShareLink.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  return true;
}