import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "./transaction.service.js";
import { AppError, ErrorCode } from "../../errors/AppError.js";
import { getTransactionsService } from "./transaction.service.js";
import { getTransactionByIdService } from "./transaction.service.js";
import { deleteTransactionByIdService } from "./transaction.service.js";
import { updateTransactionService } from "./transaction.service.js";



export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError("Unauthorized", 401, ErrorCode.TOKEN_INVALID)
      );
    }

    const transaction = await createTransactionService(
      user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};



export const getTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError("Unauthorized", 401, ErrorCode.TOKEN_INVALID)
      );
    }

    const result = await getTransactionsService(
      user.userId,
      req.query
    );

    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};





export const getTransactionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError("Unauthorized", 401, ErrorCode.TOKEN_INVALID)
      );
    }

    // ✅ FIX: handle string | string[]
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return next(
        new AppError("Invalid ID", 400, ErrorCode.VALIDATION_ERROR)
      );
    }

    const transaction = await getTransactionByIdService(
      user.userId,
      id
    );

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};



export const deleteTransactionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError("Unauthorized", 401, ErrorCode.TOKEN_INVALID)
      );
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return next(
        new AppError("Invalid ID", 400, ErrorCode.VALIDATION_ERROR)
      );
    }

    await deleteTransactionByIdService(user.userId, id);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};



export const updateTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError("Unauthorized", 401, ErrorCode.TOKEN_INVALID)
      );
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return next(
        new AppError("Invalid ID", 400, ErrorCode.VALIDATION_ERROR)
      );
    }

    const updatedTransaction = await updateTransactionService(
      user.userId,
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updatedTransaction,
    });
  } catch (err) {
    next(err);
  }
};