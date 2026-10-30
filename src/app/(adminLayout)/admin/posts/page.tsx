import type { Metadata } from "next";
import AdminRoleGuard from "@/components/ui/admin/AdminRoleGuard";
import PostsSection from "@/components/ui/home/PostsSection";

export const metadata: Metadata = {
  title: "User Posts ($lookup) | NoteFlow Admin Console",
  description:
    "Explore community posts and filter posts by author using MongoDB $lookup aggregation.",
};

export default function AdminPostsPage() {
  return (
    <AdminRoleGuard>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Community Posts & $lookup Aggregation
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Publish posts or click any author badge to execute Scenario 2{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
              $lookup
            </code>{" "}
            aggregation pipeline.
          </p>
        </div>
        <PostsSection />
      </div>
    </AdminRoleGuard>
  );
}

