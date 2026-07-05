import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Calculator, ShieldCheck, MessageSquare, TrendingUp, Search, Home, MoreHorizontal, ArrowUpRight, ArrowDownRight, Clock, Send, CheckCircle2, Download, DollarSign } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import LeadForm from "./LeadForm";
import SEO from "./SEO";
import LeadManagement from "./LeadManagement";
import RevenueTracker from "./RevenueTracker";

import RegionalSEOStrategy from "./RegionalSEOStrategy";

interface KeywordData {
  keyword: string;
  volume: string;
  difficulty: string;
  trend: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "seo" | "traffic" | "forms" | "pipeline" | "revenue">("overview");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Email Forwarding State
  const [forwardingState, setForwardingState] = useState<{[key: number]: 'idle' | 'sending' | 'sent'}>({});
  const [selectedDepartment, setSelectedDepartment] = useState<{[key: number]: string}>({});

  const handleForward = async (email: string, index: number) => {
    setForwardingState(prev => ({...prev, [index]: 'sending'}));
    const department = selectedDepartment[index] || 'sales@mygstsolution.com';
    
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: department,
          subject: `New Lead Forwarded: ${email}`,
          body: `Please follow up with the new lead: ${email}`
        })
      });
      
      if (res.ok) {
          setForwardingState(prev => ({...prev, [index]: 'sent'}));
          setTimeout(() => {
               setForwardingState(prev => ({...prev, [index]: 'idle'}));
          }, 3000);
      } else {
        setForwardingState(prev => ({...prev, [index]: 'idle'}));
      }
    } catch (err) {
        setForwardingState(prev => ({...prev, [index]: 'idle'}));
    }
  };

  const handleExportCSV = () => {
    const leads = [
      { name: "TechVision India", email: "tech@techvision.com", service: "GST Registration", status: "Pending Doc", date: "2026-06-20" },
      { name: "Rahul Mehta", email: "rahul@example.com", service: "Annual Return", status: "In Progress", date: "2026-06-19" },
      { name: "Acme Exports", email: "contact@acme.com", service: "GST Notice Reply", status: "Resolved", date: "2026-06-18" },
      { name: "Priya Sharma", email: "p.sharma@example.com", service: "General Inquiry", status: "New", date: "2026-06-20" },
      { name: "Vikram Singh", email: "vsingh_logistics@example.com", service: "Advisory", status: "In Progress", date: "2026-06-19" },
      { name: "Ananya Desai", email: "adesai.consulting@example.com", service: "Tax Planning", status: "Pending", date: "2026-06-18" },
      { name: "Karan Patel", email: "karan.patel.biz@example.com", service: "GST Registration", status: "New", date: "2026-06-17" }
    ];

    const headers = ["Name,Email,Service Needed,Status,Date"];
    const csvContent = headers.concat(
      leads.map(l => `"${l.name}","${l.email}","${l.service}","${l.status}","${l.date}"`)
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "leads_report_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetch("/api/keywords")
      .then((res) => res.json())
      .then((data) => {
        setKeywords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch keywords", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-100 font-sans overflow-hidden relative">
      <SEO 
        title="Admin Dashboard | MyGST Solution" 
        description="Monitor your GST compliance status, pending returns, and refund claims via the MyGST Solution Admin Dashboard."
      />
      {/* Background Orbs for Mesh Effect */}
      <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col hidden md:flex shrink-0 backdrop-blur-xl z-20">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-base text-white">M</div>
            MyGST Solution
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto w-full">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium shadow-sm transition-colors w-full cursor-pointer ${activeTab === 'overview' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}>
            <Home className="w-5 h-5" />
            Overview
          </button>
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reports & Analytics</p>
          </div>
          <button 
            onClick={() => setActiveTab("traffic")}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-colors w-full cursor-pointer ${activeTab === 'traffic' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}>
            <BarChart3 className="w-5 h-5" />
            Traffic & Engagement
          </button>
          <button 
             onClick={() => setActiveTab("seo")}
             className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-colors w-full cursor-pointer ${activeTab === 'seo' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}>
            <Search className="w-5 h-5" />
            SEO & Keywords
          </button>
          <button 
             onClick={() => setActiveTab("forms")}
             className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-colors w-full cursor-pointer ${activeTab === 'forms' ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}>
            <MessageSquare className="w-5 h-5" />
            Forms & Queries
          </button>
          
          <button 
             onClick={() => setActiveTab("pipeline" as any)}
             className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-colors w-full cursor-pointer ${activeTab as any === 'pipeline' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}>
            <CheckCircle2 className="w-5 h-5" />
            Lead Management
          </button>
          
          <button 
             onClick={() => setActiveTab("revenue" as any)}
             className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-colors w-full cursor-pointer ${activeTab as any === 'revenue' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}>
            <DollarSign className="w-5 h-5" />
            Revenue
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-white/10">
           <button 
             onClick={() => {
               localStorage.removeItem("token");
               localStorage.removeItem("role");
               localStorage.removeItem("name");
               navigate("/login");
             }}
             className="flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium rounded-xl transition-colors w-full"
           >
              Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col h-full bg-transparent z-10 relative">
        <div className="p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h1 className="text-2xl font-bold text-white">Welcome Back, Business Owner</h1>
            <div className="flex gap-4">
              <span className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active Account
              </span>
            </div>
          </header>

          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Active Clients</p>
                  <p className="text-3xl font-bold text-white">124</p>
                </div>
                <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                  <p className="text-slate-400 text-sm font-medium mb-1">New Queries (MTD)</p>
                  <p className="text-3xl font-bold text-amber-400">42</p>
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% from last month</p>
                </div>
                <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                  <p className="text-slate-400 text-sm font-medium mb-1">Average Resolution Time</p>
                  <p className="text-3xl font-bold text-blue-400">1.4 Days</p>
                </div>
                <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                  <p className="text-slate-400 text-sm font-medium mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-white">18.5%</p>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Activity & Consultations</h2>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10 shadow-sm">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 text-sm border-b border-white/10">
                        <th className="pb-4 font-medium">Client / Lead</th>
                        <th className="pb-4 font-medium hidden md:table-cell">Service Needed</th>
                        <th className="pb-4 font-medium hidden sm:table-cell">Status</th>
                        <th className="pb-4 font-medium hidden lg:table-cell">Date</th>
                        <th className="pb-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { client: "TechVision India", email: "tech@techvision.com", service: "GST Registration", status: "Pending Doc", statusColor: "amber", date: "Today, 10:24 AM" },
                        { client: "Rahul Mehta (Retail)", email: "rahul@example.com", service: "Annual Return", status: "In Progress", statusColor: "blue", date: "Yesterday" },
                        { client: "Acme Exports", email: "contact@acme.com", service: "GST Notice Reply", status: "Resolved", statusColor: "green", date: "Jun 18, 2026" }
                      ].map((item, index) => {
                         const fIndex = index + 50; // offset index for state management
                         return (
                          <tr key={index} className="border-b border-white/5 last:border-0 group hover:bg-white/[0.02]">
                            <td className="py-4">
                               <p className="text-white font-medium">{item.client}</p>
                               <p className="text-xs text-slate-400">{item.email}</p>
                               {/* Mobile only details */}
                               <div className="md:hidden mt-2 space-y-1 block sm:hidden">
                                 <p className="text-xs text-slate-300">Service: {item.service}</p>
                                 <span className={`px-2 py-0.5 inline-block rounded-full text-[10px] font-medium bg-${item.statusColor}-500/20 text-${item.statusColor}-400 border border-${item.statusColor}-500/30`}>{item.status}</span>
                               </div>
                               <div className="lg:hidden text-[10px] text-slate-500 mt-1 block">{item.date}</div>
                            </td>
                            <td className="py-4 text-slate-300 hidden md:table-cell">{item.service}</td>
                            <td className="py-4 hidden sm:table-cell">
                               <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${item.statusColor}-500/20 text-${item.statusColor}-400 border border-${item.statusColor}-500/30`}>{item.status}</span>
                            </td>
                            <td className="py-4 text-slate-400 hidden lg:table-cell">{item.date}</td>
                            <td className="py-4 text-right">
                               <div className="flex justify-end pr-2">
                                  <button 
                                      onClick={() => handleForward(item.email, fIndex)}
                                      disabled={forwardingState[fIndex] === 'sending' || forwardingState[fIndex] === 'sent'}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        forwardingState[fIndex] === 'sent' 
                                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                          : 'bg-white/10 hover:bg-white/20 text-white shadow-sm border border-white/10'
                                      }`}
                                    >
                                       {forwardingState[fIndex] === 'sending' ? (
                                          <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</>
                                       ) : forwardingState[fIndex] === 'sent' ? (
                                          <><CheckCircle2 className="w-3 h-3" /> Sent</>
                                       ) : (
                                          <><Send className="w-3 h-3" /> Fwd to Dept</>
                                       )}
                                    </button>
                               </div>
                            </td>
                          </tr>
                         );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'traffic' && (
            <div className="mb-10 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Traffic & Engagement Report</h2>
                <p className="text-slate-400 text-sm mb-6">Daily, weekly, and monthly insights into website engagement.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Main Traffic Chart */}
                 <div className="lg:col-span-2 p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-white">Website Visitors</h3>
                      <select className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-1">
                        <option>Monthly</option>
                        <option>Weekly</option>
                        <option>Daily</option>
                      </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={[
                        { name: 'W1', users: 1200, returning: 400 },
                        { name: 'W2', users: 1800, returning: 600 },
                        { name: 'W3', users: 1400, returning: 800 },
                        { name: 'W4', users: 2200, returning: 900 },
                      ]}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="returning" stroke="#f59e0b" fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 flex-1">
                      <h3 className="font-semibold text-white mb-4">Traffic Sources</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={[
                            { name: 'Organic Search', value: 55 },
                            { name: 'Direct', value: 20 },
                            { name: 'Social', value: 15 },
                            { name: 'Referral', value: 10 },
                          ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            <Cell fill="#3b82f6" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#10b981" />
                            <Cell fill="#6366f1" />
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Organic</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Direct</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Social</span>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Section Engagement Metrics Chart */}
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-white">Section Engagement Metrics (Time on Page vs Bounce Rate)</h3>
                  <select className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-1">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Home', timeSpent: 120, views: 3400 },
                    { name: 'Services', timeSpent: 300, views: 2400 },
                    { name: 'About', timeSpent: 80, views: 1200 },
                    { name: 'Contact', timeSpent: 45, views: 800 },
                    { name: 'Blog', timeSpent: 180, views: 1800 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                    <Bar yAxisId="left" dataKey="views" name="Page Views" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar yAxisId="right" dataKey="timeSpent" name="Avg. Time Spent (s)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="mb-10 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">SEO & Keyword Performance</h2>
                <p className="text-slate-400 text-sm mb-6">Track your search engine ranking and discover new target keywords.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 p-6 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 h-fit">
                  <h3 className="font-semibold text-white mb-6">Overall SEO Health</h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-green-500/20">
                      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="351.8" strokeDashoffset="42" className="transition-all duration-1000" />
                      </svg>
                      <div className="text-center">
                        <span className="text-3xl font-bold text-white">88</span>
                        <span className="block text-xs text-slate-400">/ 100</span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between text-slate-300"><span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500"/> Meta Tags</span> <span className="text-green-400">Good</span></li>
                    <li className="flex justify-between text-slate-300"><span className="flex items-center gap-2"><Clock className="w-4 h-4 text-green-500"/> Page Speed</span> <span className="text-green-400">Fast</span></li>
                    <li className="flex justify-between text-slate-300"><span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-500"/> Backlinks</span> <span className="text-amber-400">Needs Work</span></li>
                  </ul>
                </div>

                <div className="lg:col-span-2 p-8 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 h-fit">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                      <span className="text-amber-500 text-2xl">🚀</span> Target Keyword Intelligence
                    </h2>
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20">AI Generated Recommendations</span>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-white/5 rounded-2xl"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {keywords.map((k, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition">
                          <div>
                            <p className="font-semibold text-slate-200 mb-1 text-sm">{k.keyword}</p>
                            <div className="flex gap-2">
                              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">Vol: {k.volume}</span>
                              <span className="text-[10px] bg-slate-500/20 text-slate-300 px-2 py-0.5 rounded-full font-bold">Diff: {k.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-slate-400">Current Rank: <span className="text-white font-medium">{Math.floor(Math.random() * 50) + 1}</span></span>
                            <div className="text-blue-400 font-bold text-xs bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                              Trend: {k.trend}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors text-white">
                    Apply Keywords to Site Content
                  </button>
                </div>
              </div>
              <RegionalSEOStrategy />
            </div>
          )}

          {activeTab === 'forms' && (
            <div className="mb-10 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Form & Query Statistics</h2>
                <p className="text-slate-400 text-sm mb-6">Analyze which sections of the site generate the most leads and view trends over time.</p>
              </div>

              {/* Inquiry Trends Chart */}
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-white">Inquiry Trends (Last 30 Days)</h3>
                  <select className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-1">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { name: 'W1', forms: 12, chatbots: 5, direct: 8 },
                    { name: 'W2', forms: 18, chatbots: 8, direct: 9 },
                    { name: 'W3', forms: 15, chatbots: 12, direct: 7 },
                    { name: 'W4', forms: 24, chatbots: 15, direct: 11 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                    <Line type="monotone" dataKey="forms" name="Web Forms" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="chatbots" name="AI Chatbot" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="direct" name="Direct Emails" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white mb-6">Query Origination by Source</h3>
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                            Pre-Consultation Form (Hero)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-indigo-400">
                            48%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                        <div style={{ width: "48%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-500/10 border border-blue-500/20">
                            Contact Us Page Form
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-400">
                            25%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                        <div style={{ width: "25%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-400 bg-green-500/10 border border-green-500/20">
                            Direct Email
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-green-400">
                            15%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                        <div style={{ width: "15%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/20">
                            AI Chatbot Leads
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-amber-400">
                            12%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                        <div style={{ width: "12%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 flex flex-col h-full">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="font-semibold text-white">Recent Form Submitters</h3>
                     <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/10 shadow-sm">
                       <Download className="w-3.5 h-3.5" />
                       Export
                     </button>
                   </div>
                   <div className="space-y-4 overflow-y-auto pr-2">
                     {[
                       { name: "Priya Sharma", email: "p.sharma@example.com", date: "Today" },
                       { name: "Vikram Singh", email: "vsingh_logistics@example.com", date: "Yesterday" },
                       { name: "Ananya Desai", email: "adesai.consulting@example.com", date: "2 Days Ago" },
                       { name: "Karan Patel", email: "karan.patel.biz@example.com", date: "3 Days Ago" }
                     ].map((item, index) => (
                       <div key={index} className="flex flex-col gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5 group">
                         <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium border border-slate-700">
                               {item.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-medium text-white">{item.name}</p>
                               <p className="text-xs text-slate-400">{item.email}</p>
                             </div>
                           </div>
                           <div className="text-xs text-slate-500">{item.date}</div>
                         </div>
                         
                         {/* Email Forwarding Actions */}
                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <select 
                                className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-blue-500/50 flex-1"
                                value={selectedDepartment[index] || ""}
                                onChange={(e) => setSelectedDepartment(prev => ({...prev, [index]: e.target.value}))}
                            >
                              <option value="sales@mygstsolution.com">Sales Team</option>
                              <option value="support@mygstsolution.com">Support Team</option>
                              <option value="advisory@mygstsolution.com">Advisory Team</option>
                            </select>
                            
                            <button 
                              onClick={() => handleForward(item.email, index)}
                              disabled={forwardingState[index] === 'sending' || forwardingState[index] === 'sent'}
                              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                                forwardingState[index] === 'sent' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                              }`}
                            >
                               {forwardingState[index] === 'sending' && (
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                               )}
                               {forwardingState[index] === 'sent' && (
                                  <><CheckCircle2 className="w-3 h-3" /> Sent</>
                               )}
                               {(!forwardingState[index] || forwardingState[index] === 'idle') && (
                                  <><Send className="w-3 h-3" /> Forward</>
                               )}
                            </button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <LeadManagement />
          )}

          {activeTab === 'revenue' && (
            <RevenueTracker />
          )}
        </div>
      </main>
    </div>
  );
}
