import type { Metadata } from "next";
import HomeContainer from "@/components/ui/home/HomeContainer";

export const metadata: Metadata = {
  title: "Workspace | NoteFlow RBAC",
  description:
    "Manage your indexed personal notes, explore community posts with MongoDB $lookup aggregation, and view interest groups.",
};

export default function HomePage() {
  return <HomeContainer />;
}
