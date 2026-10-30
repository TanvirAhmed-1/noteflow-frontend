"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Edit3, UserPlus } from "lucide-react";
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
    formState: { errors },
  } = useForm<UserFormValues>({ defaultValues });

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        email: editingUser.email,
        password: "",
        role: editingUser.role,
      });
    } else {
      reset(defaultValues);
    }
  }, [editingUser, open, reset]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (editingUser) {
        const payload: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          role: values.role,
        };
        await updateUser({ userId: editingUser._id, data: payload }).unwrap();
        toast.success("User account updated successfully!");
      } else {
        await createAdminUser(values).unwrap();
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

          <Select
            label="Access Role"
            required
            options={[
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
            error={errors.role?.message}
            {...register("role", { required: "Access role is required" })}
          />

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

