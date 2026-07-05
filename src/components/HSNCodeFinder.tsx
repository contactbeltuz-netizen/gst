import React, { useState } from "react";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { Search, Tag, AlertCircle, ArrowRight, Lock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const initialHsnDatabase = [
  { code: "1006", description: "Rice", rate: "0% / 5%" },
  { code: "0401", description: "Milk and cream, not concentrated nor containing added sugar", rate: "0%" },
  { code: "0406", description: "Cheese and curd", rate: "12%" },
  { code: "0901", description: "Coffee, whether or not roasted or decaffeinated", rate: "5%" },
  { code: "0902", description: "Tea, whether or not flavoured", rate: "5%" },
  { code: "1101", description: "Wheat or meslin flour", rate: "0% / 5%" },
  { code: "1507", description: "Soya-bean oil and its fractions", rate: "5%" },
  { code: "1701", description: "Cane or beet sugar and chemically pure sucrose", rate: "5%" },
  { code: "2101", description: "Coffee extracts, essences and concentrates", rate: "18%" },
  { code: "2106", description: "Food preparations not elsewhere specified or included", rate: "18%" },
  { code: "2523", description: "Portland cement, aluminous cement, slag cement", rate: "28%" },
  { code: "2701", description: "Coal; briquettes, ovoids and similar solid fuels", rate: "5%" },
  { code: "3004", description: "Medicaments (Medicines / Pharmaceuticals)", rate: "5% / 12%" },
  { code: "3208", description: "Paints and varnishes", rate: "18%" },
  { code: "3304", description: "Beauty or make-up preparations and skin care", rate: "18%" },
  { code: "3401", description: "Soap; organic surface-active products (Soaps)", rate: "18%" },
  { code: "3923", description: "Articles for the conveyance or packing of goods, of plastics", rate: "18%" },
  { code: "4202", description: "Trunks, suit-cases, vanity-cases, brief-cases, school satchels (Bags/Luggage)", rate: "18%" },
  { code: "4819", description: "Cartons, boxes, cases, bags and other packing containers, of paper", rate: "12% / 18%" },
  { code: "6109", description: "T-shirts, singlets and other vests, knitted or crocheted (Apparel/Clothing)", rate: "5% / 12%" },
  { code: "6203", description: "Men's or boys' suits, ensembles, jackets, blazers, trousers", rate: "5% / 12%" },
  { code: "6204", description: "Women's or girls' suits, ensembles, jackets, dresses, skirts", rate: "5% / 12%" },
  { code: "6403", description: "Footwear with outer soles of rubber, plastics, leather or composition leather (Shoes)", rate: "18%" },
  { code: "6907", description: "Ceramic flags and paving, hearth or wall tiles", rate: "18%" },
  { code: "7113", description: "Articles of jewellery and parts thereof", rate: "3%" },
  { code: "7214", description: "Other bars and rods of iron or non-alloy steel", rate: "18%" },
  { code: "7318", description: "Screws, bolts, nuts, coach-screws, screw hooks", rate: "18%" },
  { code: "8415", description: "Air conditioning machines (ACs)", rate: "28%" },
  { code: "8418", description: "Refrigerators, freezers and other refrigerating or freezing equipment", rate: "18%" },
  { code: "8471", description: "Automatic data processing machines (Computers, Laptops, PCs)", rate: "18%" },
  { code: "8517", description: "Telephones for cellular networks (Mobile phones / Smartphones) or for other wireless networks", rate: "18%" },
  { code: "8528", description: "Monitors and projectors, television receivers (TVs)", rate: "18%" },
  { code: "8703", description: "Motor cars and other motor vehicles principally designed for the transport of persons", rate: "28%" },
  { code: "8711", description: "Motorcycles (including mopeds) and cycles fitted with an auxiliary motor", rate: "28%" },
  { code: "8712", description: "Bicycles and other cycles, not motorised", rate: "12%" },
  { code: "9004", description: "Spectacles, goggles and the like, corrective, protective or other", rate: "12%" },
  { code: "9102", description: "Wrist-watches, pocket-watches and other watches", rate: "18%" },
  { code: "9403", description: "Other furniture and parts thereof", rate: "18%" },
  { code: "9503", description: "Tricycles, scooters, pedal cars and similar wheeled toys", rate: "12%" },
  { code: "9608", description: "Ball point pens; felt tipped and other porous-tipped pens", rate: "12%" },
  { code: "9954", description: "Construction services (SAC)", rate: "18%" },
  { code: "9963", description: "Accommodation, food and beverage services (Hotels, Restaurants - SAC)", rate: "5% / 18%" },
  { code: "9964", description: "Passenger transport services (SAC)", rate: "5%" },
  { code: "9965", description: "Goods transport services (SAC)", rate: "5%" },
  { code: "9971", description: "Financial and related services (SAC)", rate: "18%" },
  { code: "9972", description: "Real estate services (SAC)", rate: "18%" },
  { code: "9973", description: "Leasing or rental services with or without operator (SAC)", rate: "18%" },
  { code: "9982", description: "Legal and accounting services (GST code for services - SAC)", rate: "18%" },
  { code: "9983", description: "Other professional, technical and business services (IT, Software, Consulting - SAC)", rate: "18%" },
  { code: "9984", description: "Telecommunications, broadcasting and information supply services (SAC)", rate: "18%" },
  { code: "9988", description: "Manufacturing services on physical inputs (goods) owned by others (SAC)", rate: "18%" },
  { code: "9992", description: "Education services (SAC)", rate: "18%" },
  { code: "9993", description: "Human health and social care services (SAC)", rate: "18%" }
];

export default function HSNCodeFinder() {
  const [database, setDatabase] = useState(initialHsnDatabase);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [hasSearchedAi, setHasSearchedAi] = useState(false);
  const [aiMatchesFound, setAiMatchesFound] = useState(false);

  React.useEffect(() => {
    setHasSearchedAi(false);
    setAiMatchesFound(false);
  }, [searchTerm]);

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearchingAi(true);
    setHasSearchedAi(true);
    try {
      const res = await fetch("/api/hsn-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchTerm })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Append to local database so it naturally filters in
          setDatabase(prev => {
            const newItems = data.filter(newItem => !prev.some(existing => existing.code === newItem.code));
            return [...prev, ...newItems];
          });
          setAiMatchesFound(true);
        } else {
          setAiMatchesFound(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingAi(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadEmail.trim() || leadPhone.trim()) {
      setIsSubmitting(true);
      try {
        await fetch("/api/submit-hsn-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: leadEmail, phone: leadPhone, search: searchTerm })
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
        setIsUnlocked(true);
      }
    }
  };

  const filteredResults = database.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.includes(searchTerm)
  );

  return (
    <MainLayout>
      <SEO 
        title="Free HSN & SAC Code Finder | GST Rates India 2024" 
        description="Search and find accurate 4, 6, and 8-digit HSN codes and SAC codes with their respective GST rates. Fast, free, and updated for 2024." 
      />
      
      <div className="pt-24 pb-20 px-6 md:px-10 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Tag className="w-4 h-4" />
            Lead Magnet Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
             HSN & SAC <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Code Finder</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Quickly find the correct classification and GST rate for your goods or services. Stop guessing and prevent compliance errors.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-12 shadow-2xl">
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name (e.g., 'Laptop' or 'Rice') or Code (e.g., '8471')"
              className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-lg shadow-inner"
            />
          </div>

          {searchTerm === "" ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
              <Search className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">Search our database</h3>
              <p className="text-sm text-slate-500">Enter a description or numeral to find matching HSN/SAC codes instantly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-sm font-medium text-slate-400">
                  {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found {hasSearchedAi && aiMatchesFound && <span className="text-emerald-400 ml-2">(Including AI results)</span>}
                </span>
              </div>
              
              {filteredResults.length > 0 ? (
                !isUnlocked ? (
                  <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden backdrop-blur-md">
                     <div className="absolute inset-0 opacity-20 pointer-events-none select-none filter blur-[4px]">
                       <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-black/40 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-4 font-semibold">HSN / SAC Code</th>
                            <th className="px-6 py-4 font-semibold">Description</th>
                            <th className="px-6 py-4 font-semibold text-right">GST Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredResults.slice(0, 4).map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 font-mono font-bold text-white whitespace-nowrap">{item.code}</td>
                              <td className="px-6 py-4">{item.description}</td>
                              <td className="px-6 py-4 text-right font-bold text-emerald-400 whitespace-nowrap">{item.rate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                     </div>

                     <div className="relative z-10 max-w-sm mx-auto py-6">
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                          <Lock className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Unlock HSN Codes</h3>
                        <p className="text-slate-400 mb-6 text-sm">Enter your email or phone number to instantly view all GST rates and search the complete database.</p>
                        <form 
                          className="space-y-4"
                          onSubmit={handleUnlock}
                        >
                          <input 
                            type="email" 
                            placeholder="Your Email Address" 
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-900/90 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                          />
                          <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                            <span className="flex-1 h-px bg-white/10"></span>
                            OR
                            <span className="flex-1 h-px bg-white/10"></span>
                          </div>
                          <input 
                            type="tel" 
                            placeholder="Your Phone Number" 
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-900/90 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                          />
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
                          >
                            {isSubmitting ? "Unlocking..." : "Unlock Free Access"} {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                          </button>
                        </form>
                     </div>
                  </div>
                ) : (
                <div className="overflow-hidden border border-white/10 rounded-2xl">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-black/40 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 font-semibold">HSN / SAC Code</th>
                        <th className="px-6 py-4 font-semibold">Description</th>
                        <th className="px-6 py-4 font-semibold text-right">GST Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-white whitespace-nowrap">{item.code}</td>
                          <td className="px-6 py-4">{item.description}</td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-400 whitespace-nowrap">{item.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-80" />
                  <p className="text-slate-300 font-medium mb-1">No exact matches found in local database.</p>
                  <p className="text-sm text-slate-500 mb-6">Search our extended online database for accurate codes.</p>
                </div>
              )}
              
              {!hasSearchedAi ? (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleAiSearch}
                    disabled={isSearchingAi}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/10 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSearchingAi ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        Searching Online Database...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-emerald-400" />
                        Deep Search Online (AI)
                      </>
                    )}
                  </button>
                </div>
              ) : !aiMatchesFound && (
                <div className="text-center mt-6">
                  <p className="text-sm text-slate-400">Our AI couldn't find any additional exact matches for this item.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Can't find your specific product class?</h3>
            <p className="text-slate-400 text-sm">Misclassifying goods can lead to intense departmental audits. Let our experts define your exact HS classification.</p>
          </div>
          <Link to="/contact" className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            Consult an Expert <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </MainLayout>
  );
}
