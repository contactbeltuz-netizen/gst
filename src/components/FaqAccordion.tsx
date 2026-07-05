import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is the penalty for late filing of GST returns?",
    answer: "The late fee for delayed filing of GSTR-1 and GSTR-3B is ₹50 per day (₹25 CGST + ₹25 SGST) for normal taxpayers, and ₹20 per day (₹10 CGST + ₹10 SGST) for nil returns, subject to a maximum cap based on your turnover. Additionally, interest at 18% p.a. is applicable on the outstanding tax liability."
  },
  {
    question: "How can I claim Input Tax Credit (ITC) correctly?",
    answer: "To claim ITC, the tax must be charged by a registered supplier, you must have the tax invoice, goods/services must be received, and the supplier must file their returns resulting in the invoice reflecting in your GSTR-2B. ITC cannot be claimed on blocked credits under Section 17(5) of the CGST Act."
  },
  {
    question: "Is GST registration mandatory for a new business?",
    answer: "GST registration is mandatory if your aggregate annual turnover exceeds ₹40 Lakhs for goods (₹20 Lakhs in special category states) or ₹20 Lakhs for services (₹10 Lakhs in special category states). It is also mandatory for certain categories like e-commerce operators, casual taxable persons, and inter-state suppliers regardless of turnover."
  },
  {
    question: "How do I respond to a GST notice (ASMT-10 or Show Cause)?",
    answer: "If you receive an ASMT-10 (Scrutiny Notice) or a Show Cause Notice (SCN), you must reply within the stipulated time (usually 30 days) using the prescribed forms (e.g., ASMT-11). It requires reconciling your GSTR-1, GSTR-3B, and GSTR-2A/2B data with your financial books. Our dispute resolution team can assist in drafting a professional legal response."
  },
  {
    question: "What is the difference between GSTR-9 and GSTR-9C?",
    answer: "GSTR-9 is the annual return that consolidates all outward and inward supplies declared during the financial year. GSTR-9C is a reconciliation statement between the GSTR-9 and the audited annual financial statements, which must be self-certified by taxpayers whose aggregate turnover exceeds ₹5 Crores."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Expert answers to the most common GST compliance queries.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-lg text-slate-100 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-500 transition-transform duration-300 flex-shrink-0 ${
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
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
