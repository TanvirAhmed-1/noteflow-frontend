"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Spinner, WalkingIllustration } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/features/auth/authApi";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  interests: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      interests: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const interestsArray = data.interests
      ? data.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
        interests: interestsArray,
      };
      const res = await registerUser(payload).unwrap();
      toast.success(res?.message || "Account created successfully!");
      router.push("/login");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Registration failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/70 to-indigo-100 p-4 sm:p-6">
      <div className="flex w-full max-w-4xl min-h-[580px] overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
        {/* Left Panel - Illustration & Brand */}
        <div className="hidden md:flex md:w-[46%] flex-col justify-between border-r border-slate-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100/90 p-8 lg:p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Note<span className="text-indigo-600">Flow</span>
            </span>
          </Link>

          <div className="my-auto flex flex-col items-center justify-center py-4 text-center">
            <WalkingIllustration />
            <h2 className="mt-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Join NoteFlow Workspace
            </h2>
            <p className="mt-1 max-w-xs text-xs text-slate-600">
              Create your account to organize private notes and collaborate with
              the community.
            </p>
          </div>

          <p className="text-center font-mono text-[11px] text-slate-400">
            Secure JWT • RBAC • MongoDB
          </p>
        </div>

        {/* Right Panel - Register Form */}
        <div className="flex w-full md:w-[54%] flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:px-12">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Create an Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details below to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Input
                label="First Name"
                placeholder="First Name"
                required
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              <Input
                label="Last Name"
                placeholder="Last Name"
                required
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
            </div>

            <Input
              type="email"
              label="Email"
              placeholder="Enter your email address"
              required
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
              })}
            />

            <Input
              label="Interests (comma separated)"
              placeholder="e.g. chess, reading, coding"
              {...register("interests")}
            />

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Input
                type="password"
                label="Password"
                placeholder="Min 6 characters"
                required
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Min 6 characters required",
                  },
                })}
              />
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
                required
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-10 w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-blue-600 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-x-0 border-t border-slate-200" />
            <span className="relative bg-white px-3 text-xs text-slate-400 uppercase">
              or
            </span>
          </div>

          {/* Social Login Icons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => console.log("Google register")}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
