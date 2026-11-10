import { Router } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import { requireAdministrator, requireAuth } from "../middleware/auth.js";

const router = Router();
const roles = new Set(["Administrator", "Editor", "Viewer"]);
const statuses = new Set(["Active", "Pending", "Inactive"]);

router.use(requireAuth, requireAdministrator);

router.get("/", async (_request, response, next) => {
  try {
    const users = await User.find()
      .select("name email role status createdAt updatedAt")
      .sort({ createdAt: -1 });
    response.json({ users });
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.userId)) {
      return response.status(400).json({ message: "User ID is invalid." });
    }
    const user = await User.findById(request.params.userId)
      .select("name email role status createdAt updatedAt");
    if (!user) return response.status(404).json({ message: "User not found." });
    return response.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { name, email, password, role = "Viewer", status = "Active" } = request.body;
    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
      return response.status(400).json({ message: "Name is required and must be at most 80 characters." });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return response.status(400).json({ message: "A valid email address is required." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return response.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (!roles.has(role) || !statuses.has(status)) {
      return response.status(400).json({ message: "Role or status is invalid." });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role,
      status,
    });
    return response.status(201).json({ user: user.toJSON() });
  } catch (error) {
    return next(error);
  }
});

router.put("/:userId", async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.userId)) {
      return response.status(400).json({ message: "User ID is invalid." });
    }
    const { name, email, password, role, status } = request.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
        return response.status(400).json({ message: "Name is required and must be at most 80 characters." });
      }
      updates.name = name.trim();
    }
    if (email !== undefined) {
      if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return response.status(400).json({ message: "A valid email address is required." });
      }
      updates.email = email.trim().toLowerCase();
    }
    if (password !== undefined && password !== "") {
      if (typeof password !== "string" || password.length < 8) {
        return response.status(400).json({ message: "Password must be at least 8 characters." });
      }
      updates.password = await bcrypt.hash(password, 12);
    }
    if (role !== undefined) {
      if (!roles.has(role)) return response.status(400).json({ message: "Role is invalid." });
      updates.role = role;
    }
    if (status !== undefined) {
      if (!statuses.has(status)) return response.status(400).json({ message: "Status is invalid." });
      updates.status = status;
    }
    if (
      request.params.userId === request.user.id &&
      ((updates.status && updates.status !== "Active") ||
        (updates.role && updates.role !== "Administrator"))
    ) {
      return response.status(400).json({ message: "You cannot disable or demote your own administrator account." });
    }

    const user = await User.findByIdAndUpdate(request.params.userId, updates, {
      new: true,
      runValidators: true,
    }).select("name email role status createdAt updatedAt");

    if (!user) return response.status(404).json({ message: "User not found." });
    return response.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:userId", async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.userId)) {
      return response.status(400).json({ message: "User ID is invalid." });
    }
    if (request.params.userId === request.user.id) {
      return response.status(400).json({ message: "You cannot delete your own account." });
    }
    const user = await User.findByIdAndDelete(request.params.userId);
    if (!user) return response.status(404).json({ message: "User not found." });
    return response.json({ userId: user.id });
  } catch (error) {
    return next(error);
  }
});

export default router;
