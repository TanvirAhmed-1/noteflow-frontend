"use client";

import React, { useState } from "react";
import { Edit3, Trash2, UserPlus, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Pagination } from "@/components/shared";
import { Button } from "@/components/ui/button";
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
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Operation failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User removed successfully");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete user";
      toast.error(msg);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Add / Update User Form */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                {editingUser ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {editingUser ? "Edit User Account" : "Add New User"}
              </h2>
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
          </div>

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
        </div>
      </div>

      {/* Right: Paginated Users List */}
      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Platform Users
            </h2>
            <p className="text-xs text-slate-500">
              Admin directory sorted by{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                {"{ createdAt: -1 }"}
              </code>
            </p>
          </div>
          {meta && (
            <span className="rounded-full bg-amber-50 px-3 py-1 font-mono text-xs font-bold text-amber-700">
              {meta.total} Total Users
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-xs text-slate-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">User</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Interests</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="font-mono text-[11px] text-slate-400">
                          {u.email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(u.interests || []).length > 0 ? (
                            u.interests.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600"
                              >
                                #{tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(u)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit user"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u._id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
