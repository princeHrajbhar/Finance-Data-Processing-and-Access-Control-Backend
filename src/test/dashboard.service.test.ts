import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Transaction } from "../modules/transaction/transaction.model";
import { User } from "../modules/auth/auth.model";
import * as service from "../modules/dashboard/dashboard.service";

// ⏱️ Increase timeout (IMPORTANT)
jest.setTimeout(20000);

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  await Transaction.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    email: "test@test.com",
    password: "123456",
    isVerified: true,
    role: "admin"
  });

  // ✅ Insert test data
  await Transaction.insertMany([
    {
      userId: user._id,
      amount: 10000,
      type: "INCOME",
      category: "Salary",
      subCategory: "Monthly",
      currency: "INR",
      note: "Salary",
      paymentMethod: "BANK_TRANSFER",
      transactionDate: new Date("2026-04-01"),
      isRecurring: false,
      isDeleted: false,
      createdBy: user._id
    },
    {
      userId: user._id,
      amount: 5000,
      type: "INCOME",
      category: "Freelance",
      subCategory: "Project",
      currency: "INR",
      note: "Freelance work",
      paymentMethod: "UPI",
      transactionDate: new Date("2026-04-02"),
      isRecurring: false,
      isDeleted: false,
      createdBy: user._id
    },
    {
      userId: user._id,
      amount: 2000,
      type: "EXPENSE",
      category: "Food",
      subCategory: "Dining",
      currency: "INR",
      note: "Dinner",
      paymentMethod: "CARD",
      transactionDate: new Date("2026-04-03"),
      isRecurring: false,
      isDeleted: false,
      createdBy: user._id
    }
  ]);
});

describe("Dashboard Service Tests", () => {

  // ✅ 1. Summary
  test("getSummary should return correct totals", async () => {
    const result = await service.getSummary();

    expect(result).toEqual({
      totalIncome: 15000,
      totalExpense: 2000,
      netBalance: 13000
    });
  });

  // ✅ 2. Category Breakdown
  test("getCategoryBreakdown should group expenses", async () => {
    const result = await service.getCategoryBreakdown("EXPENSE");

    expect(result.length).toBe(1);
    expect(result[0]._id).toBe("Food");
    expect(result[0].total).toBe(2000);
  });

  // ✅ 3. Monthly Trends
  test("getMonthlyTrends should return aggregated data", async () => {
    const result = await service.getMonthlyTrends();

    expect(result.length).toBe(1);
    expect(result[0].income).toBe(15000);
    expect(result[0].expense).toBe(2000);
  });

  // ✅ 4. Recent Transactions
  test("getRecentTransactions should return latest transactions", async () => {
    const result = await service.getRecentTransactions();

    expect(result.length).toBeGreaterThan(0);
  });

  // ✅ 5. Advanced Analytics
  test("getAdvancedAnalytics should filter by type", async () => {
    const result = await service.getAdvancedAnalytics({ type: "EXPENSE" });

    expect(result.length).toBe(1);
    expect(result[0]._id).toBe("Food");
  });

  // ✅ 6. System Stats
  test("getSystemStats should return system stats", async () => {
    const result = await service.getSystemStats();

    expect(result.totalUsers).toBe(1);
    expect(result.totalTransactions).toBe(3);
    expect(result.totalRevenue).toBe(15000);
  });

  // ✅ 7. User Analytics
  test("getUserAnalytics should group by user", async () => {
    const result = await service.getUserAnalytics();

    expect(result.length).toBe(1);
    expect(result[0].totalSpent).toBe(2000);
    expect(result[0].totalEarned).toBe(15000);
  });

});