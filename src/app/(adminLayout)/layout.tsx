import React, { Suspense } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { CardSkeleton } from "@/components/shared";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/90">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Suspense fallback={<CardSkeleton count={6} columns={3} />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
