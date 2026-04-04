export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string; // machine-readable error code for client logic

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Named error codes ───────────────────────────────────────────────────────
// Centralised so clients can branch on code, not message strings.

export const ErrorCode = {
  // Auth
  USER_EXISTS:            "USER_EXISTS",
  USER_NOT_FOUND:         "USER_NOT_FOUND",
  INVALID_CREDENTIALS:    "INVALID_CREDENTIALS",
  ACCOUNT_NOT_VERIFIED:   "ACCOUNT_NOT_VERIFIED",
  // OTP
  OTP_NOT_FOUND:          "OTP_NOT_FOUND",
  OTP_EXPIRED:            "OTP_EXPIRED",
  OTP_INVALID:            "OTP_INVALID",
  OTP_MAX_ATTEMPTS:       "OTP_MAX_ATTEMPTS",
  OTP_COOLDOWN:           "OTP_COOLDOWN",
  // Session / token
  SESSION_NOT_FOUND:      "SESSION_NOT_FOUND",
  TOKEN_INVALID:          "TOKEN_INVALID",
  TOKEN_EXPIRED:          "TOKEN_EXPIRED",
  SESSION_LIMIT_REACHED:  "SESSION_LIMIT_REACHED",
  // General
  VALIDATION_ERROR:       "VALIDATION_ERROR",
  FORBIDDEN:              "FORBIDDEN",
  INTERNAL:               "INTERNAL",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];