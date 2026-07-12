import React from "react";

/**
 * A general base skeleton bar with configurable height, width, and rounded corners.
 */
export function SkeletonBase({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white/10 rounded-lg animate-pulse ${className}`} />
  );
}

/**
 * Skeleton loader for a grid list of blog posts.
 * Matches the layout in /src/components/Blog.tsx.
 */
export function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            {/* Featured Image placeholder */}
            <SkeletonBase className="h-48 w-full rounded-2xl mb-5" />

            {/* Category and Date row */}
            <div className="flex items-center gap-4 mb-4">
              <SkeletonBase className="h-4 w-20 rounded-full bg-blue-500/20" />
              <SkeletonBase className="h-4 w-24" />
            </div>
            
            {/* Blog Title lines */}
            <div className="space-y-3 mb-4">
              <SkeletonBase className="h-6 w-full" />
              <SkeletonBase className="h-6 w-3/4" />
            </div>

            {/* Excerpt lines */}
            <div className="space-y-2">
              <SkeletonBase className="h-4 w-full bg-white/5" />
              <SkeletonBase className="h-4 w-5/6 bg-white/5" />
            </div>
          </div>

          {/* Read article link placeholder */}
          <div className="mt-6">
            <SkeletonBase className="h-5 w-28 bg-white/15" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for a detailed blog post.
 * Matches the layout in /src/components/BlogPostDetail.tsx.
 */
export function BlogDetailSkeleton() {
  return (
    <div className="pt-32 pb-20 px-6 md:px-10 max-w-4xl mx-auto w-full">
      {/* Back button skeleton */}
      <SkeletonBase className="h-5 w-28 mb-8 bg-white/10" />

      {/* Meta header section */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <SkeletonBase className="h-6 w-24 rounded-full bg-blue-500/20" />
          <SkeletonBase className="h-4 w-32" />
          <SkeletonBase className="h-4 w-20" />
        </div>

        {/* Title pulses */}
        <div className="space-y-4 mb-6">
          <SkeletonBase className="h-10 md:h-14 w-full bg-white/10" />
          <SkeletonBase className="h-10 md:h-14 w-5/6 bg-white/10" />
        </div>

        {/* Author details */}
        <div className="flex items-center gap-3 mt-4">
          <SkeletonBase className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <SkeletonBase className="h-4 w-28" />
            <SkeletonBase className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Featured Banner Image Skeleton */}
      <SkeletonBase className="w-full h-[320px] md:h-[400px] rounded-3xl mb-12" />

      {/* Article Content blocks */}
      <div className="space-y-8 border-t border-white/5 pt-10">
        <div className="space-y-3">
          <SkeletonBase className="h-5 w-full bg-white/5" />
          <SkeletonBase className="h-5 w-11/12 bg-white/5" />
          <SkeletonBase className="h-5 w-5/6 bg-white/5" />
        </div>

        <div className="space-y-3">
          <SkeletonBase className="h-5 w-full bg-white/5" />
          <SkeletonBase className="h-5 w-full bg-white/5" />
          <SkeletonBase className="h-5 w-3/4 bg-white/5" />
        </div>

        {/* Simulated sub-header block */}
        <div className="space-y-4 py-4">
          <SkeletonBase className="h-7 w-1/2 bg-white/10" />
          <SkeletonBase className="h-5 w-full bg-white/5" />
          <SkeletonBase className="h-5 w-5/6 bg-white/5" />
        </div>

        <div className="space-y-3">
          <SkeletonBase className="h-5 w-full bg-white/5" />
          <SkeletonBase className="h-5 w-11/12 bg-white/5" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for current search rankings.
 * Matches the style of keywords list in Dashboard.tsx.
 */
export function KeywordsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
          <div className="space-y-1.5 flex-1">
            <SkeletonBase className="h-4 w-1/3 bg-white/15" />
            <SkeletonBase className="h-3 w-1/2 bg-white/10" />
          </div>
          <SkeletonBase className="h-6 w-12 bg-emerald-500/10 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for standard table ledger list of blogs inside Dashboard.tsx.
 */
export function BlogLedgerSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-white/5 pb-3">
            <th className="pb-3 font-bold">Article Details</th>
            <th className="pb-3 font-bold">Category</th>
            <th className="pb-3 font-bold">Status</th>
            <th className="pb-3 font-bold">Author</th>
            <th className="pb-3 font-bold">Date Published</th>
            <th className="pb-3 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-4 pr-3">
                <div className="space-y-2">
                  <SkeletonBase className="h-4 w-44 bg-white/15" />
                  <SkeletonBase className="h-3 w-28 bg-white/10" />
                </div>
              </td>
              <td className="py-4">
                <SkeletonBase className="h-5 w-16 bg-blue-500/10 rounded-full" />
              </td>
              <td className="py-4">
                <SkeletonBase className="h-5 w-16 bg-amber-500/10 rounded-full" />
              </td>
              <td className="py-4">
                <SkeletonBase className="h-4 w-20 bg-white/10" />
              </td>
              <td className="py-4">
                <SkeletonBase className="h-4 w-24 bg-white/10" />
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <SkeletonBase className="h-8 w-12 bg-white/10 rounded-lg" />
                  <SkeletonBase className="h-8 w-12 bg-white/10 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton loader for Lead Pipeline columns & cards inside LeadManagement.tsx.
 */
export function LeadPipelineSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <SkeletonBase className="h-8 w-48 bg-white/15" />
          <SkeletonBase className="h-4 w-64 bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Leads Column */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <SkeletonBase className="w-7 h-7 bg-amber-500/20 rounded-lg" />
              <SkeletonBase className="h-5 w-24 bg-white/15" />
            </div>
            <SkeletonBase className="h-5 w-8 bg-slate-800 rounded-full" />
          </div>
          <div className="space-y-4">
            <LeadCardSkeleton />
            <LeadCardSkeleton />
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <SkeletonBase className="w-7 h-7 bg-blue-500/20 rounded-lg" />
              <SkeletonBase className="h-5 w-24 bg-white/15" />
            </div>
            <SkeletonBase className="h-5 w-8 bg-slate-800 rounded-full" />
          </div>
          <div className="space-y-4">
            <LeadCardSkeleton />
          </div>
        </div>

        {/* Converted Column */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <SkeletonBase className="w-7 h-7 bg-green-500/20 rounded-lg" />
              <SkeletonBase className="h-5 w-24 bg-white/15" />
            </div>
            <SkeletonBase className="h-5 w-8 bg-slate-800 rounded-full" />
          </div>
          <div className="space-y-4">
            <LeadCardSkeleton />
            <LeadCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inner card skeleton representing an individual lead.
 */
function LeadCardSkeleton() {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm space-y-4">
      <div className="space-y-2">
        <SkeletonBase className="h-5 w-2/3 bg-white/15" />
        <SkeletonBase className="h-3 w-1/2 bg-white/10" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-3.5 w-3.5 rounded bg-white/10" />
          <SkeletonBase className="h-3.5 w-5/6 bg-white/10" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-3.5 w-3.5 rounded bg-white/10" />
          <SkeletonBase className="h-3.5 w-1/2 bg-white/10" />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-3">
        <SkeletonBase className="h-3 w-20 bg-white/10 mb-2" />
        <SkeletonBase className="h-8 w-full bg-slate-900 rounded-lg border border-slate-600" />
      </div>
    </div>
  );
}
