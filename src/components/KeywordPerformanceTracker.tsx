import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ComposedChart
} from "recharts";
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  Activity, 
  TrendingUp, 
  HelpCircle, 
  ChevronRight, 
  Flame, 
  Target, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface KeywordMetric {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface AIOptResult {
  analysis: string;
  metaTitle: string;
  metaDescription: string;
  contentStrategy: string;
}

export default function KeywordPerformanceTracker() {
  // Initial rich SEO Keyword Performance Metrics
  const [keywordList, setKeywordList] = useState<KeywordMetric[]>([
    { keyword: "GST Refund for Export of Services", clicks: 1240, impressions: 8500, ctr: 14.5, position: 2.1, difficulty: "Medium" },
    { keyword: "GSTR-9C Last Date 2026", clicks: 2310, impressions: 11000, ctr: 21.0, position: 1.4, difficulty: "Hard" },
    { keyword: "Input Tax Credit on Electric Vehicles", clicks: 450, impressions: 3100, ctr: 14.5, position: 3.5, difficulty: "Easy" },
    { keyword: "GST Notice for Mismatch in GSTR 3B vs 2A", clicks: 1890, impressions: 9800, ctr: 19.2, position: 2.4, difficulty: "Medium" },
    { keyword: "Section 83 Provisional Attachment GST", clicks: 320, impressions: 1800, ctr: 17.7, position: 4.2, difficulty: "Hard" },
    { keyword: "E-way Bill Generation India", clicks: 810, impressions: 5400, ctr: 15.0, position: 2.8, difficulty: "Easy" },
  ]);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [activeMetric, setActiveMetric] = useState<"clicks-impressions" | "ctr" | "position">("clicks-impressions");

  // New simulated keyword state
  const [newKeyword, setNewKeyword] = useState("");
  const [newClicks, setNewClicks] = useState("");
  const [newImpressions, setNewImpressions] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // AI Diagnostic Audit State
  const [selectedAuditKeyword, setSelectedAuditKeyword] = useState<KeywordMetric | null>(null);
  const [auditResult, setAuditResult] = useState<AIOptResult | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [auditError, setAuditError] = useState("");

  // Filter list
  const filteredKeywords = keywordList.filter(item => {
    const matchesSearch = item.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Handle adding custom simulated keyword
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newClicks || !newImpressions || !newPosition) {
      alert("Please fill all simulated keyword fields.");
      return;
    }

    const clicksVal = parseInt(newClicks);
    const impVal = parseInt(newImpressions);
    const posVal = parseFloat(newPosition);

    if (isNaN(clicksVal) || isNaN(impVal) || isNaN(posVal)) {
      alert("Clicks, Impressions and Position must be numeric values.");
      return;
    }

    const itemCtr = parseFloat(((clicksVal / impVal) * 100).toFixed(1));

    const updatedMetric: KeywordMetric = {
      keyword: newKeyword.trim(),
      clicks: clicksVal,
      impressions: impVal,
      ctr: itemCtr,
      position: posVal,
      difficulty: newDifficulty
    };

    setKeywordList([...keywordList, updatedMetric]);
    setNewKeyword("");
    setNewClicks("");
    setNewImpressions("");
    setNewPosition("");
    alert(`Success: "${updatedMetric.keyword}" added to active monitoring metrics!`);
  };

  // Perform AI Keyword Diagnostic
  const handlePerformAudit = async (keywordObj: KeywordMetric) => {
    setSelectedAuditKeyword(keywordObj);
    setIsLoadingAudit(true);
    setAuditResult(null);
    setAuditError("");

    try {
      const response = await fetch("/api/ai-keyword-opt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keywordObj.keyword,
          clicks: keywordObj.clicks,
          impressions: keywordObj.impressions,
          ctr: keywordObj.ctr,
          position: keywordObj.position
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResult(data);
      } else {
        setAuditError("Could not retrieve AI optimizations. Please check if your Gemini API key is configured.");
      }
    } catch (e) {
      console.error(e);
      setAuditError("API connection error occurred.");
    } finally {
      setIsLoadingAudit(false);
    }
  };

  return (
    <div className="bg-[#0C1226] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 z-10 relative">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" /> Performance & Ranking Diagnostics
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Organic Search Keywords Visualizer
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Track clicks, search impressions, CTR ratios, and trigger instant Gemini SEO compliance audits.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveMetric("clicks-impressions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMetric === "clicks-impressions" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Clicks vs Impressions
          </button>
          <button
            onClick={() => setActiveMetric("ctr")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMetric === "ctr" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Click-Through Rate (CTR)
          </button>
          <button
            onClick={() => setActiveMetric("position")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMetric === "position" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Average Position
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium shrink-0">Difficulty:</span>
          <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5 w-full justify-between">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff as any)}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDifficulty === diff 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Metric KPIs */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 flex justify-between items-center text-xs">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Listed</p>
            <p className="text-base font-black text-white font-mono mt-0.5">{filteredKeywords.length} terms</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Avg Position</p>
            <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
              {(filteredKeywords.reduce((acc, k) => acc + k.position, 0) / (filteredKeywords.length || 1)).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl">
        <div className="h-[320px] w-full">
          {filteredKeywords.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-slate-500 text-xs">
              <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
              No keywords match current filters.
            </div>
          ) : activeMetric === "clicks-impressions" ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredKeywords} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="keyword" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={9} tickLine={false} axisLine={false} label={{ value: 'Clicks', angle: -90, position: 'insideLeft', fill: '#3b82f6', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={9} tickLine={false} axisLine={false} label={{ value: 'Impressions', angle: 90, position: 'insideRight', fill: '#8b5cf6', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0C1226', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="clicks" name="Search Clicks" fill="url(#barGlow)" radius={[4, 4, 0, 0]} barSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : activeMetric === "ctr" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredKeywords} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="keyword" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#10b981" fontSize={9} tickLine={false} axisLine={false} label={{ value: 'CTR %', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0C1226', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="ctr" name="Click-Through Rate (%)" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredKeywords} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="posGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="keyword" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#f59e0b" fontSize={9} tickLine={false} axisLine={false} reversed label={{ value: 'Average Rank (1 is Best)', angle: -90, position: 'insideLeft', fill: '#f59e0b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0C1226', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="position" name="Average Ranking Position" fill="url(#posGlow)" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* METRICS DETAIL GRID & INTERACTIVE ACTION SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Keywords performance list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-xs font-black uppercase tracking-wider">Compliance Search Terms Performance</h3>
            <span className="text-[10px] text-slate-500 font-semibold">Select keyword to run AI SEO Audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/5 pb-3 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Keyword</th>
                  <th className="pb-3 text-center">Clicks</th>
                  <th className="pb-3 text-center">Impressions</th>
                  <th className="pb-3 text-center">CTR %</th>
                  <th className="pb-3 text-center">Position</th>
                  <th className="pb-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredKeywords.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-white/[0.02] transition-all ${selectedAuditKeyword?.keyword === item.keyword ? 'bg-blue-500/5' : ''}`}
                  >
                    <td className="py-3 pr-2 font-semibold text-slate-200">
                      <div className="flex flex-col">
                        <span>{item.keyword}</span>
                        <span className={`inline-block w-fit mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          item.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" :
                          item.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" :
                          "bg-red-500/10 text-red-400 border border-red-500/15"
                        }`}>
                          {item.difficulty} Difficulty
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-blue-400">{item.clicks.toLocaleString()}</td>
                    <td className="py-3 text-center font-mono text-slate-300">{item.impressions.toLocaleString()}</td>
                    <td className="py-3 text-center font-mono text-emerald-400 font-bold">{item.ctr}%</td>
                    <td className="py-3 text-center font-mono text-amber-400 font-bold">{item.position}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handlePerformAudit(item)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ml-auto ${
                          selectedAuditKeyword?.keyword === item.keyword
                            ? "bg-blue-600 text-white"
                            : "bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Custom Simulation Creator Form */}
        <div className="bg-[#0A0F21] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Simulate Search Term</h4>
              <p className="text-slate-500 text-[10px]">Add potential content target to metrics visualizer</p>
            </div>
          </div>

          <form onSubmit={handleAddKeyword} className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Target Search Keyword</label>
              <input
                type="text"
                placeholder="e.g. GST Audit penalties Section 74"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Actual Clicks</label>
                <input
                  type="number"
                  placeholder="240"
                  value={newClicks}
                  onChange={(e) => setNewClicks(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Impressions</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={newImpressions}
                  onChange={(e) => setNewImpressions(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Average Position</label>
                <input
                  type="text"
                  placeholder="3.2"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">SEO Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add to Active Visualizer
            </button>
          </form>
        </div>
      </div>

      {/* DYNAMIC GEMINI KEYWORD PERFORMANCE DIAGNOSTIC CARD */}
      {selectedAuditKeyword && (
        <div className="bg-gradient-to-tr from-[#0F1735] to-[#121F46] border border-blue-500/20 p-6 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  Gemini AI Optimization Diagnostics: <span className="text-blue-400">"{selectedAuditKeyword.keyword}"</span>
                </h4>
                <p className="text-slate-400 text-[11px]">Real-time content meta configuration and keyword intent alignment strategy</p>
              </div>
            </div>
            
            <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono px-2.5 py-1 rounded-full uppercase font-black">
              Pos {selectedAuditKeyword.position} | CTR {selectedAuditKeyword.ctr}%
            </span>
          </div>

          {isLoadingAudit ? (
            <div className="py-8 flex flex-col justify-center items-center space-y-3">
              <div className="w-7 h-7 border-3 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">Gemini 3.5 Compliance Analyst auditing search index...</p>
            </div>
          ) : auditError ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{auditError}</span>
            </div>
          ) : auditResult ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Strategic Audit Analysis</span>
                <p className="text-slate-200 leading-relaxed font-sans">{auditResult.analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Proposed Meta Configuration</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block">Meta Title (under 60 chars)</span>
                      <p className="text-slate-300 font-mono text-[11px] select-all bg-black/35 px-2.5 py-1.5 rounded mt-0.5 border border-white/5">{auditResult.metaTitle}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block">Meta Description (under 160 chars)</span>
                      <p className="text-slate-300 font-mono text-[11px] select-all bg-black/35 px-2.5 py-1.5 rounded mt-0.5 border border-white/5 leading-relaxed">{auditResult.metaDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1.5">Actionable Content Upgrade Plan</span>
                  <p className="text-slate-200 leading-relaxed font-sans mb-3">{auditResult.contentStrategy}</p>
                  <div className="flex gap-2 text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-3 py-2 rounded-lg border border-indigo-500/10 w-fit">
                    <Target className="w-3.5 h-3.5" />
                    <span>Target optimization priority: High</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
