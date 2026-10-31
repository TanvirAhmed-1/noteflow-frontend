"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input, Select, Spinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateAdminUserMutation,
  useUpdateUserMutation,
} from "@/redux/features/auth/authApi";
import { IUser, TUserRole } from "@/types/note";

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  isActive: "true" | "false";
}

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: IUser | null;
}

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "user",
  isActive: "true",
};

export default function UserFormModal({
  open,
  onOpenChange,
  editingUser,
}: UserFormModalProps) {
  const [createAdminUser, { isLoading: isCreating }] =
    useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({ defaultValues });

  const selectedRole = watch("role");
  const selectedStatus = watch("isActive");

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        email: editingUser.email,
        password: "",
        role: editingUser.role,
        isActive: editingUser.isActive === false ? "false" : "true",
      });
    } else {
      reset(defaultValues);
    }
  }, [editingUser, open, reset]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      const isActiveBool = values.isActive === "true";
      if (editingUser) {
        const payload: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: isActiveBool,
        };
        await updateUser({ userId: editingUser._id, data: payload }).unwrap();
        toast.success("User account updated successfully!");
      } else {
        await createAdminUser({
          ...values,
          isActive: isActiveBool,
        }).unwrap();
        toast.success("New user created successfully!");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Operation failed"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => !isSubmitting && onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Update User Account" : "Create New Platform User"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? `Modify account details or role permissions for ${editingUser.email}.`
              : "Provision a new user or administrator account with RBAC access."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            placeholder="e.g. Tanvir Ahmed"
            required
            error={errors.name?.message}
            {...register("name", { required: "Full name is required" })}
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="user@example.com"
            required
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />

          {!editingUser && (
            <Input
              type="password"
              label="Password"
              placeholder="Minimum 6 characters"
              required
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Access Role"
              required
              value={selectedRole}
              onValueChange={(val) =>
                setValue("role", val as TUserRole, { shouldValidate: true })
              }
              options={[
                { label: "User", value: "user", dotColor: "bg-blue-500" },
                { label: "Admin", value: "admin", dotColor: "bg-indigo-600" },
              ]}
              error={errors.role?.message}
            />

            <Select
              label="Account Status"
              required
              value={selectedStatus}
              onValueChange={(val) =>
                setValue("isActive", val as "true" | "false", {
                  shouldValidate: true,
                })
              }
              options={[
                { label: "Active", value: "true", dotColor: "bg-emerald-500" },
                { label: "Inactive", value: "false", dotColor: "bg-rose-500" },
              ]}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-9 cursor-pointer rounded-xl border-slate-200 px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
            >
              {isSubmitting && <Spinner className="h-3.5 w-3.5" />}
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

