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

interface DeleteContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  contractCount: number;
}

export const DeleteContractDialog = ({
  isOpen,
  onClose,
  onConfirm,
  contractCount,
}: DeleteContractDialogProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Contract{contractCount > 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {contractCount > 1 ? "these contracts" : "this contract"}? This
            action cannot be undone.
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
};
