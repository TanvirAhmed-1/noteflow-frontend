"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Spinner, WalkingIllustration } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/redux/features/auth/authApi";
import { setTokenCookie } from "@/redux/server/storeCookies";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginMutation();
  const isLoading = isRegistering || isLoggingIn;

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
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
      };
      const res = await registerUser(payload).unwrap();
      let token = res?.result?.token;

      if (!token) {
        const loginRes = await loginUser({
          email: data.email,
          password: data.password,
        }).unwrap();
        token = loginRes?.result?.token;
      }

      if (token) {
        await setTokenCookie(token);
      }

      toast.success("Account created and logged in successfully!");
      router.push("/");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Registration failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="flex w-full max-w-4xl min-h-[600px] overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* Left Panel - Illustration & Brand */}
        <div className="hidden md:flex md:w-[46%] flex-col justify-between border-r border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Travel <span className="text-blue-600">Connect</span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="my-auto flex flex-col items-center justify-center py-4 text-center"
          >
            <WalkingIllustration />
            <h2 className="mt-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Join Our Global Workspace
            </h2>
            <p className="mt-1 max-w-xs text-xs text-gray-600">
              Create your account to organize private notes and collaborate with
              members worldwide.
            </p>
          </motion.div>

          <p className="text-center font-mono text-[11px] text-gray-400">
            Secure JWT • RBAC • MongoDB
          </p>
        </div>

        {/* Right Panel - Register Form */}
        <div className="flex w-full md:w-[54%] flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Create an Account
              </h1>
              <p className="mt-1 text-sm text-gray-500">
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

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-10 bg-gradient-to-r relative overflow-hidden from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg transition-all duration-300 cursor-pointer",
                    isHovered ? "shadow-lg shadow-blue-200" : ""
                  )}
                >
                  <span className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Register
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </span>
                  {isHovered && !isLoading && (
                    <motion.span
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ filter: "blur(8px)" }}
                    />
                  )}
                </Button>
              </motion.div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-indigo-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
