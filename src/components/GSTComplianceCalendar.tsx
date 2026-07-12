import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  BookOpen, 
  Check, 
  ListChecks,
  AlertCircle
} from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  type: "GSTR-1" | "GSTR-3B" | "CMP-08" | "GSTR-9";
  day: number;
  month: number; // 0-indexed: 6 = July, 7 = August, etc.
  year: number;
  description: string;
  whoMustFile: string;
  penaltyText: string;
  instructions: string[];
  aiGuidance: string[];
}

// 2026 GST Deadlines Database (Sourced from official Indian GST schedules)
const DEADLINES_DB: Deadline[] = [
  // July 2026
  {
    id: "gstr1-2026-07",
    title: "GSTR-1 Outward Supplies Return",
    type: "GSTR-1",
    day: 11,
    month: 6, // July
    year: 2026,
    description: "Statement of outward supplies of goods or services. Contains details of sales invoices, credit/debit notes, and exports.",
    whoMustFile: "All registered normal taxpayers with monthly filing frequency.",
    penaltyText: "₹50/day of delay (₹20/day for Nil return) up to a max cap of ₹10,000 per return. Interest at 18% per annum applies on late tax payments.",
    instructions: [
      "Gather and organize all Sales Invoices, Export Bills, and Debit/Credit Notes for June 2026.",
      "Check B2B invoices to ensure correct GSTINs of purchasers are quoted.",
      "Ensure the Total Taxable Value and Tax Amounts are entered correctly under IGST, CGST, and SGST.",
      "Submit and File using DSC (Digital Signature) or EVC (Electronic Verification Code)."
    ],
    aiGuidance: [
      "Verify that all credit notes are linked to their corresponding original invoices before uploading.",
      "Double-check state codes for Inter-State B2B sales to prevent IGST misallocation.",
      "Ensure HSN-wise summary total matches your overall gross invoice values to satisfy GSTR-1 validation rules."
    ]
  },
  {
    id: "cmp08-2026-07",
    title: "CMP-08 Statement for Composition Taxpayers",
    type: "CMP-08",
    day: 18,
    month: 6, // July
    year: 2026,
    description: "Quarterly self-assessed tax statement and payment return for composition scheme dealers for Q1 (Apr-Jun 2026).",
    whoMustFile: "Composition Taxpayers registered under Section 10 of the GST Act.",
    penaltyText: "Interest at 18% per annum on the unpaid tax value from the due date until the payment date. Standard late fee penalties apply if filed late.",
    instructions: [
      "Summarize total outward supplies (turnover) made during Q1 (April to June 2026).",
      "Calculate composition tax (usually 1% for manufacturers/traders, 5% for restaurants, 6% for service providers).",
      "Pay tax amount through PMT-06 challan using cash ledger balance.",
      "Submit declaration Form CMP-08 on the GST Portal."
    ],
    aiGuidance: [
      "Review the composition turnover limit of ₹1.5 Crore (or ₹75 Lakhs for special category states) to verify your continued eligibility.",
      "Make sure no Input Tax Credit (ITC) is claimed, as Composition dealers are legally prohibited from claiming ITC."
    ]
  },
  {
    id: "gstr3b-2026-07",
    title: "GSTR-3B Summary Return & Tax Payment",
    type: "GSTR-3B",
    day: 20,
    month: 6, // July
    year: 2026,
    description: "Monthly self-declared summary return reporting outward supplies, Input Tax Credit (ITC) claimed, and payment of tax due.",
    whoMustFile: "All regular taxpayers registered under GST, except composition dealers and non-resident taxable persons.",
    penaltyText: "₹50 per day (₹20 for Nil return) of delay. Additional 18% per annum interest is levied on net tax liability paid after the due date.",
    instructions: [
      "Reconcile outward supplies values with GSTR-1 submitted on 11th July.",
      "Download GSTR-2B (Input Tax Credit auto-drafted statement) to reconcile available ITC.",
      "Claim eligible Input Tax Credit and reverse ineligible ITC under Rule 37, 38, 42, 43.",
      "Pay outstanding tax liability after offsetting ITC, and file GSTR-3B."
    ],
    aiGuidance: [
      "Reconciliation check: Ensure GSTR-3B ITC claimed does not exceed GSTR-2B by more than 5% (Rule 36(4)).",
      "Validate RCM (Reverse Charge Mechanism) liabilities on import of services and payments to unregistered dealers."
    ]
  },
  // August 2026
  {
    id: "gstr1-2026-08",
    title: "GSTR-1 Outward Supplies Return",
    type: "GSTR-1",
    day: 11,
    month: 7, // August
    year: 2026,
    description: "Statement of outward supplies of goods or services for the month of July 2026.",
    whoMustFile: "All registered normal taxpayers with monthly filing frequency.",
    penaltyText: "₹50/day of delay (₹20/day for Nil return) up to a max cap of ₹10,000.",
    instructions: [
      "Compile sales logs for the month of July 2026.",
      "Isolate B2B sales and perform quick GSTIN validation checks.",
      "Verify tax rate slabs (5%, 12%, 18%, 28%) applied to each product line.",
      "Upload and freeze GSTR-1 data on the official GST portal."
    ],
    aiGuidance: [
      "Check the 'GSTR-1 vs e-Way Bill' report. Resolve deviations exceeding 10% to prevent department notices.",
      "Review HSN codes: ensure 6-digit codes are quoted for turnovers > ₹5 Crore."
    ]
  },
  {
    id: "gstr3b-2026-08",
    title: "GSTR-3B Summary Return & Tax Payment",
    type: "GSTR-3B",
    day: 20,
    month: 7, // August
    year: 2026,
    description: "Monthly summary return and tax payment for July 2026 transactions.",
    whoMustFile: "All regular normal taxpayers.",
    penaltyText: "Late fee of ₹50 per day + 18% per annum interest on net tax unpaid.",
    instructions: [
      "Reconcile outward tax with GSTR-1 for July.",
      "Review ITC eligibility in GSTR-2B drafted on August 14th.",
      "Pay net CGST, SGST, IGST liabilities.",
      "Verify electronic cash & credit ledgers and submit the return."
    ],
    aiGuidance: [
      "Do not claim ITC on blocked items (Section 17(5)) like motor vehicles or corporate food and beverages.",
      "Perform double verification on inter-state ITC distribution to ensure CGST/SGST isn't claimed as IGST."
    ]
  },
  // September 2026
  {
    id: "gstr1-2026-09",
    title: "GSTR-1 Outward Supplies Return",
    type: "GSTR-1",
    day: 11,
    month: 8, // September
    year: 2026,
    description: "Statement of outward supplies of goods or services for the month of August 2026.",
    whoMustFile: "All registered normal taxpayers with monthly filing frequency.",
    penaltyText: "₹50/day of delay up to ₹10,000 limit.",
    instructions: [
      "Extract invoice transactions from billing/ERP software for August 2026.",
      "Ensure debit notes, credit notes, and advance adjustments are linked.",
      "Perform draft validation checks, freeze invoices, and file GSTR-1."
    ],
    aiGuidance: [
      "Ensure credit notes issued for promotional discounts match the special provisions in Section 15.",
      "Compare system exports with the portal summary before clicking 'File GSTR-1'."
    ]
  },
  {
    id: "gstr3b-2026-09",
    title: "GSTR-3B Summary Return & Tax Payment",
    type: "GSTR-3B",
    day: 20,
    month: 8, // September
    year: 2026,
    description: "Monthly summary return and tax liability clearance for August 2026 transactions.",
    whoMustFile: "All regular normal taxpayers.",
    penaltyText: "₹50/day + 18% interest on delayed cash payments.",
    instructions: [
      "Pull August 2026 GSTR-2B from portal.",
      "Verify physical inventory and purchase books against GSTR-2B.",
      "Offset liabilities using available credit first, then prepare cash payments.",
      "Submit and digitally sign GSTR-3B."
    ],
    aiGuidance: [
      "Prepare for semi-annual internal audit matching sales, purchases, and e-way bill records.",
      "Verify if any reverse-charge liability exists on foreign supplier payments or director remunerations."
    ]
  },
  // December 2026 (Annual returns)
  {
    id: "gstr9-2026-12",
    title: "GSTR-9 Annual GST Return",
    type: "GSTR-9",
    day: 31,
    month: 11, // December
    year: 2026,
    description: "Consolidated annual return summarizing outward supplies, inward supplies, tax paid, and ITC claimed during the previous financial year.",
    whoMustFile: "Regular GST registered taxpayers with aggregate annual turnover exceeding ₹2 Crore (optional below ₹2 Crore).",
    penaltyText: "₹200 per day of delay (₹100 CGST + ₹100 SGST) up to a maximum cap of 0.50% of the taxpayer's state turnover.",
    instructions: [
      "Consolidate all 12 monthly GSTR-1 and GSTR-3B filings of the relevant financial year.",
      "Reconcile annual sales with the Audited Financial Statements (Profit & Loss and Balance Sheet).",
      "Identify discrepancies in tax paid or ITC claimed, and settle deviations using Form DRC-03.",
      "Prepare and file Form GSTR-9 on the GST Portal."
    ],
    aiGuidance: [
      "Reconciliation check: Match Annual Turnovers between GSTR-1, GSTR-3B, and Income Tax returns (Form 26AS).",
      "If turnover exceeds ₹5 Crore, you must also prepare and file GSTR-9C (Reconciliation Statement signed by a Chartered Accountant/Cost Accountant)."
    ]
  }
];

export default function GSTComplianceCalendar() {
  // Current local time is July 12, 2026
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 12));
  const [selectedDay, setSelectedDay] = useState<number>(12);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [filedStatus, setFiledStatus] = useState<Record<string, boolean>>({});
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string[] | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Load filed statuses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gst_calendar_filed_status");
    if (saved) {
      try {
        setFiledStatus(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse filed status", e);
      }
    }
  }, []);

  // Update selected deadline when month, day, or filter changes
  useEffect(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const deadline = DEADLINES_DB.find(
      (d) => d.day === selectedDay && d.month === month && d.year === year
    );
    
    if (deadline && (filterType === "All" || deadline.type === filterType)) {
      setSelectedDeadline(deadline);
    } else {
      setSelectedDeadline(null);
    }
    // Reset AI analysis panel when day changes
    setAiAnalysisResult(null);
  }, [selectedDay, currentDate, filterType]);

  // Handle marking status
  const toggleFiledStatus = (id: string) => {
    const updated = { ...filedStatus, [id]: !filedStatus[id] };
    setFiledStatus(updated);
    localStorage.setItem("gst_calendar_filed_status", JSON.stringify(updated));
  };

  // Helper to change months
  const nextMonth = () => {
    let nextM = currentDate.getMonth() + 1;
    let nextY = currentDate.getFullYear();
    if (nextM > 11) {
      nextM = 0;
      nextY += 1;
    }
    // Limit calendar range for demonstration to 2026
    if (nextY <= 2026) {
      setCurrentDate(new Date(nextY, nextM, 1));
      setSelectedDay(1);
    }
  };

  const prevMonth = () => {
    let prevM = currentDate.getMonth() - 1;
    let prevY = currentDate.getFullYear();
    if (prevM < 0) {
      prevM = 11;
      prevY -= 1;
    }
    if (prevY >= 2026) {
      setCurrentDate(new Date(prevY, prevM, 1));
      setSelectedDay(1);
    }
  };

  // Calendar math helper
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Find deadlines for current month
  const currentMonthDeadlines = DEADLINES_DB.filter(
    (d) => d.month === currentDate.getMonth() && d.year === currentDate.getFullYear()
  );

  const getDeadlineForDay = (day: number) => {
    const deadline = currentMonthDeadlines.find((d) => d.day === day);
    if (!deadline) return null;
    if (filterType !== "All" && deadline.type !== filterType) return null;
    return deadline;
  };

  // Simulate generating compliance advice draft
  const handleGenerateAIAdvice = () => {
    if (!selectedDeadline) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      setAiAnalysisResult(selectedDeadline.aiGuidance);
      setIsGeneratingAI(false);
    }, 1200);
  };

  // Calculate stats for current month
  const totalThisMonth = currentMonthDeadlines.length;
  const filedCount = currentMonthDeadlines.filter((d) => filedStatus[d.id]).length;
  const pendingCount = totalThisMonth - filedCount;

  // Determine deadline visual category
  const getTypeColor = (type: string) => {
    switch (type) {
      case "GSTR-1": return "bg-blue-500 border-blue-400 text-blue-400";
      case "GSTR-3B": return "bg-purple-500 border-purple-400 text-purple-400";
      case "CMP-08": return "bg-rose-500 border-rose-400 text-rose-400";
      case "GSTR-9": return "bg-amber-500 border-amber-400 text-amber-400";
      default: return "bg-slate-500 border-slate-400 text-slate-400";
    }
  };

  // Mock "today" check (Local system is July 12, 2026)
  const isSystemToday = (dayNum: number) => {
    return dayNum === 12 && currentDate.getMonth() === 6 && currentDate.getFullYear() === 2026;
  };

  // Calculate countdown status relative to system today (July 12, 2026)
  const getDeadlineStatusText = (deadline: Deadline) => {
    const isFiled = filedStatus[deadline.id];
    if (isFiled) return { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };

    const targetDate = new Date(deadline.year, deadline.month, deadline.day);
    const todayDate = new Date(2026, 6, 12); // Simulated system today: July 12, 2026
    
    const diffTime = targetDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        label: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'}`, 
        color: "text-rose-400", 
        bg: "bg-rose-500/10 border-rose-500/20" 
      };
    } else if (diffDays === 0) {
      return { label: "Due Today", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
    } else {
      return { 
        label: `In ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`, 
        color: "text-blue-400", 
        bg: "bg-blue-500/10 border-blue-500/20" 
      };
    }
  };

  return (
    <div id="gst-compliance-calendar" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Calendar Grid Section */}
      <div className="xl:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-white text-base">GST Compliance Calendar</h3>
              </div>
              <p className="text-slate-400 text-xs mt-1">Interactive tax submission tracker & deadline countdowns</p>
            </div>

            {/* Month selectors */}
            <div className="flex items-center gap-2">
              <button 
                onClick={prevMonth}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-white text-sm px-2 min-w-[120px] text-center">
                {monthName} {year}
              </span>
              <button 
                onClick={nextMonth}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-3 rounded-xl bg-white/[0.01] border border-white/5 text-center">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Returns</p>
              <p className="text-lg font-black text-white mt-0.5">{totalThisMonth}</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Filed</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{filedCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pending</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">{pendingCount}</p>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {["All", "GSTR-1", "GSTR-3B", "CMP-08", "GSTR-9"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  filterType === type 
                    ? "bg-blue-600/15 border-blue-500/50 text-blue-400"
                    : "bg-white/5 border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {/* Days of week */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-slate-400 font-bold py-2 font-mono uppercase text-[10px]">
                {d}
              </div>
            ))}

            {/* Empty days of previous month */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square bg-transparent rounded-xl" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const hasDeadline = getDeadlineForDay(dayNum);
              const isSelected = selectedDay === dayNum;
              const isToday = isSystemToday(dayNum);

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-between p-1.5 transition-all relative border ${
                    isSelected 
                      ? "bg-blue-600/20 border-blue-500/60 text-white" 
                      : isToday 
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400" 
                        : "bg-white/[0.02] hover:bg-white/5 border-white/5 text-slate-300"
                  }`}
                >
                  <div className="flex justify-between w-full">
                    <span className={`font-mono font-bold text-xs ${isToday ? "underline decoration-2" : ""}`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="text-[8px] px-1 bg-amber-500/20 rounded font-black uppercase text-amber-400 scale-90">
                        Today
                      </span>
                    )}
                  </div>

                  {hasDeadline && (
                    <div className="flex flex-col items-center gap-1 w-full mt-auto">
                      <div className={`w-1.5 h-1.5 rounded-full ${getTypeColor(hasDeadline.type).split(" ")[0]}`} />
                      <span className="text-[9px] font-black truncate max-w-full scale-90 px-1 bg-white/5 rounded text-white border border-white/10">
                        {hasDeadline.type}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend block */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>GSTR-1 Outward Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>GSTR-3B Summary Return</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>CMP-08 Composition Dealers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>GSTR-9 Annual Return</span>
          </div>
        </div>
      </div>

      {/* Interactive Sidebar Detail Section */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col h-full min-h-[480px]">
        <h3 className="font-extrabold text-white text-sm mb-4 flex items-center gap-2 pb-3 border-b border-white/5">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Filing Information & Checklist
        </h3>

        <AnimatePresence mode="wait">
          {selectedDeadline ? (
            <motion.div
              key={selectedDeadline.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Due badge & Countdown */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getDeadlineStatusText(selectedDeadline).bg} ${getDeadlineStatusText(selectedDeadline).color}`}>
                    {getDeadlineStatusText(selectedDeadline).label}
                  </span>
                  
                  <button 
                    onClick={() => toggleFiledStatus(selectedDeadline.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      filedStatus[selectedDeadline.id] 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {filedStatus[selectedDeadline.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Filed
                      </>
                    ) : (
                      "Mark as Filed"
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <h4 className="text-base font-extrabold text-white">{selectedDeadline.title}</h4>
                  <p className="text-xs text-slate-400 font-semibold font-mono mt-0.5">Due Date: {selectedDeadline.day} {monthName} {year}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-3">{selectedDeadline.description}</p>

                {/* Eligibility info */}
                <div className="mt-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Info className="w-3.5 h-3.5" />
                    <span>Who Must File</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{selectedDeadline.whoMustFile}</p>
                </div>

                {/* Late fee penalties info */}
                <div className="mt-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Late Fees & Penalties</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{selectedDeadline.penaltyText}</p>
                </div>

                {/* Action steps */}
                <div className="mt-4 space-y-2">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-blue-400" />
                    Preparation Steps:
                  </span>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] pl-1 list-none">
                    {selectedDeadline.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-blue-500 font-mono font-bold">{idx + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Guidance Box */}
              <div className="mt-6 pt-4 border-t border-white/5">
                {!aiAnalysisResult ? (
                  <button
                    onClick={handleGenerateAIAdvice}
                    disabled={isGeneratingAI}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-55"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    {isGeneratingAI ? "Analyzing Tax compliance..." : "Generate AI Filing Tips"}
                  </button>
                ) : (
                  <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-blue-950/40 border border-blue-500/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> AI Advisory Compliance Audit
                      </span>
                      <button 
                        onClick={() => setAiAnalysisResult(null)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-[11px] list-disc pl-3">
                      {aiAnalysisResult.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                <CalendarIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-white font-bold text-sm">No Deadline Scheduled</h4>
              <p className="text-slate-400 text-xs mt-2 max-w-[240px] leading-relaxed">
                Click on any calendar day with a color dot indicator or check a return tag to view deep advisory data and checklists.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
