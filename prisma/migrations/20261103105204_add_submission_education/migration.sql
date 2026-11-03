-- CreateTable
CREATE TABLE "submission_educations" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "instituteName" TEXT NOT NULL,
    "passingYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_educations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submission_educations_submissionId_idx" ON "submission_educations"("submissionId");

-- AddForeignKey
ALTER TABLE "submission_educations" ADD CONSTRAINT "submission_educations_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
