import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  CreditCard,
  FileText,
  Filter,
  GraduationCap,
  Menu,
  Printer,
  Search,
  Shield,
  Truck,
  UploadCloud,
  Users,
} from "lucide-react";
import { AnimatedBlock, Card, PageIntro, Section, Shell, StatusBadge } from "./components";
import { colleges, departments, divisions, sampleOrders, sampleUsers, years } from "./data";
import type { BindingOption, DashboardUser, DeliveryStatus, Order, PrintMode, PrintSide } from "./types";
import { calculateTotal, cn, formatCurrency } from "./utils";

type PageKey = "home" | "login" | "signup" | "dashboard" | "upload" | "tracking" | "admin" | "cr";

const navItems: Array<{ key: PageKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "upload", label: "Upload Order" },
  { key: "dashboard", label: "Dashboard" },
  { key: "tracking", label: "Tracking" },
  { key: "admin", label: "Admin" },
  { key: "cr", label: "CR" },
];

function AppButton({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#00c2a8,#2f80ed)] text-white shadow-[0_14px_40px_rgba(47,128,237,0.25)] hover:translate-y-[-1px]",
        variant === "secondary" &&
          "border border-slate-200 bg-white/80 text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        variant === "ghost" && "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

function AppInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm outline-none transition focus:border-cyan-400",
        "dark:border-white/10 dark:bg-white/5 dark:text-white",
        props.className
      )}
    />
  );
}

function AppSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm outline-none transition focus:border-cyan-400",
        "dark:border-white/10 dark:bg-white/5 dark:text-white",
        props.className
      )}
    />
  );
}

function AppTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-cyan-400",
        "dark:border-white/10 dark:bg-white/5 dark:text-white",
        props.className
      )}
    />
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState<PageKey>("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<DashboardUser>(sampleUsers[0]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [adminCollegeFilter, setAdminCollegeFilter] = useState("All colleges");
  const [adminClassFilter, setAdminClassFilter] = useState("All classes");
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    college: colleges[0],
    department: departments[0],
    year: years[0],
    division: divisions[0],
    password: "",
  });
  const [uploadForm, setUploadForm] = useState({
    documentName: "Data Structures Notes.pdf",
    pageCount: 24,
    printMode: "bw" as PrintMode,
    side: "double" as PrintSide,
    copies: 1,
    binding: "stapled" as BindingOption,
    paymentMethod: "UPI",
    notes: "Need this before tomorrow's internal.",
  });

  const totalPrice = useMemo(
    () => calculateTotal(uploadForm.pageCount, uploadForm.copies, uploadForm.printMode, uploadForm.binding),
    [uploadForm]
  );

  const studentOrders = orders.filter((order) => order.studentEmail === activeUser.email);
  const crOrders = orders.filter((order) => order.assignedCr === activeUser.fullName || order.assignedCr === "Arjun Nair");
  const filteredOrders = orders.filter((order) => {
    const matchesText =
      !search ||
      [order.id, order.documentName, order.studentName, order.college].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCollege = adminCollegeFilter === "All colleges" || order.college === adminCollegeFilter;
    const matchesClass = adminClassFilter === "All classes" || `${order.year} ${order.division}` === adminClassFilter;
    return matchesText && matchesCollege && matchesClass;
  });

  const assignCr = (orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedCr: "Arjun Nair",
              deliveryStatus: "Assigned to CR" as DeliveryStatus,
            }
          : order
      )
    );
  };

  const updateStatus = (orderId: string, printStatus: Order["printStatus"], deliveryStatus?: Order["deliveryStatus"]) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              printStatus,
              deliveryStatus: deliveryStatus ?? order.deliveryStatus,
            }
          : order
      )
    );
  };

  const createOrder = () => {
    const nextOrder: Order = {
      id: `PRX${240500 + orders.length + 1}`,
      documentName: uploadForm.documentName,
      pageCount: uploadForm.pageCount,
      printMode: uploadForm.printMode,
      side: uploadForm.side,
      copies: uploadForm.copies,
      binding: uploadForm.binding,
      totalPrice,
      orderedAt: "May 7, 2026",
      printStatus: "Pending",
      deliveryStatus: "Awaiting CR",
      assignedCr: "Not assigned",
      studentName: activeUser.fullName,
      studentEmail: activeUser.email,
      college: activeUser.college,
      department: activeUser.department,
      year: activeUser.year,
      division: activeUser.division,
    };
    setOrders((current) => [nextOrder, ...current]);
    setPage("tracking");
  };

  const dashboardCards = [
    { label: "Orders this week", value: "18", icon: FileText },
    { label: "Pending deliveries", value: "6", icon: Truck },
    { label: "Avg. turnaround", value: "1 day", icon: CheckCircle2 },
  ];

  return (
    <Shell darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#00c2a8,#2f80ed)] text-white">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">PrintX</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Campus printing, rethought</div>
            </div>
          </button>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={cn(
                  "text-sm font-medium transition",
                  page === item.key ? "text-slate-950 dark:text-white" : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <AppButton variant="ghost" onClick={() => setPage("login")}>
              Login
            </AppButton>
            <AppButton onClick={() => setPage("upload")}>Get Started</AppButton>
          </div>

          <button className="lg:hidden" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {mobileNavOpen && (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setPage(item.key);
                    setMobileNavOpen(false);
                  }}
                  className="text-left text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {page === "home" && (
        <>
          <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr,0.95fr] lg:py-24">
            <AnimatedBlock>
              <div className="space-y-7">
                <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                  Next-day delivery through your CR
                </div>
                <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
                  Print Your Assignments Without Leaving Your Classroom
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Students upload PDFs, choose print preferences, pay online, and receive printed documents the next day
                  inside college through their class representative.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AppButton onClick={() => setPage("upload")}>
                    Upload Document
                    <ArrowRight className="h-4 w-4" />
                  </AppButton>
                  <AppButton variant="secondary" onClick={() => setPage("signup")}>
                    Get Started
                  </AppButton>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { value: "UPI-first", label: "Mobile friendly checkout" },
                    { value: "₹2 / ₹5", label: "Transparent page pricing" },
                    { value: "CR-based", label: "Organized classroom delivery" },
                  ].map((item) => (
                    <Card key={item.value} className="p-5">
                      <div className="text-xl font-bold">{item.value}</div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </AnimatedBlock>

            <AnimatedBlock delay={0.08}>
              <Card className="overflow-hidden p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-5">
                    <UploadCloud className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    <div className="mt-4 text-lg font-semibold">Upload in minutes</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Select a PDF, choose copies and binding, and finish the order from your phone.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <CreditCard className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    <div className="mt-4 text-lg font-semibold">Razorpay-ready checkout</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Designed for secure UPI payments with clean confirmation and order ID generation.
                    </p>
                  </Card>
                </div>
                <Card className="mt-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-200">Sample order timeline</div>
                      <div className="mt-2 text-2xl font-bold">Operating Systems Assignment.pdf</div>
                    </div>
                    <StatusBadge label="Printing" />
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      "Document uploaded and preferences selected",
                      "Payment completed through UPI",
                      "Print team queued the order",
                      "Assigned to CR for next-day distribution",
                    ].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-700 dark:text-cyan-200">
                          {index + 1}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{step}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Card>
            </AnimatedBlock>
          </section>

          <Section
            eyebrow="How It Works"
            title="A simple student flow from file upload to classroom handoff"
            description="PrintX is built around how students actually manage assignments during a busy college week."
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Upload PDF files", FileText, "Add assignments, records, notes, or reports in PDF format."],
                ["Choose print settings", Printer, "Pick color, sides, copies, and binding with live price updates."],
                ["Pay online", BadgeIndianRupee, "Complete payment with UPI through a Razorpay-ready flow."],
                ["Track and collect", Truck, "See status updates and collect next day from your CR."],
              ].map(([title, Icon, description], index) => {
                const StepIcon = Icon as typeof FileText;
                return (
                  <motion.div key={title as string} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                    <Card className="h-full p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-200">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Step {index + 1}</div>
                      <div className="mt-3 text-xl font-semibold">{title}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description as string}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Section>

          <Section
            eyebrow="Pricing"
            title="Transparent pricing that updates automatically"
            description="Students can see the order total before checkout without guessing hidden charges."
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Black & White", "₹2", "per page"],
                ["Color", "₹5", "per page"],
                ["Staple Binding", "₹5", "per order"],
                ["Spiral Binding", "₹35", "per order"],
              ].map(([label, value, note]) => (
                <Card key={label as string} className="p-6">
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
                  <div className="mt-3 text-4xl font-bold">{value}</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{note}</div>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            eyebrow="Why Choose Us"
            title="A startup-style product built around campus logistics"
            description="The product separates student ordering, admin operations, and CR distribution into distinct workflows."
          >
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                ["Student-friendly", GraduationCap, "Minimal steps, mobile-first flows, and clean pricing for repeat usage."],
                ["Operationally clear", Shield, "Admins can filter by college and class, update statuses, and assign CRs."],
                ["Delivery aware", Users, "CR dashboards focus only on assigned classroom deliveries and distribution."],
              ].map(([title, Icon, body]) => {
                const BenefitIcon = Icon as typeof Shield;
                return (
                  <Card key={title as string} className="p-6">
                    <BenefitIcon className="h-6 w-6 text-cyan-700 dark:text-cyan-200" />
                    <div className="mt-4 text-xl font-semibold">{title}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{body as string}</p>
                  </Card>
                );
              })}
            </div>
          </Section>

          <Section
            eyebrow="Testimonials"
            title="Students want speed, clarity, and less running around"
            description="PrintX focuses on predictable delivery and low-friction reordering from mobile."
          >
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                "I upload notes during lunch break and collect them from my CR the next day.",
                "Project report printing finally feels organized instead of chaotic.",
                "The tracking page tells me exactly who is handling my order and when it moves.",
              ].map((quote, index) => (
                <Card key={quote} className="p-6">
                  <p className="text-base leading-7 text-slate-600 dark:text-slate-300">“{quote}”</p>
                  <div className="mt-6 text-sm font-semibold">Student story {index + 1}</div>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            eyebrow="FAQ"
            title="Common questions before the first order"
            description="A few fast answers students usually need while deciding whether to upload."
          >
            <div className="grid gap-4">
              {[
                ["How fast is delivery?", "Orders are intended for next-day campus delivery via the class representative workflow."],
                ["Can I upload only PDFs?", "The current student flow is optimized for PDFs, with backend hooks ready for broader document support."],
                ["How is payment handled?", "The checkout UI is designed for Razorpay integration with UPI as the primary student payment option."],
                ["Can admins download files?", "Yes. The admin workflow is structured around downloadable uploaded documents and order filtering."],
              ].map(([question, answer]) => (
                <Card key={question as string} className="p-6">
                  <div className="text-lg font-semibold">{question}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer as string}</p>
                </Card>
              ))}
            </div>
          </Section>
        </>
      )}

      {page === "login" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
            <div className="space-y-6">
              <PageIntro
                title="Login to continue"
                description="Choose a demo role to preview the student, admin, and CR flows while the dedicated backend is being wired."
              />
              <Card className="p-6">
                <div className="text-sm font-semibold">Demo identities</div>
                <div className="mt-4 grid gap-3">
                  {sampleUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setActiveUser(user);
                        setPage(user.role === "admin" ? "admin" : user.role === "cr" ? "cr" : "dashboard");
                      }}
                      className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-cyan-400 dark:border-white/10"
                    >
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.email}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">{user.role}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-8">
              <div className="space-y-5">
                <div>
                  <div className="text-3xl font-bold">Quick access</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    This standalone front-end uses local demo state for now. The separate PrintX backend and database
                    scaffold are included in the repo and will replace these placeholder role switches.
                  </p>
                </div>
                <AppButton onClick={() => setPage("signup")} className="w-full">
                  Create student account
                </AppButton>
              </div>
            </Card>
          </div>
        </section>
      )}

      {page === "signup" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
            <PageIntro
              title="Create your student account"
              description="Registration captures the exact delivery fields PrintX needs: college, department, year, and class division."
            />
            <Card className="p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <AppInput placeholder="Full Name" value={signupForm.fullName} onChange={(event) => setSignupForm({ ...signupForm, fullName: event.target.value })} />
                <AppInput placeholder="Phone Number" value={signupForm.phoneNumber} onChange={(event) => setSignupForm({ ...signupForm, phoneNumber: event.target.value })} />
                <AppInput placeholder="Email" value={signupForm.email} onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })} />
                <AppInput type="password" placeholder="Password" value={signupForm.password} onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })} />
                <AppSelect value={signupForm.college} onChange={(event) => setSignupForm({ ...signupForm, college: event.target.value })}>
                  {colleges.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </AppSelect>
                <AppSelect value={signupForm.department} onChange={(event) => setSignupForm({ ...signupForm, department: event.target.value })}>
                  {departments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </AppSelect>
                <AppSelect value={signupForm.year} onChange={(event) => setSignupForm({ ...signupForm, year: event.target.value })}>
                  {years.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </AppSelect>
                <AppSelect value={signupForm.division} onChange={(event) => setSignupForm({ ...signupForm, division: event.target.value })}>
                  {divisions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </AppSelect>
              </div>
              <div className="mt-6">
                <AppButton
                  onClick={() => {
                    setActiveUser({
                      id: "student-new",
                      role: "student",
                      ...signupForm,
                    });
                    setPage("dashboard");
                  }}
                >
                  Register and continue
                </AppButton>
              </div>
            </Card>
          </div>
        </section>
      )}

      {page === "dashboard" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <PageIntro
            title={`Welcome back, ${activeUser.fullName.split(" ")[0]}`}
            description="Your dashboard keeps the latest orders, print progress, and CR delivery details visible at a glance."
            action={<AppButton onClick={() => setPage("upload")}>Upload new document</AppButton>}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dashboardCards.map((card) => (
              <Card key={card.label} className="p-6">
                <card.icon className="h-6 w-6 text-cyan-700 dark:text-cyan-200" />
                <div className="mt-4 text-3xl font-bold">{card.value}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.label}</div>
              </Card>
            ))}
          </div>
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">Recent orders</div>
                <AppButton variant="ghost" onClick={() => setPage("tracking")}>
                  View all
                </AppButton>
              </div>
              <div className="mt-6 space-y-4">
                {studentOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold">{order.documentName}</div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {order.id} • {order.orderedAt}
                        </div>
                      </div>
                      <StatusBadge label={order.printStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-xl font-semibold">Student profile</div>
              <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div>{activeUser.college}</div>
                <div>{activeUser.department}</div>
                <div>
                  {activeUser.year} • Division {activeUser.division}
                </div>
                <div>{activeUser.phoneNumber}</div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {page === "upload" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <PageIntro
            title="Upload a new print order"
            description="Select the document settings, see the total update live, and move straight into the payment step."
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr,0.95fr]">
            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <AppInput
                  placeholder="Document name"
                  value={uploadForm.documentName}
                  onChange={(event) => setUploadForm({ ...uploadForm, documentName: event.target.value })}
                />
                <AppInput
                  type="number"
                  placeholder="Page count"
                  value={String(uploadForm.pageCount)}
                  onChange={(event) => setUploadForm({ ...uploadForm, pageCount: Number(event.target.value) || 0 })}
                />
                <AppSelect value={uploadForm.printMode} onChange={(event) => setUploadForm({ ...uploadForm, printMode: event.target.value as PrintMode })}>
                  <option value="bw">Black & White</option>
                  <option value="color">Color</option>
                </AppSelect>
                <AppSelect value={uploadForm.side} onChange={(event) => setUploadForm({ ...uploadForm, side: event.target.value as PrintSide })}>
                  <option value="single">Single side</option>
                  <option value="double">Double side</option>
                </AppSelect>
                <AppInput
                  type="number"
                  placeholder="Copies"
                  value={String(uploadForm.copies)}
                  onChange={(event) => setUploadForm({ ...uploadForm, copies: Number(event.target.value) || 1 })}
                />
                <AppSelect
                  value={uploadForm.binding}
                  onChange={(event) => setUploadForm({ ...uploadForm, binding: event.target.value as BindingOption })}
                >
                  <option value="none">No binding</option>
                  <option value="stapled">Stapled</option>
                  <option value="spiral">Spiral</option>
                </AppSelect>
              </div>
              <div className="mt-4">
                <AppTextarea
                  rows={4}
                  placeholder="Extra instructions"
                  value={uploadForm.notes}
                  onChange={(event) => setUploadForm({ ...uploadForm, notes: event.target.value })}
                />
              </div>
              <div className="mt-6 rounded-[24px] border border-dashed border-cyan-400/40 bg-cyan-500/5 p-6 text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-cyan-700 dark:text-cyan-200" />
                <div className="mt-3 font-semibold">PDF upload area</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Replace this placeholder with real file upload once the dedicated storage backend is connected.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-xl font-semibold">Payment summary</div>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Pages</span>
                  <span>{uploadForm.pageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Mode</span>
                  <span>{uploadForm.printMode === "color" ? "Color" : "Black & White"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Copies</span>
                  <span>{uploadForm.copies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Binding</span>
                  <span>{uploadForm.binding}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 dark:border-white/10">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-[24px] bg-slate-100 p-5 dark:bg-white/5">
                <div className="text-sm font-semibold">Razorpay integration point</div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Use this section to launch the actual Razorpay checkout and confirm UPI payment before creating the order.
                </p>
              </div>
              <div className="mt-8">
                <AppButton onClick={createOrder} className="w-full">
                  Simulate payment and place order
                </AppButton>
              </div>
            </Card>
          </div>
        </section>
      )}

      {page === "tracking" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <PageIntro
            title="Order tracking"
            description="Students can view order ID, date, print status, delivery status, and assigned CR in one place."
          />
          <div className="mt-10 space-y-4">
            {studentOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-center">
                  <div>
                    <div className="text-xl font-semibold">{order.documentName}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {order.id} • {order.orderedAt} • Assigned CR: {order.assignedCr}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={order.printStatus} />
                    <StatusBadge label={order.deliveryStatus} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {page === "admin" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <PageIntro
            title="Admin dashboard"
            description="Filter orders by college or class, assign CRs, update print status, and control delivery flow from one operations view."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr,220px,220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
              <AppInput className="pl-11" placeholder="Search orders" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <AppSelect value={adminCollegeFilter} onChange={(event) => setAdminCollegeFilter(event.target.value)}>
              {["All colleges", ...colleges].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </AppSelect>
            <AppSelect value={adminClassFilter} onChange={(event) => setAdminClassFilter(event.target.value)}>
              {["All classes", ...Array.from(new Set(orders.map((order) => `${order.year} ${order.division}`)))].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </AppSelect>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Filter className="h-4 w-4" />
            Search and filter system included for operations workflows.
          </div>

          <div className="mt-8 space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xl font-semibold">{order.documentName}</div>
                      <StatusBadge label={order.printStatus} />
                      <StatusBadge label={order.deliveryStatus} />
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {order.id} • {order.studentName} • {order.college} • {order.department} • {order.year} {order.division}
                    </div>
                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">Assigned CR: {order.assignedCr}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <AppButton variant="secondary" onClick={() => assignCr(order.id)}>
                      Assign CR
                    </AppButton>
                    <AppButton variant="secondary" onClick={() => updateStatus(order.id, "Printing")}>
                      Mark printing
                    </AppButton>
                    <AppButton variant="secondary" onClick={() => updateStatus(order.id, "Delivered", "Out for delivery")}>
                      Mark delivered
                    </AppButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {page === "cr" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <PageIntro
            title="CR dashboard"
            description="Class representatives only see assigned deliveries, student details, and the final distribution action."
          />
          <div className="mt-10 space-y-4">
            {crOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="grid gap-5 xl:grid-cols-[1fr,auto] xl:items-center">
                  <div>
                    <div className="text-xl font-semibold">{order.documentName}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {order.studentName} • {order.studentEmail} • {order.year} {order.division}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={order.deliveryStatus} />
                    <AppButton variant="secondary" onClick={() => updateStatus(order.id, "Delivered", "Distributed")}>
                      Mark distributed
                    </AppButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
          <div>
            <div className="text-2xl font-bold">PrintX</div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              A separate printing platform for students. Built independently from CampusKart with its own backend and database plan.
            </p>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <div>Contact: hello@printx.app</div>
            <div className="mt-2">Phone: +91 98765 43210</div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <div>Social: @printx.campus</div>
            <div className="mt-2">Student-first UI, mobile responsive, startup style.</div>
          </div>
        </div>
      </footer>
    </Shell>
  );
}
