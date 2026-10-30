import type { Metadata } from "next";
import LoginForm from "@/components/ui/loginForm";

export const metadata: Metadata = {
  title: "Sign In | NoteFlow",
  description:
    "Sign in to your NoteFlow account to manage your private notes and community posts.",
};

export default function LoginPage() {
  return <LoginForm />;
}
