import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Star, ArrowRight, ShieldCheck, Award, ThumbsUp, Sparkles } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  category: "ITC Recovery" | "Legal Notice" | "GSTR Filing" | "Multi-State" | "Advisory";
  metric: string;
  rating: number;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "MyGST Solution completely transformed our tax compliance processes. They successfully recovered over ₹20 Lakhs in blocked Input Tax Credit (ITC) within just three months.",
    name: "Rajesh Kumar",
    role: "CFO, TechFlow India",
    avatar: "RK",
    category: "ITC Recovery",
    metric: "₹20L+ Recovered",
    rating: 5,
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    quote: "Their expert legal desk resolved a highly complex multi-crore GST show-cause notice efficiently. Their timely representations saved us from massive potential penalties.",
    name: "Priya Sharma",
    role: "Director, BuildCorp SMEs",
    avatar: "PS",
    category: "Legal Notice",
    metric: "Zero Penalties",
    rating: 5,
    color: "from-amber-500 to-orange-400"
  },
  {
    id: 3,
    quote: "Their GST advisory team seamlessly integrated with our financial workflows. Filing monthly GSTR-1 and GSTR-3B is now completely stress-free and automated.",
    name: "Amit Patel",
    role: "Founder, RetailNet Logistics",
    avatar: "AP",
    category: "GSTR Filing",
    metric: "100% Timely Filing",
    rating: 5,
    color: "from-emerald-500 to-teal-400"
  },
  {
    id: 4,
    quote: "Handling multi-state GST compliance was an absolute nightmare until we partnered with MyGST. They unified our registrations across six states seamlessly.",
    name: "Sanjay Mehta",
    role: "Managing Partner, Zenith Logistics",
    avatar: "SM",
    category: "Multi-State",
    metric: "6 States Unified",
    rating: 5,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 5,
    quote: "Their real-time reconciliation engine matched our purchase register with GSTR-2B automatically. Every mismatch was flagged instantly, securing our credits.",
    name: "Ananya Sen",
    role: "Head of Tax, Innovate Fintech",
    avatar: "AS",
    category: "ITC Recovery",
    metric: "99.9% Reconciliation",
    rating: 5,
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: 6,
    quote: "Their compliance support and deep understanding of manufacturing-specific GST rules have been invaluable. Highly recommend their enterprise advisory desk.",
    name: "Vikram Malhotra",
    role: "Operations Director, Apex Mfg",
    avatar: "VM",
    category: "Advisory",
    metric: "Expert Advice 24/7",
    rating: 5,
    color: "from-rose-500 to-red-400"
  }
];

const categories = ["All", "ITC Recovery", "Legal Notice", "GSTR Filing", "Multi-State", "Advisory"];

export default function TestimonialCarousel() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTestimonials = selectedCategory === "All"
    ? testimonials
    : testimonials.filter((t) => t.category === selectedCategory);

  return (
    <div id="testimonials" className="relative w-full max-w-7xl mx-auto py-16 px-6 overflow-hidden">
      {/* Decorative background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Header and stats */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4" />
            Client Success Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400">500+ Indian Businesses</span>
          </h2>
          <p className="text-slate-300 text-lg mt-3 leading-relaxed">
            See how our enterprise-grade compliance desk and experienced tax consultants deliver proven results for SMEs and corporate leaders.
          </p>
        </div>

        {/* Dynamic mini trust indicators */}
        <div className="flex flex-wrap gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl md:max-w-xs">
          <div className="flex-1 min-w-[100px]">
            <p className="text-2xl font-black text-amber-400">4.9/5</p>
            <p className="text-xs text-slate-400 font-medium">Google Rating</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex-1 min-w-[100px]">
            <p className="text-2xl font-black text-emerald-400">₹1.5Cr+</p>
            <p className="text-xs text-slate-400 font-medium">ITC Saved / Year</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === category
                ? "bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Testimonials Grid with AnimatePresence */}
      <motion.div 
        layout
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              layout
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/5 duration-300 cursor-default"
            >
              {/* Highlight background glow on card hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl duration-500 pointer-events-none"></div>

              <div>
                {/* Header: Stars & Metric Badge */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/5 text-slate-300 border border-white/5`}>
                    {testimonial.metric}
                  </span>
                </div>

                {/* Quote Text */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-white/[0.03] pointer-events-none" />
                  <p className="text-slate-200 text-sm md:text-[15px] leading-relaxed font-medium italic relative z-10">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${testimonial.color} rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-sm group-hover:text-amber-300 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                {/* Micro category pill */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                  {testimonial.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* CTA Section bottom of Testimonials */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative z-10 mt-12 p-6 rounded-3xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-transparent border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">Are you facing a complex GST issue?</h4>
            <p className="text-slate-300 text-sm">Schedule a direct consult with our GST advisory experts within minutes.</p>
          </div>
        </div>
        <Link 
          to="/contact" 
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-full uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-amber-400/10 shrink-0"
        >
          Book Free Consult
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
