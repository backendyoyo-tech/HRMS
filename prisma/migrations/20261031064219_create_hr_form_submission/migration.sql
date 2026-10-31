-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "fullName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "aadhaarAddress" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "emergencyContact1Number" TEXT NOT NULL,
    "emergencyContact1Relation" TEXT NOT NULL,
    "emergencyContact2Number" TEXT NOT NULL,
    "emergencyContact2Relation" TEXT NOT NULL,
    "highestQualification" TEXT NOT NULL,
    "instituteName" TEXT NOT NULL,
    "passingYear" INTEGER NOT NULL,
    "previousCompanyName" TEXT,
    "previousCompanyDesignation" TEXT,
    "employmentDuration" TEXT,
    "previousHRName" TEXT,
    "previousHREmail" TEXT,
    "previousHRContactNumber" TEXT,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_submissions_fullName_idx" ON "form_submissions"("fullName");

-- CreateIndex
CREATE INDEX "form_submissions_personalEmail_idx" ON "form_submissions"("personalEmail");

-- CreateIndex
CREATE INDEX "form_submissions_contactNumber_idx" ON "form_submissions"("contactNumber");

-- CreateIndex
CREATE INDEX "form_submissions_status_idx" ON "form_submissions"("status");

-- CreateIndex
CREATE INDEX "form_submissions_createdAt_idx" ON "form_submissions"("createdAt");
