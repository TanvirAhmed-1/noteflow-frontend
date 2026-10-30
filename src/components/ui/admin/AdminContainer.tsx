"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileStack, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/components/ui/button";
import UsersManagement from "@/components/ui/admin/UsersManagement";
import AllNotesManagement from "@/components/ui/admin/AllNotesManagement";

type AdminTab = "users" | "notes";

export default function AdminContainer() {
  const { token, role } = useAppSelector((state) => state.auth);
  const [tab, setTab] = useState<AdminTab>("users");

  if (!token || role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-white px-6 py-20 text-center shadow-xs">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Admin Access Required
        </h1>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Only administrators have permission to manage platform users and
          inspect all users&apos; notes.
        </p>
        <Link href="/" className="mt-5">
          <Button className="h-9 cursor-pointer bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700">
            Back to Workspace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-md sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Platform Administration
          </h1>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Add, update, remove, and list users or inspect everyone&apos;s notes
            with full RBAC privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              tab === "users"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Users className="h-4 w-4" />
            Manage Users
          </button>

          <button
            type="button"
            onClick={() => setTab("notes")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              tab === "notes"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <FileStack className="h-4 w-4" />
            All Users&apos; Notes
          </button>
        </div>
      </div>

      {tab === "users" ? <UsersManagement /> : <AllNotesManagement />}
    </div>
  );
}
