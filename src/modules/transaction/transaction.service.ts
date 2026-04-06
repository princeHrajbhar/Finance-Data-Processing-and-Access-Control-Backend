import { Transaction } from "./transaction.model.js";
import { AppError, ErrorCode } from "../../errors/AppError.js";
import mongoose from "mongoose";



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




export const getTransactionsService = async (
  userId: string,
  query: any
) => {
  const {
    page = 1,
    limit = 10,
    type,
    category,
    startDate,
    endDate,
    sortBy = "transactionDate",
    order = "desc",
  } = query;

  const filter: any = {
    userId,
  };

  // 🔍 Filters
  if (type) filter.type = type;
  if (category) filter.category = category;

  if (startDate || endDate) {
    filter.transactionDate = {};
    if (startDate) filter.transactionDate.$gte = new Date(startDate);
    if (endDate) filter.transactionDate.$lte = new Date(endDate);
  }

  // 📄 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // 🔃 Sorting
  const sortOrder = order === "asc" ? 1 : -1;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),

    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};




export const getTransactionByIdService = async (
  userId: string,
  transactionId: string
) => {
  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new AppError(
      "Invalid transaction ID",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new AppError(
      "Transaction not found",
      404,
      ErrorCode.USER_NOT_FOUND // ✅ FIXED (use existing code)
    );
  }

  return transaction;
};



export const deleteTransactionByIdService = async (
  userId: string,
  transactionId: string
) => {
  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new AppError(
      "Invalid transaction ID",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new AppError(
      "Transaction not found",
      404,
      ErrorCode.USER_NOT_FOUND
    );
  }

  // ✅ Soft delete
  transaction.isDeleted = true;
  transaction.deletedAt = new Date();

  await transaction.save();

  return;
};



export const updateTransactionService = async (
  userId: string,
  transactionId: string,
  payload: any
) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new AppError(
      "Invalid transaction ID",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new AppError(
      "Transaction not found",
      404,
      ErrorCode.USER_NOT_FOUND
    );
  }

  // 🔥 Recurring validation
  if (payload.isRecurring === true && !payload.recurrenceInterval) {
    throw new AppError(
      "Recurrence interval required",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  if (payload.isRecurring === false && payload.recurrenceInterval) {
    throw new AppError(
      "Invalid recurrence setup",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  Object.assign(transaction, payload);

  transaction.updatedBy = new mongoose.Types.ObjectId(userId);

  await transaction.save();

  return transaction;
};