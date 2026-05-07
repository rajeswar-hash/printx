import Razorpay from "razorpay";
import { Order } from "../models/Order.js";

function calculateTotal(pageCount, copies, printMode, binding) {
  const pageRate = printMode === "color" ? 5 : 2;
  const bindingCharge = binding === "spiral" ? 35 : binding === "stapled" ? 5 : 0;
  return pageCount * copies * pageRate + bindingCharge;
}

function createOrderId() {
  return `PRX${Date.now()}`;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "missing",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "missing",
});

export async function createPaymentOrder(request, response) {
  const { pageCount, copies, printMode, binding } = request.body;
  const amount = calculateTotal(pageCount, copies, printMode, binding) * 100;

  const paymentOrder = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: createOrderId(),
  });

  return response.status(201).json(paymentOrder);
}

export async function createOrder(request, response) {
  const { documentName, documentUrl, pageCount, printMode, side, copies, binding, paymentId } = request.body;
  const totalPrice = calculateTotal(pageCount, copies, printMode, binding);

  const order = await Order.create({
    orderId: createOrderId(),
    student: request.user._id,
    studentName: request.user.fullName,
    studentEmail: request.user.email,
    college: request.user.college,
    department: request.user.department,
    year: request.user.year,
    division: request.user.division,
    documentName,
    documentUrl,
    pageCount,
    printMode,
    side,
    copies,
    binding,
    totalPrice,
    paymentId,
    paymentStatus: "paid",
  });

  return response.status(201).json(order);
}

export async function getMyOrders(request, response) {
  const orders = await Order.find({ student: request.user._id }).sort({ createdAt: -1 });
  return response.json(orders);
}

export async function getAllOrders(request, response) {
  const filter = {};

  if (request.query.college) filter.college = request.query.college;
  if (request.query.division) filter.division = request.query.division;

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  return response.json(orders);
}

export async function updateOrderStatus(request, response) {
  const { printStatus, deliveryStatus, assignedCr } = request.body;
  const order = await Order.findByIdAndUpdate(
    request.params.id,
    { printStatus, deliveryStatus, assignedCr },
    { new: true }
  );
  return response.json(order);
}
