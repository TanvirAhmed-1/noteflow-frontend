import type { Metadata } from "next";
import AllNotesManagement from "@/components/ui/admin/AllNotesManagement";

export const metadata: Metadata = {
  title: "All Users' Notes | NoteFlow Admin Console",
  description:
    "Inspect, edit, and delete notes across all platform users with full RBAC privileges.",
};

export default function AdminNotesPage() {
  return <AllNotesManagement />;
}

