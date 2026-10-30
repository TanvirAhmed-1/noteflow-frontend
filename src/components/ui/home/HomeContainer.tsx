"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Globe,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import NotesSection from "@/components/ui/home/NotesSection";
import PostsSection from "@/components/ui/home/PostsSection";
import InterestsSection from "@/components/ui/home/InterestsSection";
import { Button } from "@/components/ui/button";

type TabType = "notes" | "posts" | "interests";

export default function HomeContainer() {
  const { token, name, role } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>("notes");

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-20 text-center shadow-xs">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Welcome to NoteFlow Workspace
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Sign in to manage your private notes, publish community posts with{" "}
          <code className="font-mono text-indigo-600">$lookup</code>{" "}
          aggregations, and explore interest groups.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link href="/login">
            <Button className="h-10 cursor-pointer rounded-xl bg-indigo-600 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-700">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              className="h-10 cursor-pointer rounded-xl border-slate-200 px-6 text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white shadow-lg shadow-indigo-500/15 sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Role-Based Workspace ({role?.toUpperCase()})</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Hello, {name || "Member"}!
          </h1>
          <p className="mt-1 text-xs text-indigo-100 sm:text-sm">
            Manage indexed notes, community posts ($lookup), and interest
            aggregations seamlessly.
          </p>
        </div>

        {role === "admin" && (
          <Link href="/admin">
            <Button className="h-10 cursor-pointer gap-2 rounded-xl bg-amber-400 px-5 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-300">
              <ShieldCheck className="h-4 w-4" />
              Open Admin Console
            </Button>
          </Link>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "notes"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="h-4 w-4" />
          My Notes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "posts"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Globe className="h-4 w-4" />
          Community Posts ($lookup)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("interests")}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "interests"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="h-4 w-4" />
          Interests Aggregation & Profile
        </button>
      </div>

      {/* Active Section */}
      {activeTab === "notes" && <NotesSection />}
      {activeTab === "posts" && <PostsSection />}
      {activeTab === "interests" && <InterestsSection />}
    </div>
  );
}
