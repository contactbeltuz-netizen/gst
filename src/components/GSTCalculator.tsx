import React, { useState } from "react";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { Calculator, ArrowRight, IndianRupee, PieChart, Percent } from "lucide-react";
import { Link } from "react-router-dom";

const gstCategories = [
  { label: "Select Industry / Category", rate: 18 },
  { label: "IT, software & SaaS", rate: 18 },
  { label: "Consulting, legal & accounting", rate: 18 },
  { label: "Manufacturing & general trading", rate: 18 },
  { label: "Mobile phones, laptops & electronics", rate: 18 },
  { label: "Restaurant - AC / banquet", rate: 18 },
  { label: "Restaurant - non-AC / takeaway", rate: 5 },
  { label: "Packaged foods & essentials", rate: 5 },
  { label: "Apparel & footwear up to Rs 1,000", rate: 5 },
  { label: "Apparel & footwear above Rs 1,000", rate: 18 },
  { label: "Healthcare & education - exempt", rate: 0 },
  { label: "Gold, silver & jewellery", rate: 3 },
  { label: "Rough precious & semi-precious stones", rate: 0.25 },
  { label: "Tobacco, pan masala, aerated drinks, online gaming", rate: 40 },
  { label: "Other - standard rate", rate: 18 }
];

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number | "">("");
  const [gstRate, setGstRate] = useState<number>(18);
  const [calculationMode, setCalculationMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [selectedCategory, setSelectedCategory] = useState<string>("Select Industry / Category");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    setSelectedCategory(label);
    const category = gstCategories.find(c => c.label === label);
    if (category && label !== "Select Industry / Category") {
      setGstRate(category.rate);
    }
  };

  const calculateGST = () => {
    const baseAmount = Number(amount) || 0;
    let netAmount = 0;
    let totalTax = 0;
    let grossAmount = 0;

    if (calculationMode === "exclusive") {
      // Amount is Net (before tax)
      netAmount = baseAmount;
      totalTax = (baseAmount * gstRate) / 100;
      grossAmount = baseAmount + totalTax;
    } else {
      // Amount is Gross (after tax)
      grossAmount = baseAmount;
      netAmount = baseAmount / (1 + gstRate / 100);
      totalTax = grossAmount - netAmount;
    }

    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    return {
      netAmount: netAmount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      grossAmount: grossAmount.toFixed(2)
    };
  };

  const results = calculateGST();

  return (
    <MainLayout>
      <SEO 
        title="Free GST Calculator (Exclusive & Inclusive) | India 2024" 
        description="Easily calculate GST, Reverse GST, CGST, and SGST with our free online tool. Support for 5%, 12%, 18%, and 28% GST brackets in India." 
      />
      
      <div className="pt-12 md:pt-24 pb-12 md:pb-20 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl mx-auto text-center mb-6 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Calculator className="w-4 h-4" />
            Free Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
             Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">GST Calculator</span>
          </h1>
          <p className="text-lg text-slate-400">
            Calculate exclusive and inclusive GST instantly. Find your net amount, Total GST, CGST, and SGST with absolute precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Calculator Inputs */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
            <div className="flex bg-slate-900/50 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => setCalculationMode("exclusive")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${calculationMode === "exclusive" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Add GST (Exclusive)
              </button>
              <button 
                onClick={() => setCalculationMode("inclusive")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${calculationMode === "inclusive" ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Remove GST (Inclusive)
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {calculationMode === "exclusive" ? "Net Amount (Before Tax)" : "Gross Amount (After Tax)"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Enter amount e.g. 10000"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Industry / Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full pl-4 pr-10 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    {gstCategories.map((cat, idx) => (
                      <option key={idx} value={cat.label} className="bg-slate-900 text-white">
                        {cat.label === "Select Industry / Category" ? cat.label : `${cat.label} (${cat.rate}%)`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Or Select GST Rate Manually</label>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 12, 18, 28].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setGstRate(rate);
                        setSelectedCategory("Select Industry / Category");
                      }}
                      className={`py-3 rounded-xl border flex items-center justify-center font-bold text-sm transition-colors ${gstRate === rate && selectedCategory === "Select Industry / Category" ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <Link to="/contact" className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-colors">
                Need help with GST filing? <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Calculator Results */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-gradient-to-b from-blue-900/40 to-indigo-900/20 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-md overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
              
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                Calculation Breakdown
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-white/5">
                  <span className="text-sm text-slate-400">Net Amount</span>
                  <span className="font-mono font-medium text-white flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1" />{results.netAmount}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <span className="text-sm text-blue-200">GST ({gstRate}%)</span>
                  <span className="font-mono font-medium text-blue-400 flex items-center">
                    + <IndianRupee className="w-3 h-3 mx-1" />{results.totalTax}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pl-4 pr-0 py-2 border-l-2 border-blue-500/30 ml-4 mb-4">
                  <div>
                    <span className="block text-xs text-slate-400 mb-1">CGST ({gstRate/2}%)</span>
                    <span className="font-mono text-sm text-slate-300 flex items-center"><IndianRupee className="w-2 h-2 mr-1" />{results.cgst}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 mb-1">SGST ({gstRate/2}%)</span>
                    <span className="font-mono text-sm text-slate-300 flex items-center"><IndianRupee className="w-2 h-2 mr-1" />{results.sgst}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-300 font-bold mb-1">Total Gross Amount</span>
                    <span className="text-3xl font-mono font-bold text-amber-400 flex items-center">
                       <IndianRupee className="w-6 h-6 mr-1" />{results.grossAmount}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
