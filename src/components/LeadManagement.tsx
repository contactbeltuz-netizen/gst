import React, { useEffect, useState } from "react";
import { Search, MapPin, Mail, Phone, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { LeadPipelineSkeleton } from "./Skeleton";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  status: 'New' | 'In-Progress' | 'Converted';
  date: string;
}

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        setLeads(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus as any } : lead));
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const newLeads = leads.filter(l => l.status === "New");
  const inProgressLeads = leads.filter(l => l.status === "In-Progress");
  const convertedLeads = leads.filter(l => l.status === "Converted");

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-white text-base">{lead.name}</h4>
          <span className="text-xs text-slate-400 block mt-1">{lead.service}</span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4 text-sm mt-3">
        <div className="flex items-center text-slate-300">
          <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center text-slate-300">
            <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <span>{lead.phone}</span>
          </div>
        )}
        <div className="flex items-center text-slate-400 text-xs">
          <Calendar className="w-3.5 h-3.5 mr-2" />
          <span>{lead.date}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-3 mt-3">
        <label className="text-xs text-slate-400 mb-1.5 block">Update Status:</label>
        <select 
          value={lead.status}
          onChange={(e) => updateStatus(lead.id, e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
        >
          <option value="New">New Lead</option>
          <option value="In-Progress">In Progress</option>
          <option value="Converted">Converted</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return <LeadPipelineSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Lead Pipeline</h2>
          <p className="text-slate-400">Manage and track your lead status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Leads */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="bg-amber-500/20 p-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-semibold text-white">New Leads</h3>
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full border border-slate-700">
              {newLeads.length}
            </span>
          </div>
          <div className="space-y-4">
            {newLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
            {newLeads.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No new leads</p>}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="bg-blue-500/20 p-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-semibold text-white">In Progress</h3>
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full border border-slate-700">
              {inProgressLeads.length}
            </span>
          </div>
          <div className="space-y-4">
            {inProgressLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
            {inProgressLeads.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No leads in progress</p>}
          </div>
        </div>

        {/* Converted */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="bg-green-500/20 p-1.5 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="font-semibold text-white">Converted</h3>
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full border border-slate-700">
              {convertedLeads.length}
            </span>
          </div>
          <div className="space-y-4 shadow-inner">
            {convertedLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
            {convertedLeads.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No converted leads</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
