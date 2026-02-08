import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { userRequest } from "../types/userRequest";

export const getDashboard: RequestHandler = async (req, res) => {
  try {
    const userReq = req as userRequest;
    const userId = userReq.user.id;

    // ⏱️ tahun sekarang
    const currentYear = new Date().getFullYear();

    // range 1 tahun
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const [totalUsers, totalTasks, transactions] = await Promise.all([
      prisma.user.count(),
      prisma.task.count({
        where: { createdById: userId },
      }),
      prisma.transaction.findMany({
        where: {
          createdById: userId,
          transactionDate: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
        select: {
          price: true,
          typeTransaction: true,
          transactionDate: true,
        },
      }),
    ]);

    // ===== TOTAL =====
    let totalIncome = 0;
    let totalExpense = 0;

    // ===== MONTHLY (12 BULAN) =====
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    transactions.forEach((t) => {
      const monthIndex = new Date(t.transactionDate).getMonth(); // 0–11

      if (t.typeTransaction === "INCOME") {
        totalIncome += t.price;
        monthlyIncome[monthIndex] += t.price;
      }

      if (t.typeTransaction === "EXPENSE") {
        totalExpense += t.price;
        monthlyExpense[monthIndex] += t.price;
      }
    });

    // =========================
    // 🔽 TAMBAHAN (TANPA UBAH YANG LAMA)
    // =========================

    // 🎯 target bulanan (sementara hardcode)
    const monthlyTarget = 5000;

    // 📆 bulan sekarang
    const currentMonthIndex = new Date().getMonth();
    const currentMonthIncome = monthlyIncome[currentMonthIndex];

    // 📅 income hari ini
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayIncome = transactions.reduce((sum, t) => {
      const date = new Date(t.transactionDate);
      if (
        t.typeTransaction === "INCOME" &&
        date >= startOfToday &&
        date <= endOfToday
      ) {
        return sum + t.price;
      }
      return sum;
    }, 0);

    // 📊 progress radial (%)
    const progressPercent =
      monthlyTarget > 0
        ? Math.min(Math.round((currentMonthIncome / monthlyTarget) * 100), 100)
        : 0;

    return res.status(200).json({
      message: "Dashboard summary fetched successfully",
      data: {
        year: currentYear,
        totalUsers,
        totalTasks,
        totalIncome,
        totalExpense,
        monthlyIncome,
        monthlyExpense,

        // 🔥 DATA BARU (UNTUK UI)
        monthlyTarget,
        currentMonthIncome,
        todayIncome,
        progressPercent,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
