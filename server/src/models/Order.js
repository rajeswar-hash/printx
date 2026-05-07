import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    division: { type: String, required: true },
    documentName: { type: String, required: true },
    documentUrl: { type: String, required: true },
    pageCount: { type: Number, required: true },
    printMode: { type: String, enum: ["bw", "color"], required: true },
    side: { type: String, enum: ["single", "double"], required: true },
    copies: { type: Number, required: true },
    binding: { type: String, enum: ["none", "stapled", "spiral"], required: true },
    totalPrice: { type: Number, required: true },
    paymentId: { type: String, required: true },
    paymentStatus: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    printStatus: { type: String, enum: ["Pending", "Printing", "Delivered"], default: "Pending" },
    deliveryStatus: {
      type: String,
      enum: ["Awaiting CR", "Assigned to CR", "Out for delivery", "Distributed"],
      default: "Awaiting CR",
    },
    assignedCr: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
