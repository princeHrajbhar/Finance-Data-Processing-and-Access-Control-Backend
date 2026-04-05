import { Transaction } from "./transaction.model.js";
import { AppError, ErrorCode } from "../../errors/AppError.js";



export const createTransactionService = async (
  userId: string,
  payload: any
) => {
  // 🔥 recurring validation
  if (payload.isRecurring && !payload.recurrenceInterval) {
    throw new AppError(
      "Recurrence interval required",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  if (!payload.isRecurring && payload.recurrenceInterval) {
    throw new AppError(
      "Invalid recurrence setup",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  const transaction = await Transaction.create({
    ...payload,
    userId,
    createdBy: userId,
  });

  return transaction;
};