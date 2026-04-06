//Finance_backend\src\modules\auth\auth.jwt.ts
import jwt from "jsonwebtoken";
import { AppError, ErrorCode } from "../../errors/AppError.js";

const getSecret = (key: string): string => {
  const secret = process.env[key];
  if (!secret) throw new Error(`Missing required env var: ${key}`);
  return secret;
};

// ─── Access token (short-lived, carries identity + role) ────────────────────

export type UserRole = "viewer" | "analyst" | "admin";

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;   
  sessionId: string;
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, getSecret("JWT_ACCESS_SECRET"), { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, getSecret("JWT_ACCESS_SECRET")) as AccessTokenPayload;
};


export const generateAccessTokenForSession = (
  userId: string,
  role: string, 
  sessionId: string
): string =>
  generateAccessToken({
    userId,
    role: role as UserRole, 
    sessionId,
  });