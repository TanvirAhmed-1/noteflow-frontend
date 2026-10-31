"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Layers, Plus, RotateCcw, Search, Tag } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  DeleteModal,
  EmptyState,
  Pagination,
  Select,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminRoleGuard from "../AdminRoleGuard";
import InterestTableRow from "./InterestTableRow";
import {
  useDeleteInterestMutation,
  useGetInterestsQuery,
  useToggleInterestStatusMutation,
} from "@/redux/features/interest/interestApi";
import { IInterest, TInterestStatus } from "@/types/interest";

const InterestFormModal = dynamic(() => import("./InterestFormModal"), {
  ssr: false,
});

export default function InterestsManagementTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<IInterest | null>(null);
  const [deletingInterest, setDeletingInterest] = useState<IInterest | null>(null);

  const { data, isLoading } = useGetInterestsQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    searchTerm: searchTerm.trim() || undefined,
  });

  const [toggleStatus, { isLoading: isToggling }] =
    useToggleInterestStatusMutation();
  const [deleteInterest, { isLoading: isDeleting }] =
    useDeleteInterestMutation();

  const interests: IInterest[] = data?.result || [];
  const meta = data?.meta;

  const openCreateModal = () => {
    setEditingInterest(null);
    setIsModalOpen(true);
  };

  const openEditModal = (interest: IInterest) => {
    setEditingInterest(interest);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleToggleStatus = async (item: IInterest) => {
    const nextStatus: TInterestStatus =
      item.status === "published" ? "draft" : "published";
    try {
      await toggleStatus({
        interestId: item._id,
        status: nextStatus,
      }).unwrap();
      toast.success(
        `Interest "${item.title}" is now ${nextStatus === "published" ? "Published" : "Draft"}`
      );
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const confirmDelete = async () => {
    if (!deletingInterest) return;
    try {
      await deleteInterest(deletingInterest._id).unwrap();
      toast.success(`Interest "${deletingInterest.title}" deleted`);
      setDeletingInterest(null);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to delete interest"
      );
    }
  };

  return (
    <AdminRoleGuard>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Interests Management
              </h1>
              {meta && (
                <Badge variant="indigo" className="font-mono">
                  {meta.total} Topics
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Create and manage platform interest categories, toggle published
              status, and monitor community taxonomy.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreateModal}
            className="h-10 w-full sm:w-auto cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Interest
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:gap-3 sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search interests by title or description..."
              className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-full sm:w-44">
              <Select
                value={statusFilter}
                icon={<Layers className="h-3.5 w-3.5 text-indigo-500" />}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
                options={[
                  { label: "All Status", value: "all", dotColor: "bg-slate-400" },
                  {
                    label: "Published",
                    value: "published",
                    dotColor: "bg-emerald-500",
                  },
                  { label: "Draft", value: "draft", dotColor: "bg-amber-500" },
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

        {/* Table View */}
        {isLoading ? (
          <CardSkeleton count={5} columns={1} />
        ) : interests.length === 0 ? (
          <EmptyState
            icon={<Tag className="h-10 w-10" />}
            title="No interest topics found"
            description="Create a new interest topic to categorize community posts."
            action={
              <Button
                type="button"
                onClick={openCreateModal}
                className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Create Interest
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden p-0 border-slate-200/80">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/90">
                  <TableHead className="w-14">#</TableHead>
                  <TableHead>Interest Topic</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status (Click to Toggle)</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interests.map((item, idx) => (
                  <InterestTableRow
                    key={item._id}
                    item={item}
                    serialNumber={(page - 1) * limit + idx + 1}
                    isToggling={isToggling}
                    onToggleStatus={handleToggleStatus}
                    onEdit={openEditModal}
                    onDelete={setDeletingInterest}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Responsive Pagination */}
        <Pagination
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          limitOptions={[5, 10, 20, 50]}
          alwaysShow
        />

        {/* Create / Edit Modal */}
        <InterestFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingInterest={editingInterest}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={!!deletingInterest}
          onOpenChange={(open) => !open && setDeletingInterest(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Delete Interest Topic"
          itemName={deletingInterest?.title}
          confirmText="Delete Topic"
        />
      </div>
    </AdminRoleGuard>
  );
}
