import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";

// ✅ Summary
export const getSummary = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = await dashboardService.getSummary(req.user.userId);
  res.json(data);
};

// ✅ Category Breakdown
export const getCategoryBreakdown = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { type } = req.query as { type: string };

  const data = await dashboardService.getCategoryBreakdown(
    req.user.userId,
    type
  );

  res.json(data);
};

// ✅ Monthly Trends
export const getMonthlyTrends = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = await dashboardService.getMonthlyTrends(req.user.userId);
  res.json(data);
};

// ✅ Recent Transactions
export const getRecentTransactions = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = await dashboardService.getRecentTransactions(
    req.user.userId
  );
  res.json(data);
};

// ✅ Advanced Analytics (Analyst + Admin)
export const getAdvancedAnalytics = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = await dashboardService.getAdvancedAnalytics(
    req.user.userId,
    req.query
  );

  res.json(data);
};

// ✅ Admin: System Stats
export const getSystemStats = async (_req: Request, res: Response) => {
  const data = await dashboardService.getSystemStats();
  res.json(data);
};

// ✅ Admin: User Analytics
export const getUserAnalytics = async (_req: Request, res: Response) => {
  const data = await dashboardService.getUserAnalytics();
  res.json(data);
};