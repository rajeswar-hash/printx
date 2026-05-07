import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Missing bearer token." });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-passwordHash");

    if (!user) {
      return response.status(401).json({ message: "User not found." });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid token." });
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: "Insufficient permissions." });
    }
    next();
  };
}
