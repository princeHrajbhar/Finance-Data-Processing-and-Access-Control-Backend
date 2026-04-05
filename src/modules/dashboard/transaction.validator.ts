import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),

  type: z.enum(["INCOME", "EXPENSE"]),

  category: z.string().min(1),

  subCategory: z.string().min(1, "Subcategory is required"), // ✅ required

  currency: z.string().default("INR"),

  note: z
    .string()
    .min(1, "Note is required")
    .max(500), // ✅ required

  referenceId: z.string().optional(),

  paymentMethod: z.enum([
    "CASH",
    "CARD",
    "UPI",
    "BANK_TRANSFER",
    "OTHER",
  ]), // ✅ required

  transactionDate: z.coerce.date(),

  isRecurring: z.boolean().optional(),

  recurrenceInterval: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),
});



export const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),

  type: z.enum(["INCOME", "EXPENSE"]).optional(),

  category: z.string().min(1).optional(),

  subCategory: z.string().min(1).optional(),

  currency: z.string().optional(),

  note: z.string().max(500).optional(),

  referenceId: z.string().optional(),

  paymentMethod: z
    .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "OTHER"])
    .optional(),

  transactionDate: z.coerce.date().optional(),

  isRecurring: z.boolean().optional(),

  recurrenceInterval: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),
});