import type { Metadata } from "next";
import AdminRoleGuard from "@/components/ui/admin/AdminRoleGuard";
import { ChangePasswordCard } from "@/components/shared";

export const metadata: Metadata = {
  title: "Security & Password | NoteFlow Admin Console",
  description: "Update administrator account security and change password.",
};

export default function AdminSettingsPage() {
  return (
    <AdminRoleGuard>
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Security & Password Settings
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage your account security and update your administrator password.
          </p>
        </div>

        <ChangePasswordCard />
      </div>
    </AdminRoleGuard>
  );
}

