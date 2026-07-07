import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, BarChart3, Calculator, MessageSquare, Globe, FileText } from "lucide-react";
import { motion } from "motion/react";
import MainLayout from "./MainLayout";
import TestimonialCarousel from "./TestimonialCarousel";
import SEO from "./SEO";

export default function Home() {
  return (
    <MainLayout>
      <SEO 
        title="MyGST Solution | Expert GST Consultancy & Advisory" 
        description="Expert GST compliance, advisory, return filing, and dispute resolution services for Indian businesses."
      />
      {/* Hero Section */}
      <header className="py-12 md:py-24 px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 mb-6">
            TRUSTED BY 500K+ BUSINESSES IN INDIA
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              MyGST Solution
            </span>
            <br /> Consultants
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From seamless GSTR filings to complex dispute resolutions. Expert GST advisory and compliance services for businesses across India.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-amber-500 text-slate-900 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-colors shadow-xl flex items-center justify-center gap-2"
            >
              Start Free Consultation <ArrowRight size={20} />
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-2xl font-bold text-lg text-white hover:bg-slate-800 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Services Grid */}
      <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Expert GST Consulting Services
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything your business needs to stay compliant in the modern regulatory landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "GST Returns & Refunds",
              icon: <Calculator className="w-6 h-6 text-blue-400" />,
              bgIcon: "bg-blue-500/20",
              desc: "Automated quarterly and monthly filings with 99.9% accuracy.",
            },
            {
              title: "Annual Audits",
              icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
              bgIcon: "bg-amber-500/20",
              desc: "Detailed GSTR-9/9C audits for large-scale compliance.",
            },
            {
              title: "Dispute Resolution",
              icon: <MessageSquare className="w-6 h-6 text-red-400" />,
              bgIcon: "bg-red-500/20",
              desc: "Expert handling of department notices and legal litigation.",
            },
            {
              title: "GST Registration",
              icon: <FileText className="w-6 h-6 text-purple-400" />,
              bgIcon: "bg-purple-500/20",
              desc: "End-to-end support for obtaining your new GSTIN.",
            },
            {
              title: "Custom Packages",
              icon: <BarChart3 className="w-6 h-6 text-green-400" />,
              bgIcon: "bg-green-500/20",
              desc: "Tiered subscriptions and Enterprise consulting services.",
            },
            {
              title: "Dedicated Advisory",
              icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
              bgIcon: "bg-blue-500/20",
              desc: "Direct access to our senior GST experts for your tax queries.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group"
            >
              <div className={`mb-6 w-12 h-12 ${item.bgIcon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <TestimonialCarousel />
      </section>
    </MainLayout>
  );
}
