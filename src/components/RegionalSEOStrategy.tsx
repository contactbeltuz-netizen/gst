import React from "react";
import { Search, MapPin, Target, TrendingUp, AlertTriangle, Users } from "lucide-react";

export default function RegionalSEOStrategy() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Regional SEO Strategy (West Bengal to PAN India)</h2>
            <p className="text-slate-400 text-sm mt-1">Actionable insights to drive 500K+ visitors over 6 months from a hyper-local base to national scale.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Phase 1: West Bengal Hyper-Local */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-bold text-sm">1</span>
              <h3 className="font-bold text-white">Phase 1: Win West Bengal (Months 1-2)</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Before expanding PAN India, solidify regional authority. Google favors localized expertise for financial and legal services.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-slate-300"><strong className="text-white">Geo-Targeted Keywords:</strong> "GST registration in Kolkata", "GST consultant in Siliguri", "West Bengal GST rate changes"</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-slate-300"><strong className="text-white">Google Business Profile:</strong> Optimize listings with local Bengali and English keywords. Collect 50+ local reviews.</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-slate-300"><strong className="text-white">State-Specific Content:</strong> Create blog posts about "WB Professional Tax & GST integration" and "E-way bill rules specific to West Bengal".</span>
              </li>
            </ul>
          </div>

          {/* Phase 2: PAN India Expansion */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 font-bold text-sm">2</span>
              <h3 className="font-bold text-white">Phase 2: PAN India Scaling (Months 3-6)</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Leverage the regional domain authority to target high-intent, low-competition long-tail keywords nationwide.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-slate-300"><strong className="text-white">Long-Tail Queries:</strong> Target highly specific questions. E.g., "How to file GSTR-9 for e-commerce sellers", "GST on export of software services".</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-slate-300"><strong className="text-white">Programmatic SEO:</strong> Create templated pages for "[Service] in [City]". Examples: "GST Registration in Pune", "GST Consultant in Hyderabad".</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-slate-300"><strong className="text-white">Tools as Lead Magnets:</strong> Develop free calculators (GST Calculator, HSN Code Finder) which naturally attract high volume traffic.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Can it reach 500K? */}
        <div className="mt-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Can we reach 500K visits in 6 months?
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Since <strong className="text-white">mygstsolution.com</strong> is an established <strong className="text-emerald-400">2+ year old domain</strong>, it <strong className="text-white">WILL NOT</strong> be treated as a new site. You bypass the Google "Sandbox" entirely! This is a massive SEO advantage. With existing domain authority, your new content will index and rank significantly faster. However, 500K organic visits in 6 months remains highly ambitious.
          </p>
          
          <h4 className="text-sm font-bold text-white mb-2">How to leverage your Domain Age advantage:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="flex items-center gap-2 text-emerald-400 font-semibold mb-2 text-sm">
                <Target className="w-4 h-4" /> 301 Redirect Architecture
              </span>
              <p className="text-xs text-slate-400">Ensure any URLs from your old website matching this domain are properly 301 redirected to the new pages. Do not lose the 'link juice' you built over 2 years.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="flex items-center gap-2 text-blue-400 font-semibold mb-2 text-sm">
                <Search className="w-4 h-4" /> Aggressive Topic Clustering
              </span>
              <p className="text-xs text-slate-400">Because your domain is established, you can aggressively publish "Programmatic SEO" pages (e.g., "GST Registration in [City]") without triggering spam filters as easily as a new domain would.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
