import React, { useEffect, useState } from "react";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogListSkeleton } from "./Skeleton";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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

        {loading ? (
          <BlogListSkeleton />
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-white/10/5 rounded-3xl">
            <p className="text-slate-400">No blog posts available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {posts.map(post => {
              const targetUrl = post.id === "1"
                ? "/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection"
                : `/blog/${post.id}`;
              
              const imageSrc = post.imageUrl || `https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80`;

              return (
                <article key={post.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col backdrop-blur-md overflow-hidden">
                  {/* Card Image */}
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 relative bg-slate-800">
                    <img
                      src={imageSrc}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600/90 text-white backdrop-blur-sm text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">{post.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="text-slate-600">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <Link to={targetUrl} className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors block line-clamp-2">
                    {post.title}
                  </Link>
                  
                  <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link to={targetUrl} className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-amber-400 transition-colors mt-auto w-fit">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
