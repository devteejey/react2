import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(request, response, next) {
  const authorization = request.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return response.status(401).json({ message: "Authentication is required." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return response.status(401).json({ message: "Your session is invalid or has expired." });
  }

  try {
    const { sub } = payload;
    const user = await User.findById(sub).select("name email role status");

    if (!user || user.status !== "Active") {
      return response.status(401).json({ message: "Your session is no longer valid." });
    }

    request.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAdministrator(request, response, next) {
  if (request.user?.role !== "Administrator") {
    return response.status(403).json({ message: "Administrator access is required." });
  }

  return next();
}
