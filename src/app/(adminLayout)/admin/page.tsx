import type { Metadata } from "next";
import AdminOverview from "@/components/ui/admin/AdminOverview";

export const metadata: Metadata = {
  title: "Overview Dashboard | NoteFlow Admin Console",
  description:
    "Monitor platform users, recent user posts with MongoDB $lookup, indexed notes, and interest aggregations.",
};

export default function AdminPage() {
  return <AdminOverview />;
}
