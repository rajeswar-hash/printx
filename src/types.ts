export type UserRole = "student" | "admin" | "cr";
export type PrintMode = "bw" | "color";
export type PrintSide = "single" | "double";
export type BindingOption = "none" | "stapled" | "spiral";
export type PrintStatus = "Pending" | "Printing" | "Delivered";
export type DeliveryStatus = "Awaiting CR" | "Assigned to CR" | "Out for delivery" | "Distributed";

export interface StudentProfile {
  fullName: string;
  phoneNumber: string;
  college: string;
  department: string;
  year: string;
  division: string;
}

export interface DashboardUser extends StudentProfile {
  id: string;
  email: string;
  role: UserRole;
}

export interface Order {
  id: string;
  documentName: string;
  pageCount: number;
  printMode: PrintMode;
  side: PrintSide;
  copies: number;
  binding: BindingOption;
  totalPrice: number;
  orderedAt: string;
  printStatus: PrintStatus;
  deliveryStatus: DeliveryStatus;
  assignedCr: string;
  studentName: string;
  studentEmail: string;
  college: string;
  department: string;
  year: string;
  division: string;
}
