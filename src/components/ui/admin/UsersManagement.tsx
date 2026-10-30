"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Trash2, UserPlus, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  EmptyState,
  Input,
  Pagination,
  RoleBadge,
  SectionHeader,
  Spinner,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateAdminUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/auth/authApi";
import { IUser, TUserRole } from "@/types/note";

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  interests: string;
}

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "user",
  interests: "",
};

export default function UsersManagement() {
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues,
  });

  const { data, isLoading } = useGetAllUsersQuery({ page, limit: 8 });
  const [createAdminUser, { isLoading: isCreating }] =
    useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users: IUser[] = data?.result || [];
  const meta = data?.meta;

  const resetForm = () => {
    setEditingUser(null);
    reset(defaultValues);
  };

  const startEdit = (user: IUser) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      interests: (user.interests || []).join(", "),
    });
  };

  const onSubmit = async (values: UserFormValues) => {
    const interests = values.interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingUser) {
        const payload: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          role: values.role,
          interests,
        };
        if (values.password?.trim()) payload.password = values.password;
        await updateUser({ userId: editingUser._id, data: payload }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await createAdminUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          interests,
        }).unwrap();
        toast.success("New user added by Admin!");
      }
      resetForm();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Operation failed"
      );
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User removed successfully");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Card className="sticky top-24">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                {editingUser ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </div>
              <CardTitle>
                {editingUser ? "Edit User Account" : "Add New User"}
              </CardTitle>
            </div>
            {editingUser && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Input
                type="password"
                label={
                  editingUser ? "New Password (optional)" : "Initial Password"
                }
                placeholder="Min 6 characters"
                required={!editingUser}
                error={errors.password?.message}
                {...register("password", {
                  required: editingUser ? false : "Password is required",
                  minLength: {
                    value: 6,
                    message: "Min 6 characters required",
                  },
                })}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  {...register("role")}
                  className="h-10 rounded-md border border-gray-200 bg-gray-50/60 px-3 text-sm text-gray-800 outline-none focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Input
                label="Interests (comma separated)"
                placeholder="chess, reading, coding"
                {...register("interests")}
              />
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-700"
              >
                {(isCreating || isUpdating) && <Spinner className="mr-1.5" />}
                {editingUser
                  ? isUpdating
                    ? "Updating..."
                    : "Update User"
                  : isCreating
                    ? "Creating..."
                    : "Create User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <SectionHeader
          title="All Platform Users"
          description="Admin directory sorted by newest registration"
          countLabel={meta ? `${meta.total} Total Users` : undefined}
        />

        {isLoading ? (
          <Card className="flex items-center justify-center gap-2 p-10 text-xs text-slate-500">
            <Spinner className="text-indigo-600" />
            <span>Loading users...</span>
          </Card>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No users found"
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Interests</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">
                        {u.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(u.interests || []).length > 0 ? (
                          u.interests.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="font-mono text-[10px]"
                            >
                              #{tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(u)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
