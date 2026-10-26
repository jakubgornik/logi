"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUB_ROUTES } from "@/lib/routes";
import { buttonVariants } from "@/modules/home/animation-variants/variants";
import { DeleteDialog } from "@/components/delete-dialog";

interface TransactionTableActionsProps {
  selectedIds: string[];
  canDelete: boolean;
  canEdit: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}

export const TransactionTableActions = ({
  selectedIds,
  canDelete,
  canEdit,
  isDeleting,
  onDelete,
}: TransactionTableActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const selectedCount = selectedIds.length;

  const isMultipleSelection = selectedCount > 1;

  const handleDelete = () => {
    const isDeleteBlocked = !canDelete || isDeleting || !isDeleteDialogOpen;

    if (isDeleteBlocked) return;

    onDelete();
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    const isEditBlocked = !canEdit || isDeleting;

    if (isEditBlocked) return;

    router.push(SUB_ROUTES.TRANSACTION_EDIT(selectedIds[0]));
  };

  return (
    <div className="pb-2 flex gap-2">
      <AnimatePresence>
        {canDelete && (
          <motion.div
            key="delete"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              variant="destructive"
              size="sm"
              className="h-10"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete {selectedCount === 1 ? "" : selectedCount} Transaction
              {isMultipleSelection ? "s" : ""}
            </Button>
          </motion.div>
        )}
        {canEdit && (
          <motion.div
            key="edit"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              disabled={isDeleting}
              onClick={handleEdit}
            >
              Edit Transaction
            </Button>
          </motion.div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          disabled={isDeleting}
          onClick={() => router.push(SUB_ROUTES.TRANSACTION_CREATE)}
        >
          Create Transaction
        </Button>
      </AnimatePresence>
      <DeleteDialog
        isOpen={isDeleteDialogOpen && canDelete}
        onClose={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Delete ${selectedCount} Transaction${
          selectedCount > 1 ? "s" : ""
        }`}
        description="This will permanently remove the selected draft transactions."
        actionLabel="Delete Transactions"
        isDeleting={isDeleting}
      />
    </div>
  );
};
