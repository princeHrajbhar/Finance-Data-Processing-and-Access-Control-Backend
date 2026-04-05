import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role: "viewer" | "analyst" | "admin";
      sessionId?: string;
    };
  }
}