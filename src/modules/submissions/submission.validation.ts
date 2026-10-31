import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const createSubmissionSchema = z
  .object({
    fullName: z.string().trim().min(2).max(150),
    designation: z.string().trim().min(2).max(150),

    personalEmail: z.string().trim().email().max(255),
    contactNumber: phoneSchema,

    aadhaarNumber: z
      .string()
      .trim()
      .regex(/^\d{12}$/, "Aadhaar must contain exactly 12 digits"),

    panNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Enter a valid PAN number"),

    maritalStatus: z.string().trim().min(2).max(50),

    aadhaarAddress: z.string().trim().min(5).max(1000),
    currentAddress: z.string().trim().min(5).max(1000), //optional

    emergencyContact1Number: phoneSchema,
    emergencyContact1Relation: z.string().trim().min(2).max(100),

    emergencyContact2Number: phoneSchema,
    emergencyContact2Relation: z.string().trim().min(2).max(100),

    highestQualification: z.string().trim().min(2).max(200),
    instituteName: z.string().trim().min(2).max(200),
    passingYear: z.number().int().min(1950).max(2100),
     

    //optional
    previousCompanyName: z.string().trim().max(200).optional(),
    previousCompanyDesignation: z.string().trim().max(150).optional(),
    employmentDuration: z.string().trim().max(100).optional(),
    previousHRName: z.string().trim().max(150).optional(),
    previousHREmail: z.string().trim().email().max(255).optional(),
    previousHRContactNumber: phoneSchema.optional(),

    accountHolderName: z.string().trim().min(2).max(150),
    accountNumber: z.string().trim().min(6).max(34),
    ifscCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code"),
    bankName: z.string().trim().min(2).max(150),
  })
  .strict();

export type CreateSubmissionInput = z.infer<
  typeof createSubmissionSchema
>;