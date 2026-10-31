import type { Metadata } from "next";
import React, { Suspense } from "react";
import { CardSkeleton, ChangePasswordCard } from "@/components/shared";

export const metadata: Metadata = {
  title: "Change Password | NoteFlow Workspace",
  description:
    "Rotate your account password and review your live security checklist.",
};

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<CardSkeleton count={2} columns={2} />}>
      <ChangePasswordCard />
    </Suspense>
  );
}
