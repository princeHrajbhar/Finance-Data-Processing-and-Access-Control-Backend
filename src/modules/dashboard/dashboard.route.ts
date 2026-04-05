import { Router } from "express";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

// ─── Viewer + Analyst + Admin ─────────────────────────────
router.get(
  "/summary",
  protect,
  authorize("viewer", "analyst", "admin"),
  dashboardController.getSummary
);

router.get(
  "/category-breakdown",
  protect,
  authorize("viewer", "analyst", "admin"),
  dashboardController.getCategoryBreakdown
);

router.get(
  "/monthly-trends",
  protect,
  authorize("viewer", "analyst", "admin"),
  dashboardController.getMonthlyTrends
);

router.get(
  "/recent",
  protect,
  authorize("viewer", "analyst", "admin"),
  dashboardController.getRecentTransactions
);

// ─── Analyst + Admin ─────────────────────────────
router.get(
  "/analytics",
  protect,
  authorize("analyst", "admin"),
  dashboardController.getAdvancedAnalytics
);

// ─── Admin Only ─────────────────────────────
router.get(
  "/admin/system-stats",
  protect,
  authorize("admin"),
  dashboardController.getSystemStats
);

router.get(
  "/admin/user-analytics",
  protect,
  authorize("admin"),
  dashboardController.getUserAnalytics
);

export default router;