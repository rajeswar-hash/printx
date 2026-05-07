import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(request, response) {
  const { fullName, email, password, phoneNumber, college, department, year, division } = request.body;
  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    return response.status(409).json({ message: "User already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    passwordHash,
    phoneNumber,
    college,
    department,
    year,
    division,
    role: "student",
  });

  return response.status(201).json({
    token: signToken(user._id),
    user,
  });
}

export async function login(request, response) {
  const { email, password } = request.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return response.status(401).json({ message: "Invalid credentials." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return response.status(401).json({ message: "Invalid credentials." });
  }

  return response.json({
    token: signToken(user._id),
    user,
  });
}
