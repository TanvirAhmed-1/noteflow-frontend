import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, Home, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found | NoteFlow",
  description: "The requested page could not be found in NoteFlow Workspace.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-white">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

      {/* Subtle Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.35) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Brand Pill */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-white">
            Note<span className="text-indigo-400">Flow</span>
          </span>
          <span className="h-3.5 w-px bg-slate-700" />
          <span className="font-mono text-[11px] font-semibold text-amber-400">
            ERROR 404
          </span>
        </div>

        {/* 404 Hero Badge */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-blue-600/10 shadow-2xl shadow-indigo-500/20">
          <Compass className="h-12 w-12 text-indigo-400" />
        </div>

        <h1 className="bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text font-mono text-7xl font-black tracking-tighter text-transparent sm:text-8xl">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          The page or resource you are looking for doesn&apos;t exist, has been
          removed, or its URL has changed.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-xs font-bold tracking-wider uppercase text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-500 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to Workspace
          </Link>

          <Link
            href="/admin"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-5 text-xs font-bold tracking-wider uppercase text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white sm:w-auto"
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Admin Console
          </Link>
        </div>

        {/* Quick Route Links */}
        <div className="mt-10 border-t border-slate-800/80 pt-6">
          <p className="mb-3 font-mono text-[11px] font-semibold tracking-widest uppercase text-slate-500">
            Quick Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "My Notes", href: "/" },
              { label: "Community Posts", href: "/posts" },
              { label: "Change Password", href: "/change-password" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800/90 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:border-slate-700 hover:text-indigo-300"
              >
                <ArrowLeft className="h-3 w-3 rotate-180 text-indigo-400" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

