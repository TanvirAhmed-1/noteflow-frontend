import type { Metadata } from "next";
import React, { Suspense } from "react";
import PostsSection from "@/components/ui/communityPosts/PostsSection";
import { CardSkeleton } from "@/components/shared";

export const metadata: Metadata = {
  title: "Community Posts | NoteFlow Workspace",
  description:
    "Publish and explore interest-based community posts with user name, interest, and date filtering.",
};

export default function CommunityPostsPage() {
  return (
    <Suspense fallback={<CardSkeleton count={6} columns={3} />}>
      <PostsSection />
    </Suspense>
  );
}
