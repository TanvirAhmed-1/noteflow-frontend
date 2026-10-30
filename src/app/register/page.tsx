"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import toast from "react-hot-toast";
import { Input, WalkingIllustration } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/features/auth/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    interests: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const interestsArray = formData.interests
      ? formData.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white p-4 sm:p-6 md:p-10">
      {/* Split background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[#fbf7f2]" />

      {/* Main Card */}
      <div className="relative z-10 flex w-full max-w-[920px] min-h-[560px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100">
        {/* Left Panel - Illustration */}
        <div className="hidden md:flex md:w-[48%] flex-col justify-between bg-[#fbf7f2] p-8 lg:p-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7a00] text-white shadow-md shadow-orange-500/25">
            <Zap className="h-4 w-4 fill-white" />
          </div>

          <div className="my-auto flex items-center justify-center pt-4">
            <WalkingIllustration />
          </div>

          <div />
        </div>

        {/* Right Panel - Register Form */}
        <div className="flex w-full md:w-[52%] flex-col justify-center bg-white px-6 py-10 sm:px-12 lg:px-14">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Register
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Create an Account to access all the features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Input
                name="firstName"
                label="First Name"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              name="interests"
              label="Interests (comma separated)"
              placeholder="e.g. chess, reading, coding"
              value={formData.interests}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={error}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-10 w-full cursor-pointer rounded-lg bg-[#ff7a00] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 hover:bg-[#e86f00]"
            >
              {isLoading ? "REGISTERING..." : "REGISTER"}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute w-3/4 border-t border-gray-200" />
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              OR
            </span>
          </div>

          {/* Social Login Icons */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => console.log("Facebook register")}
              aria-label="Register with Facebook"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-50 transition-transform hover:scale-105 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => console.log("Google register")}
              aria-label="Register with Google"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-50 transition-transform hover:scale-105 hover:bg-gray-100"
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
            </button>
          </div>

          <p className="mt-7 text-center text-xs text-gray-400">
            Already have an Account?{" "}
            <Link
              href="/login"
              className="font-bold uppercase text-[#ff7a00] hover:underline"
            >
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
