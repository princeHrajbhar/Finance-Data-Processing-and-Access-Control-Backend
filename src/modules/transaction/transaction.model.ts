import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  transactionId: string;

  userId: Types.ObjectId; // ✅ added

  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";

  amount: number;

  senderAccount?: Types.ObjectId;
  receiverAccount?: Types.ObjectId;

  status: "PENDING" | "SUCCESS" | "FAILED";

  description?: string;

  balanceBefore: number;
  balanceAfter: number;

  processedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 fast queries
    },

    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW", "TRANSFER"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    senderAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },

    receiverAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
      index: true,
    },

    description: String,

    balanceBefore: Number,
    balanceAfter: Number,

    processedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);