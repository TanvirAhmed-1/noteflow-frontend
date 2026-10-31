import type { Metadata } from "next";
import InterestPostsTable from "@/components/ui/admin/InterestPostsTable";

export const metadata: Metadata = {
  title: "Interest Groups & User Posts Table | NoteFlow Admin Console",
  description:
    "Table view of user Public (Community) and Private (Personal) posts with Interest, Name, and Visibility filtering and pagination.",
};

export default function AdminInterestsTablePage() {
  return <InterestPostsTable />;
}

