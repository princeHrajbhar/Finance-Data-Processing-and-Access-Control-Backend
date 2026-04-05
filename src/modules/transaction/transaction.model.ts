import mongoose, { Schema, Document } from "mongoose";

// ─── Types ───────────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "UPI"
  | "BANK_TRANSFER"
  | "OTHER";

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;

  // Ownership
  userId: mongoose.Types.ObjectId;

  // Core Financial Data
  amount: number;
  type: TransactionType;
  category: string;
  subCategory?: string;

  // Currency
  currency: string;

  // Extra Fields
  note?: string;
  referenceId?: string;
  paymentMethod?: PaymentMethod;

  // Dates
  transactionDate: Date;
  recordedAt: Date;

  // Recurring
  isRecurring: boolean;
  recurrenceInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;

  // Audit
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ──────────────────────────────────────────────────────────────

const transactionSchema = new Schema<ITransaction>(
  {
    // Ownership
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Core Fields
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    // Currency
    currency: {
      type: String,
      default: "INR",
    },

    // Extra Fields
    note: {
      type: String,
      required: true,
      maxlength: 500,
    },

    referenceId: {
      type: String,
      index: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["CASH", "CARD", "UPI", "BANK_TRANSFER", "OTHER"],
      default: "OTHER",
    },

    // Dates
    transactionDate: {
      type: Date,
      required: true,
      index: true,
    },

    recordedAt: {
      type: Date,
      default: () => new Date(),
    },

    // Recurring
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrenceInterval: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
    },

    // Audit
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────

// Dashboard queries
transactionSchema.index({ userId: 1, transactionDate: -1 });

// Filtering
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });

// Soft delete optimization
transactionSchema.index({ userId: 1, isDeleted: 1 });

// Advanced analytics index (🔥 pro level)
transactionSchema.index({
  userId: 1,
  type: 1,
  category: 1,
  transactionDate: -1,
});

// ─── Validation Middleware ───────────────────────────────────────────────

transactionSchema.pre("save", async function () {
  // Amount must be positive
  if (this.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  // Recurring validation
  if (this.isRecurring && !this.recurrenceInterval) {
    throw new Error("Recurrence interval required for recurring transactions");
  }

  if (!this.isRecurring && this.recurrenceInterval) {
    throw new Error(
      "Recurrence interval should not exist if not recurring"
    );
  }
});

// ─── Model ───────────────────────────────────────────────────────────────

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);