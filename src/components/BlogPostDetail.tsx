import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "./MainLayout";
import SEO from "./SEO";
import { ArrowLeft, Calendar, User, Clock, ShieldCheck, Tag } from "lucide-react";
import Markdown from "react-markdown";
import { BlogDetailSkeleton } from "./Skeleton";

interface Blog {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readTime: string;
  author: string;
  content: string;
  status?: "Published" | "Draft";
  imageUrl?: string;
}

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) {
          throw new Error("Blog post not found");
        }
        const data = await res.json();
        setBlog(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <BlogDetailSkeleton />
      </MainLayout>
    );
  }

  if (error || !blog) {
    return (
      <MainLayout>
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
          <p className="text-slate-400 mb-8">The compliance advisory article you are looking for does not exist or has been archived.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO 
        title={`${blog.title} | MyGST Solution`} 
        description={blog.excerpt} 
        keywords={[blog.category, "GST compliance", "tax advisory", "legal updates", "MyGST Solution"]}
      />
      
      <article className="pt-24 pb-20 px-6 md:px-10 max-w-4xl mx-auto w-full">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {blog.status === "Draft" && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <span className="shrink-0 inline-block bg-amber-500 text-slate-900 font-extrabold rounded px-2 py-0.5 text-[9px] uppercase tracking-wider">
              Draft Status
            </span>
            <span>This compliance advisory is currently a draft and is under review. It is not displayed on the public insights page.</span>
          </div>
        )}
        
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-400">
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {blog.category}
            </span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {blog.date}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {blog.author}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {blog.readTime}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Featured Banner Image */}
        <div className="w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden mb-12 relative bg-slate-800 border border-white/10 shadow-2xl">
          <img
            src={blog.imageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed space-y-6 markdown-body">
          <Markdown>{blog.content}</Markdown>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-slate-400 italic text-sm">
          Disclaimer: This article is for informational purposes only and does not constitute formal legal or tax advisory. Always consult a certified GST Practitioner for guidelines specific to your jurisdiction.
        </div>
      </article>
    </MainLayout>
  );
}
