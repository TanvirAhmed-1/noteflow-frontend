"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: React.ReactNode;
  itemName?: string;
  confirmText?: string;
}

export function DeleteModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Confirm Deletion",
  description,
  itemName,
  confirmText = "Delete Permanently",
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => !isLoading && onOpenChange(false)}>
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/60">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || (
              <>
                Are you sure you want to delete{" "}
                {itemName ? (
                  <span className="font-semibold text-slate-800">
                    &ldquo;{itemName}&rdquo;
                  </span>
                ) : (
                  "this item"
                )}
                ? This action cannot be undone and will permanently remove the
                record from the database.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="h-9 cursor-pointer rounded-xl border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="h-9 cursor-pointer gap-1.5 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white shadow-sm shadow-rose-500/20 hover:bg-rose-700"
          >
            {isLoading ? (
              <>
                <Spinner className="h-3.5 w-3.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModal;

