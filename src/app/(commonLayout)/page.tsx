import type { Metadata } from "next";
import React, { Suspense } from "react";
import NotesSection from "@/components/ui/home/NotesSection";
import { CardSkeleton } from "@/components/shared";

export const metadata: Metadata = {
  title: "My Notes | NoteFlow Workspace",
  description:
    "Create, edit, and manage your indexed personal notes with full RBAC protection.",
};

export default function MyNotesPage() {
  return (
    <Suspense fallback={<CardSkeleton count={6} columns={3} />}>
      <NotesSection />
    </Suspense>
  );
}
