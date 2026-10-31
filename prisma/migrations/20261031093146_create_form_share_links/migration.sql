-- CreateTable
CREATE TABLE "form_share_links" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdByAdminId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_share_links_tokenHash_key" ON "form_share_links"("tokenHash");

-- CreateIndex
CREATE INDEX "form_share_links_createdByAdminId_idx" ON "form_share_links"("createdByAdminId");

-- CreateIndex
CREATE INDEX "form_share_links_expiresAt_idx" ON "form_share_links"("expiresAt");

-- CreateIndex
CREATE INDEX "form_share_links_revokedAt_idx" ON "form_share_links"("revokedAt");
