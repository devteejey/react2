import { Router } from "express";
import User from "../models/User.js";
import { requireAdministrator, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireAdministrator, async (_request, response, next) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const [totalUsers, activeUsers, pendingUsers, inactiveUsers, newUsers, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "Active" }),
      User.countDocuments({ status: "Pending" }),
      User.countDocuments({ status: "Inactive" }),
      User.countDocuments({ createdAt: { $gte: since } }),
      User.find()
        .select("name email role status createdAt")
        .sort({ createdAt: -1 })
        .limit(4),
    ]);

    response.json({
      stats: { totalUsers, activeUsers, pendingUsers, inactiveUsers, newUsers },
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
