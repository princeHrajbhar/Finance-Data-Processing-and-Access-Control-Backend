//Finance_backend\src\modules\auth\auth.validators.ts
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(254, "Email too long")
  .toLowerCase()
  .trim();

const otpField = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d+$/, "OTP must be numeric");

export const registerSchema = z.object({
  email:    emailSchema,
  password: passwordSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp:   otpField,
});

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, "Password is required").max(128),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email:       emailSchema,
  otp:         otpField,
  newPassword: passwordSchema,
});

export const resendOtpSchema = z.object({
  email: emailSchema,
  type:  z.enum(["REGISTER", "FORGOT_PASSWORD"]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword:     passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must differ from current password",
    path: ["newPassword"],
  });