"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Input, DotMap, Spinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setTokenCookie } from "@/redux/server/storeCookies";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginUser(data).unwrap();
      if (res?.result?.token) {
        await setTokenCookie(res.result.token);
      }
      toast.success(res?.message || "Logged in successfully!");
      router.push("/");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Invalid email or password";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/70 to-indigo-100 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl border border-slate-100">
        {/* Left Panel - Animated Map */}
        <div className="hidden md:flex md:w-1/2 min-h-[560px] relative overflow-hidden border-r border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-100">
          <DotMap />

          <div className="relative z-10 flex flex-col items-center justify-center w-full p-8 text-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              NoteFlow Connect
            </h2>
            <p className="max-w-xs text-sm text-slate-600">
              Sign in to access your global note-taking workspace and connect
              with members worldwide
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to your account
            </p>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={() => console.log("Google sign-in")}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            <span>Login with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-x-0 border-t border-slate-200" />
            <span className="relative bg-white px-3 text-xs text-slate-400 uppercase">
              or
            </span>
          </div>

          {/* React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
              })}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-10 w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-blue-600 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                href="#"
                className="text-indigo-600 transition-colors hover:text-indigo-700"
              >
                Forgot password?
              </Link>
              <p className="text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
