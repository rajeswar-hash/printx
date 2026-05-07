import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String, required: true, trim: true },
    role: { type: String, enum: ["student", "admin", "cr"], default: "student" },
    college: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    division: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
