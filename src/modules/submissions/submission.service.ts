
import { prisma } from "../../lib/prisma.js";

import type { CreateSubmissionInput } from "./submission.validation.js";

export const createSubmission = async (
  data: CreateSubmissionInput
) => {
  const submission = await prisma.formSubmission.create({
    data: {
      fullName: data.fullName,
      designation: data.designation,
      personalEmail: data.personalEmail,
      contactNumber: data.contactNumber,

      aadhaarNumber: data.aadhaarNumber,
      panNumber: data.panNumber,
      maritalStatus: data.maritalStatus,

      aadhaarAddress: data.aadhaarAddress,
      currentAddress: data.currentAddress,

      emergencyContact1Number: data.emergencyContact1Number,
      emergencyContact1Relation: data.emergencyContact1Relation,

      emergencyContact2Number: data.emergencyContact2Number,
      emergencyContact2Relation: data.emergencyContact2Relation,

      highestQualification: data.highestQualification,
      instituteName: data.instituteName,
      passingYear: data.passingYear,

      educations: data.educations?.length
        ? {
          create: data.educations.map((education) => ({
            qualification: education.qualification,
            instituteName: education.instituteName,
            passingYear: education.passingYear,
          })),
        }
        : undefined,

      previousCompanyName: data.previousCompanyName || null,
      previousCompanyDesignation:
        data.previousCompanyDesignation || null,
      employmentDuration: data.employmentDuration || null,
      previousHRName: data.previousHRName || null,
      previousHREmail: data.previousHREmail || null,
      previousHRContactNumber:
        data.previousHRContactNumber || null,

      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      bankName: data.bankName,
    },

    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  return submission;
};


