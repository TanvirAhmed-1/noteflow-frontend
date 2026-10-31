"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Circle,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input, RoleBadge } from "@/components/shared";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { useAppSelector } from "@/redux/hook";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordCard() {
  const user = useAppSelector((state) => state.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword") || "";
  const confirmPassword = watch("confirmPassword") || "";

  const checks = [
    {
      label: "Minimum 6 characters length",
      passed: newPassword.length >= 6,
    },
    {
      label: "Contains uppercase & lowercase letters",
      passed: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    },
    {
      label: "Contains at least one number or symbol",
      passed: /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    },
    {
      label: "Confirmation password matches",
      passed:
        newPassword.length >= 6 &&
        confirmPassword.length > 0 &&
        newPassword === confirmPassword,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const strengthLabels = ["Unset", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-slate-200",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success(res?.message || "Password updated successfully!");
      reset();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to change password";
      toast.error(msg);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Admin Identity & Live Password Checklist */}
      <div className="space-y-6 lg:col-span-5">
        {/* Active Administrator Card */}
        <Card className="relative overflow-hidden border-slate-200/80 p-6">
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-base font-extrabold text-white shadow-md shadow-indigo-500/25">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {user?.name || "Administrator"}
                  </h3>
                  <RoleBadge role={user?.role || "admin"} />
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {user?.email || "admin@noteflow.io"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4">
            <div className="rounded-xl bg-slate-50/90 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                Account Status
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Verified Active
              </p>
            </div>

            <div className="rounded-xl bg-slate-50/90 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Fingerprint className="h-3.5 w-3.5 text-indigo-500" />
                Hash Standard
              </div>
              <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                bcrypt (10-Round)
              </p>
            </div>
          </div>
        </Card>

        {/* Live Password Strength & Security Requirements */}
        <Card className="border-slate-200/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold tracking-wide text-slate-900 uppercase">
                  Password Security Checklist
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time validation as you type
                </p>
              </div>
            </div>
            <Badge
              variant={passedCount >= 3 ? "emerald" : "secondary"}
              className="font-mono text-[10px]"
            >
              {strengthLabels[passedCount]}
            </Badge>
          </div>

          {/* 4-segment strength bar */}
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  passedCount >= step
                    ? strengthColors[passedCount]
                    : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2.5">
            {checks.map((item) => (
              <li
                key={item.label}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                  item.passed
                    ? "border-emerald-200/80 bg-emerald-50/50 text-emerald-800"
                    : "border-slate-100 bg-slate-50/60 text-slate-500"
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                )}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Right Column: Change Password Form */}
      <Card className="border-slate-200/80 p-0 lg:col-span-7">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Update Administrator Password
              </h2>
              <p className="text-xs text-slate-500">
                Enter your current password to authorize credentials rotation
              </p>
            </div>
          </div>

          <span className="hidden items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600 sm:inline-flex">
            <Lock className="h-3 w-3" />
            PUT /api/change-password
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter your existing password"
            required
            error={errors.currentPassword?.message}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              type="password"
              label="New Password"
              placeholder="Minimum 6 characters"
              required
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              required
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (val) =>
                  val === newPassword || "Passwords do not match",
              })}
            />
          </div>

          <div className="rounded-xl border border-indigo-100/80 bg-indigo-50/40 p-3.5 text-xs text-slate-600">
            <p className="flex items-center gap-2 font-semibold text-indigo-950">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Security Tip
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Updating your password immediately hashes the new secret in
              MongoDB while keeping your current session active.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => reset()}
              className="h-10 cursor-pointer gap-1.5 rounded-xl border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Form
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading && <Spinner className="h-3.5 w-3.5" />}
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ChangePasswordCard;
