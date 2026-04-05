//Finance_backend\src\middlewares\auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { Session } from "../modules/auth/auth.model.js";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../modules/auth/auth.jwt.js";
import { AppError, ErrorCode } from "../errors/AppError.js";


export interface AuthRequest extends Request {
  user?: { userId: string; role: string; sessionId?: string };
}

// ─── protect ────────────────────────────────────────────────────────────────

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.accessToken;
console.log("cookies:", req.cookies);
console.log("headers:", req.headers.cookie);
    if (!token) {
      return next(new AppError("Authentication required", 401, ErrorCode.TOKEN_INVALID));
    }

    const decoded = verifyAccessToken(token);

    // 🔥 IMPORTANT: check session in DB
    const session = await Session.findById(decoded.sessionId);

    if (!session || session.expiresAt < new Date()) {
      return next(new AppError("Session expired", 401, ErrorCode.SESSION_NOT_FOUND));
    }

    // attach user
    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Session expired", 401, ErrorCode.TOKEN_EXPIRED));
    }

    return next(new AppError("Invalid token", 401, ErrorCode.TOKEN_INVALID));
  }
};
// ─── authorize ──────────────────────────────────────────────────────────────

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403, ErrorCode.FORBIDDEN));
    }
    next();
  };
};