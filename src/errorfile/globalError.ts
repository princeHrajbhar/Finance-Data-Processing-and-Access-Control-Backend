import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    message: err instanceof Error ? err.message : "Unknown error"
  });
};