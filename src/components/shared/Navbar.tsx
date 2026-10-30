"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, email, role, token } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Note<span className="text-indigo-600">Flow</span>
            </span>
            <span className="ml-2 hidden rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 sm:inline-block">
              RBAC + MongoDB
            </span>
          </div>
        </Link>

        {/* Navigation Links & Auth Actions */}
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link
                href="/"
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pathname === "/"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Workspace
              </Link>

              {role === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-amber-500/15 text-amber-700"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              )}

              <div className="hidden h-5 w-px bg-slate-200 sm:block" />

              {/* User Badge */}
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 py-1 pl-2 pr-3 sm:flex">
                <UserCircle2 className="h-5 w-5 text-indigo-600" />
                <div className="text-left leading-tight">
                  <p className="text-xs font-bold text-slate-800">
                    {name || "User"}
                  </p>
                  <p className="font-mono text-[10px] text-slate-500">
                    {email}
                  </p>
                </div>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    role === "admin"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {role}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 cursor-pointer gap-1.5 border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer border-slate-200 text-xs font-semibold"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-8 cursor-pointer gap-1 bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

