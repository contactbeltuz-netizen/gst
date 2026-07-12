import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search, ShieldCheck, CheckCircle2, HelpCircle, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface FAQItem {
  id: string;
  category: "registration" | "filing" | "notices";
  question: string;
  answer: string;
  points?: string[];
  verifiedBy: string;
}

const faqsData: FAQItem[] = [
  {
    id: "reg-1",
    category: "registration",
    question: "What are the mandatory documents required for obtaining a new GST Registration?",
    answer: "To secure a GSTIN quickly without department rejection, Indian businesses must upload accurate, high-resolution copies of specific documents. The requirements vary depending on business constitution, but the standard documentation is as follows:",
    points: [
      "PAN Card of the Proprietor, Partners, or Company.",
      "Aadhaar Card of the authorized signatories & promoters.",
      "Proof of Business Address (Utility Bill, Rent Agreement, and an NOC from the property owner).",
      "Bank Account details (Cancelled cheque, bank passbook, or statement showing the entity's details).",
      "Board Resolution or Letter of Authorization designating the primary authorized signatory."
    ],
    verifiedBy: "CA Rajesh Mehta, Senior Partner"
  },
  {
    id: "reg-2",
    category: "registration",
    question: "Is GST registration compulsory for businesses doing inter-state sales?",
    answer: "Yes, under Section 24 of the CGST Act, compulsory registration is required for persons making any inter-state taxable supply of goods, regardless of their annual aggregate turnover. However, a major exception exists for inter-state service providers, who are exempt from registration if their aggregate annual turnover remains below the ₹20 Lakh threshold (or ₹10 Lakh in hilly and special category states).",
    verifiedBy: "CA Sneha Sen, GST Advisory Lead"
  },
  {
    id: "reg-3",
    category: "registration",
    question: "How long does it take for a GST Registration application to be approved?",
    answer: "If all uploaded documents are accurate and complete, the GSTIN is typically approved within 3 to 7 working days without any physical verification. However, if the department raises a clarification query (Form GST REG-03) due to mismatched details, the taxpayer has 7 days to reply. If physical verification is ordered, the process may take up to 30 days. Enabling Aadhaar Authentication during application reduces approval timelines significantly.",
    verifiedBy: "CA Rajesh Mehta, Senior Partner"
  },
  {
    id: "fil-1",
    category: "filing",
    question: "What are GSTR-1, GSTR-3B, and GSTR-2B, and how do they interact?",
    answer: "Understanding these three core pillars is crucial for smooth GST compliance and avoiding costly mismatch notices:",
    points: [
      "GSTR-1: A monthly or quarterly statement of outward supplies (sales), where you declare details of all invoices issued to customers. It is due by the 11th of the succeeding month.",
      "GSTR-2B: An auto-drafted, static Input Tax Credit (ITC) statement generated on the 14th of every month. It reflects the purchases reported by your suppliers in their respective GSTR-1 filings.",
      "GSTR-3B: A monthly self-declaration summary return where you pay your net tax liability. Net Liability = Outward Tax (GSTR-1) minus eligible Input Tax Credit (GSTR-2B). Due on the 20th of the succeeding month."
    ],
    verifiedBy: "CA Anirudh Sharma, Audit Specialist"
  },
  {
    id: "fil-2",
    category: "filing",
    question: "Can a GST return be revised or edited once it is successfully submitted?",
    answer: "Under the current GST portal architecture, filed GST returns (like GSTR-1 and GSTR-3B) cannot be revised. However, any clerical errors, omitted invoices, or incorrect entries can be amended in the return of the subsequent month. The portal allows you to modify invoice details, tax rates, or customer GSTINs retroactively, up to the statutory deadline of November 30th following the end of the relevant financial year.",
    verifiedBy: "CA Sneha Sen, GST Advisory Lead"
  },
  {
    id: "fil-3",
    category: "filing",
    question: "What are the penalties and late fees for missing GST return deadlines?",
    answer: "Delaying GST filing triggers cumulative daily late fees and interest liability. Staying aware of these statutory costs is crucial for financial health:",
    points: [
      "Regular Returns: ₹50 per day (₹25 CGST + ₹25 SGST) of delay.",
      "Nil Returns: ₹20 per day (₹10 CGST + ₹10 SGST) of delay if there are zero business transactions.",
      "Interest Penalty: If there is tax payable, an interest rate of 18% per annum is levied on the net tax paid via the electronic cash ledger from the due date until the payment date.",
      "Blocking of E-Way Bill: Non-filing of returns for two consecutive periods leads to automatic blocking of the E-Way bill generation capability."
    ],
    verifiedBy: "CA Anirudh Sharma, Audit Specialist"
  },
  {
    id: "notices-1",
    category: "notices",
    question: "What should I do immediately upon receiving a GST scrutiny notice (Form ASMT-10)?",
    answer: "Form ASMT-10 is a scrutiny notice issued when the tax officer detects discrepancies between your filed returns (e.g., GSTR-3B tax vs. GSTR-1 sales, or ITC claimed in GSTR-3B vs. ITC in GSTR-2B). Here is your immediate action plan:",
    points: [
      "Do Not Panic: ASMT-10 is an informative notice, not a demand order. It simply requests an explanation.",
      "Analyze the Discrepancy: Perform a rigorous month-on-month reconciliation of your GSTR-3B, GSTR-1, and GSTR-2B datasets.",
      "Draft a Technical Response: Submit a detailed response in Form ASMT-11 within 30 days, explaining the differences with proof (e.g., credit notes, vendor communications, reconciliation sheets).",
      "Acceptance of Liability: If the discrepancy is valid, pay the short-paid tax along with interest via Form DRC-03 to close the proceedings."
    ],
    verifiedBy: "CA Rajesh Mehta, Senior Partner"
  },
  {
    id: "notices-2",
    category: "notices",
    question: "What is Section 17(5) Blocked Credit and why does it cause audit failures?",
    answer: "Section 17(5) lists specific goods and services on which Input Tax Credit (ITC) is strictly prohibited, even if they are used for business operations. Claiming ITC on these items is the most common reason for department notices during GST audits. Major blocked credits include motor vehicles (with limited exceptions), food and beverages, outdoor catering, beauty treatments, life insurance, employee travel benefits, and works contract services for immovable property construction.",
    verifiedBy: "CA Sneha Sen, GST Advisory Lead"
  }
];

export default function HomeFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "registration" | "filing" | "notices">("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("reg-1");

  // Filter FAQs based on active category and search query
  const filteredFaqs = useMemo(() => {
    return faqsData.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.points?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq-section" className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/5">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-4 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Compliance Intelligence
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Common GST Queries, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-300 to-amber-400">
              Answered by Experts
            </span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg mt-3">
            Clear, legally grounded guidelines to protect your business from compliance slips, late fees, and sudden department notices.
          </p>
        </div>

        {/* Dynamic Search */}
        <div className="w-full md:w-80 shrink-0 relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. 'ITC', 'ASMT')..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder-slate-500"
          />
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-5">
        {[
          { id: "all", label: "All GST Queries" },
          { id: "registration", label: "GST Registration" },
          { id: "filing", label: "Returns & Filing" },
          { id: "notices", label: "Notices & Audits" }
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                // Expand the first search result automatically when switching categories
                setOpenFaqId(null);
              }}
              className={`px-4.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all uppercase tracking-wide cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-slate-900 shadow-md shadow-amber-500/10"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Accordion List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "bg-white/[0.07] border-amber-500/30 shadow-lg shadow-amber-500/[0.02]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-5 flex items-start justify-between text-left focus:outline-none cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-3.5 pr-4">
                        <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isOpen ? "text-amber-400" : "text-slate-500"}`} />
                        <span className="font-bold text-base md:text-lg text-slate-100 leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-amber-500 transition-transform duration-300 shrink-0 mt-1 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-slate-300 leading-relaxed border-t border-white/5 pt-4 text-sm md:text-base space-y-4">
                            <p>{faq.answer}</p>
                            
                            {/* Bullet points for rich instructions */}
                            {faq.points && faq.points.length > 0 && (
                              <ul className="space-y-2.5 bg-slate-950/40 p-4.5 rounded-xl border border-white/5">
                                {faq.points.map((point, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Authoritative Sign-off */}
                            <div className="flex items-center gap-2 pt-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                              <span>Verified Response by: {faq.verifiedBy}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h3 className="text-slate-300 font-bold mb-1">No matching FAQs found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  We couldn't find any questions matching "{searchQuery}". Try adjusting your keywords or browse through our categories.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar trust box / Action card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-b from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <ShieldCheck className="w-10 h-10 text-blue-400 mb-4" />
            
            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              Need Direct Legal Representation?
            </h3>
            
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
              Our tax consultants and veteran Chartered Accountants can represent your business directly before the GST Commissionerate. 
            </p>

            <ul className="space-y-2.5 mb-6">
              {[
                "100% compliant documentation representation",
                "Zero surprise notices SLA protection",
                "Pre-screening audit audit protection"
              ].map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs md:text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-black/10"
            >
              Book CA Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6.5 text-center">
            <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1.5">Expert Blog Center</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Get detailed analyses on recent GST high court decisions, amendments, and notification breakdowns.
            </p>
            <Link
              to="/blog"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest inline-flex items-center gap-1"
            >
              Browse Law Articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
