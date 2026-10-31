"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FileText, Layers } from "lucide-react";
import { CardSkeleton } from "@/components/shared";

const InterestsManagementTable = dynamic(
  () => import("@/components/ui/admin/Interest/InterestsManagementTable"),
  {
    ssr: false,
    loading: () => <CardSkeleton count={5} columns={1} />,
  }
);

const InterestPostsTable = dynamic(
  () => import("@/components/ui/admin/Interest/InterestPostsTable"),
  {
    ssr: false,
    loading: () => <CardSkeleton count={5} columns={1} />,
  }
);

export default function AdminInterestsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "posts">("categories");

  return (
    <div className="space-y-6">
      {/* Top Segmented Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === "categories"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          <Layers className="h-4 w-4" />
          <span>Interest Topics Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === "posts"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          <FileText className="h-4 w-4" />
          <span>Posts Filtered by Interest</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "categories" ? (
        <InterestsManagementTable />
      ) : (
        <InterestPostsTable />
      )}
    </div>
  );
}
