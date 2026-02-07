import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { userRequest } from "../types/userRequest";

export const getDashboard: RequestHandler = async (req, res) => {
  try {
    const userReq = req as userRequest;
    const userId = userReq.user.id;

    const [totalUsers, totalTasks, transactions] = await Promise.all([
      prisma.user.count(),
      prisma.task.count({
        where: { createdById: userId },
      }),
      prisma.transaction.findMany({
        where: { createdById: userId },
      }),
    ]);

    const income = transactions
      .filter((t) => t.typeTransaction === "INCOME")
      .reduce((sum, t) => sum + t.price, 0);

    const expense = transactions
      .filter((t) => t.typeTransaction === "EXPENSE")
      .reduce((sum, t) => sum + t.price, 0);

    return res.status(200).json({
      message: "Dashboard summary fetched successfully",
      data: {
        totalUsers,
        totalTasks,
        totalIncome: income,
        totalExpense: expense,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
