"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Globe,
  KeyRound,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { Button } from "@/components/ui/button";

const WORKSPACE_NAV_ITEMS = [
  {
    label: "My Notes",
    href: "/",
    icon: FileText,
    exact: true,
  },
  {
    label: "Community Posts",
    href: "/posts",
    icon: Globe,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { name, email, role, token } = useAppSelector((state) => state.auth);

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await removeTokenCookie();
    dispatch(logout());
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Note<span className="text-indigo-600">Flow</span>
          </span>
        </Link>

        {/* Center Desktop Navigation Pills (Segmented style) */}
        {token && (
          <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200/90 bg-slate-100/80 p-1.5 shadow-inner lg:flex">
            {WORKSPACE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Desktop Right Auth & User Profile Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {token ? (
            <>
              <Link
              href="/change-password"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                pathname === "/change-password"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Change Password</span>
            </Link>

            {role === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100/90 ${
                    pathname.startsWith("/admin") ? "ring-2 ring-amber-400" : ""
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Profile Pill */}
              <div className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-50/90 py-1 pr-3.5 pl-2 shadow-2xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-xs">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <p className="max-w-[130px] truncate text-xs font-bold text-slate-800">
                    {name || "User"}
                  </p>
                  <p className="max-w-[130px] truncate font-mono text-[10px] text-slate-500">
                    {email}
                  </p>
                </div>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-wider uppercase ${
                    role === "admin"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {role}
                </span>
              </div>

              {/* Change Password Link */}
              <Link
                href="/change-password"
                className={`flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 ${
                  pathname === "/change-password" ? "ring-2 ring-indigo-500" : ""
                }`}
                title="Change Password"
              >
                <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                <span>Password</span>
              </Link>

              {/* Logout Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8.5 cursor-pointer gap-1.5 rounded-xl border-slate-200 px-3 text-xs font-semibold text-rose-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8.5 cursor-pointer rounded-xl border-slate-200 text-xs font-semibold"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-8.5 cursor-pointer gap-1 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions: Profile Badge + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {token ? (
            <>
              <Link
              href="/change-password"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                pathname === "/change-password"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Change Password</span>
            </Link>

            {role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span>Admin</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg px-2.5 text-xs font-semibold"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-8 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {token && mobileMenuOpen && (
        <div className="border-t border-slate-200/90 bg-white px-4 py-4 shadow-xl duration-200 animate-in fade-in-0 slide-in-from-top-2 lg:hidden">
          {/* User Profile Card */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-xs">
              {(name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-bold text-slate-900">
                  {name || "User"}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                    role === "admin"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {role}
                </span>
              </div>
              <p className="truncate font-mono text-[11px] text-slate-500">
                {email}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {WORKSPACE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/change-password"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                pathname === "/change-password"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Change Password</span>
            </Link>

            {role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 px-3.5 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100/80"
              >
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Logout Button */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout from Workspace</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
