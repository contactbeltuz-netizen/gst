import React, { useState } from "react";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setStatus("success");
    } catch (error) {
      console.error("Error sending lead", error);
      setStatus("idle");
      // Add error state handling in a real app
    }
  };

  return (
    <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-2xl border border-white/10 max-w-md mx-auto w-full">
      <h3 className="text-2xl font-bold mb-4 text-white">Get a Free GST Consultation</h3>
      {status === "success" ? (
        <div className="text-green-400 font-bold p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          ✅ Request Received! Our expert will WhatsApp you in 5 minutes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <input
            name="phone"
            type="tel"
            placeholder="WhatsApp Number"
            required
            className="w-full p-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <select
            name="business_type"
            className="w-full p-3 border border-white/10 rounded-xl bg-slate-800 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          >
            <option>Small Business (SME)</option>
            <option>Mid-Large Enterprise</option>
            <option>Startup</option>
          </select>
          <select
            name="service"
            className="w-full p-3 border border-white/10 rounded-xl bg-slate-800 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          >
            <option>GST Return Filing</option>
            <option>GST Refund Claim</option>
            <option>Annual Audit (9C)</option>
            <option>Notice Resolution</option>
          </select>
          <button
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-2"
          >
            {status === "loading" ? "Processing..." : "Get Started Now"}
          </button>
        </form>
      )}
    </div>
  );
}
