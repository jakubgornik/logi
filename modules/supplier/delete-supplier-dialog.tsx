"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSupplierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supplierCount: number;
}

export function DeleteSupplierDialog({
  isOpen,
  onClose,
  onConfirm,
  supplierCount,
}: DeleteSupplierDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Supplier{supplierCount > 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete supplier? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
