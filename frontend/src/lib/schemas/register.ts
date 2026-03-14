import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\D/, "Password can't be entirely numeric"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
