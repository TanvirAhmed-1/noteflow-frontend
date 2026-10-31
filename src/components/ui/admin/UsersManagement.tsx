"use client";

import React, { useState } from "react";
import {
  Activity,
  Calendar,
  Edit3,
  Plus,
  RotateCcw,
  Search,
  Shield,
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
  Select,
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
  useUpdateUserMutation,
} from "@/redux/features/auth/authApi";
import { IUser } from "@/types/note";
import AdminRoleGuard from "./AdminRoleGuard";
import UserFormModal from "./UserFormModal";

export default function UsersManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);

  const { data, isLoading } = useGetAllUsersQuery({
    page,
    limit,
    searchTerm: searchTerm.trim() || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    isActive: statusFilter === "all" ? undefined : statusFilter,
  });
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users: IUser[] = data?.result || [];
  const meta = data?.meta;

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: IUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: IUser) => {
    const nextStatus = user.isActive === false;
    try {
      await updateUser({
        userId: user._id,
        data: { isActive: nextStatus },
      }).unwrap();
      toast.success(
        `${user.name} marked as ${nextStatus ? "Active" : "Inactive"}`
      );
    } catch {
      toast.error("Failed to update user status");
    }
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

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
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
              Manage platform accounts, assign Admin/User roles, and control
              active account status.
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

        {/* Search, Role Filter & Active Status Filter Toolbar */}
        <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-12 lg:items-center">
          <div className="relative sm:col-span-2 lg:col-span-5">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1 lg:col-span-3">
            <Select
              value={roleFilter}
              icon={<Shield className="h-3.5 w-3.5 text-indigo-500" />}
              onValueChange={(val) => {
                setRoleFilter(val as "all" | "admin" | "user");
                setPage(1);
              }}
              options={[
                { label: "All Roles", value: "all", dotColor: "bg-slate-400" },
                { label: "User", value: "user", dotColor: "bg-blue-500" },
                { label: "Admin", value: "admin", dotColor: "bg-indigo-600" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 sm:col-span-1 lg:col-span-4">
            <div className="flex-1">
              <Select
                value={statusFilter}
                icon={<Activity className="h-3.5 w-3.5 text-emerald-500" />}
                onValueChange={(val) => {
                  setStatusFilter(val as "all" | "true" | "false");
                  setPage(1);
                }}
                options={[
                  {
                    label: "All Status",
                    value: "all",
                    dotColor: "bg-slate-400",
                  },
                  {
                    label: "Active Users",
                    value: "true",
                    dotColor: "bg-emerald-500",
                  },
                  {
                    label: "Inactive Users",
                    value: "false",
                    dotColor: "bg-rose-500",
                  },
                ]}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              title="Reset Filters"
              className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border-slate-200/90 p-0 text-slate-600 shadow-2xs hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Full-Width User Table */}
        {isLoading ? (
          <Card className="flex items-center justify-center gap-2 p-16 text-xs text-slate-500">
            <Spinner className="text-indigo-600" />
            <span>Loading platform users...</span>
          </Card>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No matching users found"
            description="Try clearing your search, role, or status filter, or create a new user account."
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
                  <TableHead>Account Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isActive = u.isActive !== false;
                  return (
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
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          title="Click to toggle Active / Inactive status"
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all ${
                            isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </button>
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
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        <Pagination
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          alwaysShow
        />

        <UserFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingUser={editingUser}
        />

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
