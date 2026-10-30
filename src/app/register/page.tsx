import type { Metadata } from "next";
import RegisterForm from "@/components/ui/registerForm";

export const metadata: Metadata = {
  title: "Create Account | NoteFlow",
  description:
    "Create your NoteFlow account to organize private notes and share community posts.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
