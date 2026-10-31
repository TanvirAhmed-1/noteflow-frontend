"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  FileStack,
  Globe,
  Hash,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import { RoleBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllUsersQuery,
  useGetUsersGroupedByInterestsQuery,
} from "@/redux/features/auth/authApi";
import { useGetAllNotesByAdminQuery } from "@/redux/features/note/noteApi";
import { useGetPostsQuery } from "@/redux/features/post/postApi";
import { IInterestGroup, IUser } from "@/types/note";
import AdminRoleGuard from "./AdminRoleGuard";
import OverviewPostsFeed from "./OverviewPostsFeed";

export default function AdminOverview() {
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery({
    page: 1,
    limit: 5,
  });
  const { data: notesData } = useGetAllNotesByAdminQuery({ page: 1, limit: 5 });
  const { data: postsData } = useGetPostsQuery({ page: 1, limit: 6 });
  const { data: interestsData } = useGetUsersGroupedByInterestsQuery({
    page: 1,
    limit: 6,
  });

  const totalUsers = usersData?.meta?.total ?? 0;
  const totalNotes = notesData?.meta?.total ?? 0;
  const totalPosts = postsData?.meta?.total ?? 0;
  const totalInterests = interestsData?.meta?.total ?? 0;

  const recentUsers: IUser[] = usersData?.result || [];
  const interestGroups: IInterestGroup[] = interestsData?.result || [];

  const kpis = [
    {
      label: "Total Platform Users",
      value: totalUsers,
      sub: "Indexed by { createdAt: -1 }",
      icon: Users,
      href: "/admin/users",
      tone: "from-blue-500 to-indigo-600",
      bg: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "All Users' Notes",
      value: totalNotes,
      icon: FileStack,
      href: "/admin/notes",
      tone: "from-violet-500 to-purple-600",
      bg: "bg-violet-50 text-violet-600",
    },
    {
      label: "Community Posts",
      value: totalPosts,
      icon: Globe,
      href: "/admin/posts",
      tone: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Interest Groups",
      value: totalInterests,
      icon: Layers,
      href: "/admin/settings",
      tone: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <AdminRoleGuard>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Top Enterprise Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:p-7 md:p-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 font-mono text-[11px] font-semibold text-indigo-300 ring-1 ring-indigo-400/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>PRODUCTION RBAC TELEMETRY</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
              System Overview & Activity
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Monitor total users, who is publishing community posts ($lookup),
              and MongoDB index performance.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Link href="/admin/users" className="w-full sm:w-auto">
              <Button className="h-10 w-full sm:w-auto cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-500">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/notes" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="h-10 w-full sm:w-auto cursor-pointer gap-1.5 rounded-xl border-slate-700 bg-slate-800/70 px-4 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <FileStack className="h-4 w-4" />
                Inspect Notes
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link key={kpi.label} href={kpi.href}>
                <Card className="group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${kpi.tone}`}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        {kpi.label}
                      </p>
                      <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                        {kpi.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <OverviewPostsFeed />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6">
              <CardHeader className="mb-4 flex-row items-center justify-between border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Newest Users</CardTitle>
                <Link
                  href="/admin/users"
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Manage All ({totalUsers}) →
                </Link>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {loadingUsers ? (
                  <p className="text-xs text-slate-400">Loading users...</p>
                ) : (
                  recentUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {u.name}
                          </p>
                          <p className="truncate font-mono text-[10px] text-slate-400">
                            {u.email}
                          </p>
                        </div>
                      </div>
                      <RoleBadge role={u.role} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="mb-4 flex-row items-center justify-between border-b border-slate-100 pb-3">
                <CardTitle className="text-base">
                  Interest Groups
                </CardTitle>

              </CardHeader>
              <CardContent className="space-y-2.5">
                {interestGroups.map((g) => (
                  <div
                    key={g.interest}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2 text-xs"
                  >
                    <span className="inline-flex items-center gap-1.5 font-bold capitalize text-slate-800">
                      <Hash className="h-3.5 w-3.5 text-indigo-600" />
                      {g.interest}
                    </span>
                    <Badge variant="amber" className="font-mono">
                      {g.totalUsers} {g.totalUsers === 1 ? "User" : "Users"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoleGuard>
  );
}
