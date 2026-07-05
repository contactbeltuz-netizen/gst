import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { FileText, Bell, CreditCard, CheckCircle2, AlertCircle, LogOut } from "lucide-react";

export default function ClientPortal() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "client") {
       navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const clientName = localStorage.getItem("name") || "Client";

  return (
    <MainLayout>
      <SEO title="Client Portal | MyGST Solution" description="Manage your GST compliance and view reports." />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, {clientName}</h1>
              <p className="text-slate-400">Here is your GST compliance overview for this month.</p>
           </div>
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10 shadow-sm"
           >
             <LogOut className="w-4 h-4" />
             Log Out
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-16 h-16 text-blue-500" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-2 relative z-10">GST Returns</h3>
             <p className="text-slate-400 text-sm mb-4 relative z-10">GSTR-1 and GSTR-3B status.</p>
             <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl px-4 py-3 font-medium flex items-center gap-2 text-sm relative z-10">
                <AlertCircle className="w-4 h-4" />
                Next Due: 20th of next month
             </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bell className="w-16 h-16 text-emerald-500" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Notices & Alerts</h3>
             <p className="text-slate-400 text-sm mb-4 relative z-10">Departmental communications.</p>
             <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 font-medium flex items-center gap-2 text-sm relative z-10">
                <CheckCircle2 className="w-4 h-4" />
                No active notices
             </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-16 h-16 text-amber-500" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Payments & Challans</h3>
             <p className="text-slate-400 text-sm mb-4 relative z-10">Recent tax liability payments.</p>
             <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-4 py-3 font-medium flex justify-between text-sm relative z-10">
                <span>Last Paid: ₹45,200</span>
                <span className="text-xs text-slate-500">18 Jun 2026</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8">
           <h2 className="text-xl font-bold text-white mb-6">Recent Documents Uploaded</h2>
           <div className="space-y-4">
              {[
                { name: "Purchase Register - May 2026.xlsx", date: "15 Jun 2026", type: "Excel" },
                { name: "Sales Register - May 2026.csv", date: "12 Jun 2026", type: "CSV" },
                { name: "Bank Statement - May 2026.pdf", date: "10 Jun 2026", type: "PDF" }
              ].map((doc, idx) => (
                 <div key={idx} className="flex justify-between items-center p-4 bg-slate-950 border border-white/5 rounded-2xl hover:bg-white/5 transition">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <FileText className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-medium text-white">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.date}</p>
                       </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View</button>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </MainLayout>
  );
}
