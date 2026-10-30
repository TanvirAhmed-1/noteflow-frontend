import type { Metadata } from "next";
import AdminContainer from "@/components/ui/admin/AdminContainer";

export const metadata: Metadata = {
  title: "Admin Console | NoteFlow",
  description:
    "Manage platform users, roles, and inspect all notes with administrator privileges.",
};

export default function AdminPage() {
  return <AdminContainer />;
}
