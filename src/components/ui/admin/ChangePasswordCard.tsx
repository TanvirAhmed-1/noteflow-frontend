"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { KeyRound, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../shared/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordCard() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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
    <Card className="max-w-xl">
      <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">Change Account Password</CardTitle>
          <CardDescription>
            Secured with bcrypt salt hashing & JWT verification
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            required
            error={errors.currentPassword?.message}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  val === getValues("newPassword") || "Passwords do not match",
              })}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Encrypted with bcrypt
            </span>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 cursor-pointer gap-2 rounded-xl bg-indigo-600 px-6 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
            >
              {isLoading && <Spinner className="h-3.5 w-3.5" />}
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChangePasswordCard;

