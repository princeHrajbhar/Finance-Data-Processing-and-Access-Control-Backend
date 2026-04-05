//Finance_backend\src\middlewares\validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError, ErrorCode } from "../errors/AppError.js";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      return next(new AppError(message, 400, ErrorCode.VALIDATION_ERROR));
    }
    req.body = result.data;
    next();
  };