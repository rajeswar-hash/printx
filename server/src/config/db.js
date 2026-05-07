import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Configure PrintX server environment variables first.");
  }

  await mongoose.connect(mongoUri);
  console.log("PrintX database connected");
}
