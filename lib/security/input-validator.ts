import { z } from "zod"

// UPI ID validation
export const upiIdSchema = z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/, "Invalid UPI ID format")

// Amount validation
export const amountSchema = z
  .number()
  .positive("Amount must be positive")
  .max(100000, "Single transaction limit exceeded")

// Email validation
export const emailSchema = z.string().email("Invalid email format")

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^a-zA-Z0-9]/, "Must contain special character")

// Phone number validation
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")

// Transaction description validation
export const descriptionSchema = z.string().max(500, "Description too long").optional()

// Payment request validation
export const paymentRequestSchema = z.object({
  recipient_upi_id: upiIdSchema,
  amount: amountSchema,
  reason: z.string().max(500, "Reason too long").optional(),
})

// Send money validation
export const sendMoneySchema = z.object({
  recipient_upi_id: upiIdSchema,
  amount: amountSchema,
  description: descriptionSchema,
})

// User profile validation
export const userProfileSchema = z.object({
  upi_id: upiIdSchema,
  phone_number: phoneSchema,
  full_name: z.string().min(2, "Name too short").max(100, "Name too long"),
})
