import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Moon, SunMedium } from "lucide-react";
import { cn } from "./utils";

export function Shell({
  children,
  darkMode,
  onToggleTheme,
}: {
  children: ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <div className={cn("min-h-screen transition-colors", darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-950")}>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10",
          darkMode
            ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_24%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_24%)]"
        )}
      />
      <button
        onClick={onToggleTheme}
        className={cn(
          "fixed right-5 top-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur",
          darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
        )}
        aria-label="Toggle theme"
      >
        {darkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      {children}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
        "border-white/50 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AnimatedBlock({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}>
      {children}
    </motion.div>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const tone =
    label === "Pending"
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-200"
      : label === "Printing"
        ? "bg-sky-500/15 text-sky-700 dark:text-sky-200"
        : label === "Delivered" || label === "Distributed"
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
          : label === "Assigned to CR"
            ? "bg-violet-500/15 text-violet-700 dark:text-violet-200"
            : "bg-slate-500/15 text-slate-700 dark:text-slate-200";

  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", tone)}>{label}</span>;
}
