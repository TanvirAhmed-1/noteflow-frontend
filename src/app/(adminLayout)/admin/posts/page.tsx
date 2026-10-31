import type { Metadata } from "next";
import AdminRoleGuard from "@/components/ui/admin/AdminRoleGuard";
import PostsSection from "@/components/ui/communityPosts/PostsSection";

export const metadata: Metadata = {
  title: "Community Posts | NoteFlow Admin Console",
  description:
    "Explore and manage interest-based community posts with user name, interest, and date filtering.",
};

export default function AdminPostsPage() {
  return (
    <AdminRoleGuard>
      <PostsSection />
    </AdminRoleGuard>
  );
}
