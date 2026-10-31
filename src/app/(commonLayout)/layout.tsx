import Navbar from "@/components/shared/Navbar";
import { CardSkeleton } from "@/components/shared";
import React, { Suspense } from "react";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Suspense fallback={<CardSkeleton count={6} columns={3} />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

