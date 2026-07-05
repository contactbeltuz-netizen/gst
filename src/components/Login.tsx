import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { Lock, User, AlertCircle, ArrowRight, Briefcase } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        
        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/client-portal");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEO title="Login | MyGST Solution" description="Login to your MyGST Solution portal." />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        
        <div className="w-full max-w-md">
           <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">Welcome Back</h1>
              <p className="text-slate-400">Sign in to your MyGST Solution portal.</p>
           </div>
           
           <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
             
             {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                   <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                   <p className="text-sm text-red-200">{error}</p>
                </div>
             )}

             <form onSubmit={handleLogin} className="space-y-5">
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <input 
                         type="email" 
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                         placeholder="you@example.com"
                      />
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                     <label className="block text-sm font-medium text-slate-300">Password</label>
                     <Link to="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
                   </div>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Lock className="w-5 h-5 text-slate-500" />
                      </div>
                      <input 
                         type="password" 
                         required
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                         placeholder="••••••••"
                      />
                   </div>
                </div>

                <button 
                   type="submit"
                   disabled={loading}
                   className="w-full py-3.5 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                   {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
             </form>
           </div>
           
           <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-5 text-sm">
             <div className="flex items-center gap-2 text-slate-300 mb-3 font-semibold">
               <Briefcase className="w-4 h-4 text-blue-400" />
               Demo Credentials
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-slate-500 mb-1">Admin (Business Owner)</p>
                 <p className="font-mono text-blue-300">admin@mygstsolution.com</p>
                 <p className="font-mono text-slate-400">admin123</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 mb-1">Client (Demo User)</p>
                 <p className="font-mono text-emerald-300">client@demo.com</p>
                 <p className="font-mono text-slate-400">client123</p>
               </div>
             </div>
           </div>
        </div>

      </div>
    </MainLayout>
  );
}
