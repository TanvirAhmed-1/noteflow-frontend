import type { Metadata } from "next";
import UsersManagement from "@/components/ui/admin/UsersManagement";

export const metadata: Metadata = {
  title: "Manage Users | NoteFlow Admin Console",
  description:
    "Create, update, delete, and manage platform users with role-based access control.",
};

export default function AdminUsersPage() {
  return <UsersManagement />;
}

