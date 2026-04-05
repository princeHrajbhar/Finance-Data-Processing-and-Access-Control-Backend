import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "./transaction.service.js";
import { AppError, ErrorCode } from "../../errors/AppError.js";


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