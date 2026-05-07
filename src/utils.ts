import type { BindingOption, PrintMode } from "./types";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function calculateTotal(pageCount: number, copies: number, printMode: PrintMode, binding: BindingOption) {
  const pageRate = printMode === "color" ? 5 : 2;
  const bindingCharge = binding === "spiral" ? 35 : binding === "stapled" ? 5 : 0;
  return pageCount * copies * pageRate + bindingCharge;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
