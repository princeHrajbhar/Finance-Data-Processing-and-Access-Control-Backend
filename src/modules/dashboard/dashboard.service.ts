import { Transaction } from "../transaction/transaction.model";
import { User } from "../auth/auth.model";

// ─── 1. GLOBAL SUMMARY ─────────────────────────────────
export const getSummary = async () => {
  const result = await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let income = 0, expense = 0;

  result.forEach((r) => {
    if (r._id === "INCOME") income = r.total;
    if (r._id === "EXPENSE") expense = r.total;
  });

  return {
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense
  };
};

// ─── 2. GLOBAL CATEGORY BREAKDOWN ──────────────────────
export const getCategoryBreakdown = async (type: string) => {
  return await Transaction.aggregate([
    {
      $match: {
        type,
        isDeleted: false
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    }
  ]);
};

// ─── 3. GLOBAL MONTHLY TRENDS ──────────────────────────
export const getMonthlyTrends = async () => {
  return await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: "$transactionDate" },
          month: { $month: "$transactionDate" }
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0]
          }
        }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
};

// ─── 4. GLOBAL RECENT TRANSACTIONS ─────────────────────
export const getRecentTransactions = async () => {
  return await Transaction.find({
    isDeleted: false
  })
    .sort({ transactionDate: -1 })
    .limit(5);
};

// ─── 5. GLOBAL ADVANCED ANALYTICS ──────────────────────
export const getAdvancedAnalytics = async (query: any) => {
  const { startDate, endDate, type, category } = query;

  const match: any = { isDeleted: false };

  if (startDate && endDate) {
    match.transactionDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (type) match.type = type;
  if (category) match.category = category;

  return await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    }
  ]);
};

// ─── 6. ADMIN: SYSTEM STATS ────────────────────────────
export const getSystemStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalTransactions = await Transaction.countDocuments();

  const totalRevenue = await Transaction.aggregate([
    { $match: { type: "INCOME", isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  return {
    totalUsers,
    totalTransactions,
    totalRevenue: totalRevenue[0]?.total || 0
  };
};

// ─── 7. ADMIN: USER ANALYTICS ──────────────────────────
export const getUserAnalytics = async () => {
  return await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$userId",
        totalSpent: {
          $sum: {
            $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0]
          }
        },
        totalEarned: {
          $sum: {
            $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0]
          }
        }
      }
    }
  ]);
};