import React, { useState } from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

export default function RevenueTracker() {
  const [timeRange, setTimeRange] = useState("monthly");

  const revenueData = [
    { name: 'Jan', revenue: 45000, expenses: 15000 },
    { name: 'Feb', revenue: 52000, expenses: 16000 },
    { name: 'Mar', revenue: 48000, expenses: 18000 },
    { name: 'Apr', revenue: 61000, expenses: 17000 },
    { name: 'May', revenue: 59000, expenses: 19000 },
    { name: 'Jun', revenue: 75000, expenses: 22000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Revenue Tracker</h2>
          <p className="text-slate-400">Monitor financial performance and conversion revenue.</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-white">₹3,40,000</h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <span className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Avg. Conversion Value</p>
            <h3 className="text-3xl font-bold text-white">₹14,500</h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="flex items-center text-sm font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              -2.1%
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Pending Invoices</p>
            <h3 className="text-3xl font-bold text-white">₹45,000</h3>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 h-[400px]">
        <h3 className="font-semibold text-white mb-6">Revenue vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              formatter={(value: any) => [`₹${value}`, undefined]}
            />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
