import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";

export const getSummary = async (_req: Request, res: Response) => {
  res.json(await dashboardService.getSummary());
};

export const getCategoryBreakdown = async (req: Request, res: Response) => {
  const { type } = req.query as { type: string };
  res.json(await dashboardService.getCategoryBreakdown(type));
};

export const getMonthlyTrends = async (_req: Request, res: Response) => {
  res.json(await dashboardService.getMonthlyTrends());
};

export const getRecentTransactions = async (_req: Request, res: Response) => {
  res.json(await dashboardService.getRecentTransactions());
};

export const getAdvancedAnalytics = async (req: Request, res: Response) => {
  res.json(await dashboardService.getAdvancedAnalytics(req.query));
};

export const getSystemStats = async (_req: Request, res: Response) => {
  res.json(await dashboardService.getSystemStats());
};

export const getUserAnalytics = async (_req: Request, res: Response) => {
  res.json(await dashboardService.getUserAnalytics());
};