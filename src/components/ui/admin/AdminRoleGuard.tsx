"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/components/ui/button";

export default function AdminRoleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, role } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else if (role !== "admin") {
      router.replace("/");
    }
  }, [token, role, router]);

  if (!token) {
    return null;
  }

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-white px-6 py-20 text-center shadow-xs">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Admin Access Required
        </h1>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Only administrators have permission to access this console.
        </p>
        <Link href="/" className="mt-5">
          <Button className="h-9 cursor-pointer bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700">
            Back to Workspace
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
