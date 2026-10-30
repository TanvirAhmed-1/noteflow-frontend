"use client";

import React, { useState } from "react";
import {
  Calendar,
  Edit3,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  DeleteModal,
  EmptyState,
  Pagination,
  RoleBadge,
  Spinner,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/features/auth/authApi";
import { IUser } from "@/types/note";
import AdminRoleGuard from "./AdminRoleGuard";
import UserFormModal from "./UserFormModal";

export default function UsersManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);

  const { data, isLoading } = useGetAllUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users: IUser[] = data?.result || [];
  const meta = data?.meta;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: IUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser._id).unwrap();
      toast.success("User removed successfully");
      setDeletingUser(null);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  return (
    <AdminRoleGuard>
      <div className="space-y-6">
        {/* Top Page Header & Primary Create User Button */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                User Directory & RBAC Management
              </h1>
              {meta && (
                <Badge variant="indigo" className="font-mono">
                  {meta.total} Users
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Manage platform accounts, assign Admin/User roles, and inspect
              indexed user records{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                {"{ createdAt: -1 }"}
              </code>
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreateModal}
            className="h-10 cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700"
          >
            <UserPlus className="h-4 w-4" />
            Create New User
          </Button>
        </div>

        {/* Search & Role Filter Toolbar */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-3 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(["all", "admin", "user"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                  roleFilter === r
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r === "all" ? "All Roles" : `${r}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Full-Width User Table */}
        {isLoading ? (
          <Card className="flex items-center justify-center gap-2 p-16 text-xs text-slate-500">
            <Spinner className="text-indigo-600" />
            <span>Loading platform users...</span>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No matching users found"
            description="Try clearing your search filter or create a new user account."
            action={
              <Button
                type="button"
                onClick={openCreateModal}
                className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/90">
                  <TableHead>User Profile</TableHead>
                  <TableHead>Access Role</TableHead>
                  <TableHead>Interests</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u._id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white shadow-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="font-mono text-[11px] text-slate-400">
                            {u.email}
                          </p>
                        </div>
                      </div>
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
                          <span className="text-xs text-slate-300">
                            No tags
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          title="Edit User"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingUser(u)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                          title="Delete User"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
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

        {/* Create / Edit User Shadcn Modal */}
        <UserFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingUser={editingUser}
        />

        {/* Delete User Confirmation Modal */}
        <DeleteModal
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Delete User Account"
          itemName={
            deletingUser
              ? `${deletingUser.name} (${deletingUser.email})`
              : undefined
          }
          confirmText="Delete User"
        />
      </div>
    </AdminRoleGuard>
  );
}
