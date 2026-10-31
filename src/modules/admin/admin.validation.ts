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