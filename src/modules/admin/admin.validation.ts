import { z } from "zod";

export const createAdminSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    email: z.string().trim().email().max(255).toLowerCase(),
    password: z.string().min(12).max(128),
  })
  .strict();

export const adminLoginSchema = z
  .object({
    email: z.string().trim().email().max(255).toLowerCase(),
    password: z.string().min(1).max(128),
  })
  .strict();

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const resetAdminPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(12, "New password must be at least 12 characters"),
    confirmNewPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

export type ResetAdminPasswordInput = z.infer<
  typeof resetAdminPasswordSchema
>;