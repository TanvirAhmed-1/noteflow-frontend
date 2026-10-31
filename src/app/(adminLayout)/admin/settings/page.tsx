import type { Metadata } from "next";
import { Lock, ShieldCheck } from "lucide-react";
import AdminRoleGuard from "@/components/ui/admin/AdminRoleGuard";
import { ChangePasswordCard } from "@/components/shared";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Security & Password | NoteFlow Admin Console",
  description: "Update administrator account security and change password.",
};

export default function AdminSettingsPage() {
  return (
    <AdminRoleGuard>
      <div className="space-y-6">
        {/* Top Security Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="pointer-events-none absolute -top-16 right-0 h-40 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent blur-2xl" />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    Security & Password Center
                  </h1>
                  <Badge variant="indigo" className="font-mono">
                    Admin Protected
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your administrator credentials, verify session security,
                  and rotate your account password.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-2 text-xs font-bold text-emerald-700 sm:self-center">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>JWT Session Encrypted</span>
            </div>
          </div>
        </div>

        <ChangePasswordCard />
      </div>
    </AdminRoleGuard>
  );
}
