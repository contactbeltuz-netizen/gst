import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, ChevronDown } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Close dropdown on route change
  useEffect(() => {
    setIsToolsMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsToolsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsToolsMenuOpen(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Background Orbs for Mesh Effect */}
      <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="h-20 px-6 md:px-10 flex items-center justify-between backdrop-blur-xl bg-white/5 border-b border-white/10 z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">M</div>
          <span className="text-2xl font-bold tracking-tight text-white">
            <Link to="/">MyGST <span className="text-amber-500">Solution</span></Link>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link to="/services" className="hover:text-white transition-colors">Services</Link>
          <div 
            className="relative nav-tools-menu" 
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              onClick={() => setIsToolsMenuOpen((prev) => !prev)}
              className={`py-4 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium cursor-pointer focus:outline-none ${isToolsMenuOpen ? 'text-amber-400' : 'text-amber-500'}`}
            >
              Tools
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              <span className="bg-amber-500/20 text-[10px] px-1.5 py-0.5 rounded text-amber-400 uppercase tracking-widest hidden lg:inline-block ml-1">Free</span>
            </button>
            <div 
              className={`absolute top-[80%] left-0 pt-4 w-56 transition-all duration-200 ease-in-out origin-top-left z-50 ${isToolsMenuOpen ? "opacity-100 scale-100 visible pointer-events-auto" : "opacity-0 scale-95 invisible pointer-events-none"}`}
            >
              <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl flex flex-col p-2 relative backdrop-blur-xl">
                 <Link to="/gst-calculator" onClick={() => setIsToolsMenuOpen(false)} className="px-4 py-3 hover:bg-white/5 rounded-lg text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-3">
                   <div className="bg-amber-500/10 p-2 rounded-lg">
                     <span className="text-amber-500 font-bold text-xs">GST</span>
                   </div>
                   GST Calc
                 </Link>
                 <Link to="/hsn-code-finder" onClick={() => setIsToolsMenuOpen(false)} className="px-4 py-3 hover:bg-white/5 rounded-lg text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-3">
                   <div className="bg-emerald-500/10 p-2 rounded-lg">
                     <span className="text-emerald-500 font-bold text-xs">HSN</span>
                   </div>
                   HSN Finder
                 </Link>
              </div>
            </div>
          </div>
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold text-white transition-all shadow-lg shadow-blue-600/20"
        >
          Client Login
        </Link>
      </nav>

      <main className="flex-1 flex flex-col z-10 relative">
        {children}
      </main>

      {/* Floating Chat Integration */}
      <div className="fixed bottom-8 left-8 z-50">
        <button className="p-4 rounded-3xl backdrop-blur-xl bg-green-500/10 border border-green-500/20 flex items-center gap-4 hover:bg-green-500/20 transition-all shadow-lg hover:shadow-green-500/20 group text-left max-w-full">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="hidden md:block pr-2">
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Active Support</p>
            <p className="text-sm text-slate-100">Average response: 4 mins</p>
          </div>
        </button>
      </div>

      {/* Footer / Status Bar - optional for landing but aligned with Frosted glass */}
      <footer className="h-12 px-6 md:px-10 flex flex-col md:flex-row items-center justify-center backdrop-blur-xl bg-white/5 border-t border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] relative z-10 w-full mt-auto">
        <div className="flex gap-4 md:gap-8 mx-auto">
          <span>&copy; {new Date().getFullYear()} MyGST Solution</span>
          <span className="hidden sm:inline text-slate-400">All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
