"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  FileStack,
  Globe,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
    badge: "Live",
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    exact: false,
  },
  {
    label: "All Users' Notes",
    href: "/admin/notes",
    icon: FileStack,
    exact: false,
  },
  {
    label: "Community Posts",
    href: "/admin/posts",
    icon: Globe,
    exact: false,
  },
  {
    label: "Interest Groups & Posts",
    href: "/admin/interests",
    icon: Layers,
    exact: false,
  },
  {
    label: "Security & Password",
    href: "/admin/settings",
    icon: KeyRound,
    exact: false,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { name, email, role } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await removeTokenCookie();
    dispatch(logout());
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-950 text-slate-300">
      {/* Top Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">
                Note<span className="text-indigo-400">Flow</span>
              </span>
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                Admin Console
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-5">
          <p className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Management & Analytics
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-indigo-400"
                      )}
                    />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-emerald-500/15 text-emerald-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-5 border-t border-slate-800/80" />

          <p className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Workspace Shortcut
          </p>
          <Link
            href="/"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-slate-900 hover:text-white"
          >
            <span>User Workspace</span>
            <ArrowUpRight className="h-4 w-4 text-indigo-400" />
          </Link>
        </div>
      </div>

      {/* Bottom Admin Profile & Logout */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900/90 p-3">
          <div
            suppressHydrationWarning
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-400 ring-1 ring-indigo-500/30"
          >
            {(mounted && name ? name : "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p
                suppressHydrationWarning
                className="truncate text-xs font-bold text-white"
              >
                {mounted && name ? name : "Administrator"}
              </p>
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            </div>
            <p
              suppressHydrationWarning
              className="truncate font-mono text-[10px] text-slate-400"
            >
              {mounted && email ? email : mounted && role ? role : "admin@noteflow.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-700 hover:bg-slate-50"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-extrabold text-slate-900">
            NoteFlow <span className="text-indigo-600">Admin</span>
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-indigo-600 hover:underline"
        >
          Workspace →
        </Link>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative z-10 w-64">{sidebarContent}</div>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}

