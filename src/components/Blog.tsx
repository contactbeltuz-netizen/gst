import React from "react";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "When does a GST proceeding begin? Clearing the fog around Section 83 and MSME Protection",
      category: "Legal Insights",
      date: "Oct 24, 2024",
      excerpt: "Understanding the exact trigger point of Section 83 proceedings and how MSMEs can protect their working capital without getting accounts frozen unnecessarily.",
      slug: "/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection"
    },
    {
      id: 2,
      title: "West Bengal Professional Tax & GST Integration Guide",
      category: "Compliance",
      date: "Nov 02, 2024",
      excerpt: "A complete step-by-step framework for businesses operating in Kolkata and West Bengal to maintain dual compliance smoothly without penalties.",
      slug: "#"
    },
    {
      id: 3,
      title: "How to handle GSTR-9 audits for E-commerce Sellers",
      category: "Tax Audit",
      date: "Nov 15, 2024",
      excerpt: "An actionable checkout plan to avoid discrepancies in GSTR-9 for e-commerce operators who sell pan-India through Amazon and Flipkart.",
      slug: "#"
    }
  ];

  return (
    <MainLayout>
      <SEO 
        title="Blog - Latest GST Updates & Compliance Strategies | MyGST Solution" 
        description="Stay updated with the latest GST rules, compliance strategies, and legal insights from our expert consultants to keep your business penalty-free." 
      />
      
      <div className="pt-12 md:pt-24 pb-12 md:pb-20 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="mb-6 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
             Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Insights</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Actionable strategies, recent case laws, and step-by-step guides for navigating the evolving GST landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {posts.map(post => (
            <article key={post.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all flex flex-col backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6 text-xs text-slate-400 font-medium">
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">{post.category}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
              </div>
              
              <Link to={post.slug} className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-blue-400 transition-colors block">
                {post.title}
              </Link>
              
              <p className="text-slate-400 text-sm mb-8 flex-1">
                {post.excerpt}
              </p>
              
              <Link to={post.slug} className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-amber-500 transition-colors mt-auto w-fit">
                Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
