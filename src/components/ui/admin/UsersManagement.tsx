"use client";

import React, { useState } from "react";
import { Edit3, Trash2, UserPlus, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  EmptyState,
  Input,
  Pagination,
  RoleBadge,
  SectionHeader,
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

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "user" as TUserRole,
  interests: "",
};

export default function UsersManagement() {
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const { data, isLoading } = useGetAllUsersQuery({ page, limit: 8 });
  const [createAdminUser, { isLoading: isCreating }] =
    useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users: IUser[] = data?.result || [];
  const meta = data?.meta;

  const resetForm = () => {
    setEditingUser(null);
    setFormData(initialForm);
  };

  const startEdit = (user: IUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      interests: (user.interests || []).join(", "),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const interests = formData.interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingUser) {
        const payload: Record<string, unknown> = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          interests,
        };
        if (formData.password.trim()) payload.password = formData.password;
        await updateUser({ userId: editingUser._id, data: payload }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await createAdminUser({ ...formData, interests }).unwrap();
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Tanvir Ahmed"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
              <Input
                type="email"
                label="Email Address"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <Input
                type="password"
                label={
                  editingUser ? "New Password (optional)" : "Initial Password"
                }
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
                required={!editingUser}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      role: e.target.value as TUserRole,
                    }))
                  }
                  className="h-10 rounded-md border border-gray-200 bg-gray-50/60 px-3 text-sm text-gray-800 outline-none focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Input
                label="Interests (comma separated)"
                placeholder="chess, reading, coding"
                value={formData.interests}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, interests: e.target.value }))
                }
              />
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-700"
              >
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
          <Card className="p-8 text-center text-xs text-slate-400">
            Loading users...
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
