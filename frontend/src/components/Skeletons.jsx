import React from 'react';

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 w-2/3 bg-slate-200 rounded-md"></div>
        <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full bg-slate-200 rounded-md"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
      </div>
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <div className="h-5 w-24 bg-slate-200 rounded-md"></div>
        <div className="h-5 w-20 bg-slate-200 rounded-md"></div>
      </div>
    </div>
  );
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 space-y-4">
          <div className="h-8 w-1/3 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-full bg-slate-200 rounded-md"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
          <div className="h-48 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 space-y-4">
          <div className="h-6 w-1/2 bg-slate-200 rounded-md"></div>
          <div className="h-24 bg-slate-100 rounded-xl"></div>
          <div className="h-24 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
