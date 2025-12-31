"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUB_ROUTES } from "@/lib/routes";
import { buttonVariants } from "@/modules/home/animation-variants/variants";
import { DeleteDialog } from "@/components/delete-dialog";
import { Transaction } from "@/prisma/client/client";

interface TransactionTableActionsProps {
  selectedIds: string[];
  selectedTransactions: Transaction[];
  onDelete: () => void;
}

export const TransactionTableActions = ({
  selectedIds,
  selectedTransactions,
  onDelete,
}: TransactionTableActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const selectedCount = selectedIds.length;

  const allSelectedAreDrafts = selectedTransactions.every(
    (t) => t.status === "DRAFT"
  );

  const showDeleteButton = selectedCount > 0 && allSelectedAreDrafts;

  const selectedTransaction = selectedTransactions[0];
  const isConfirmed = selectedTransaction?.status === "CONFIRMED";
  const showEditButton = selectedCount === 1 && !isConfirmed;

  const isMultipleSelection = selectedCount > 1;

  const handleDelete = () => {
    onDelete?.();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="pb-2 flex gap-2">
      <AnimatePresence>
        {showDeleteButton && (
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
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete {selectedCount === 1 ? "" : selectedCount} Transaction
              {isMultipleSelection ? "s" : ""}
            </Button>
          </motion.div>
        )}
        {showEditButton && (
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
              onClick={() =>
                router.push(SUB_ROUTES.TRANSACTION_EDIT(selectedIds[0]))
              }
            >
              Edit Transaction
            </Button>
          </motion.div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => router.push(SUB_ROUTES.TRANSACTION_CREATE)}
        >
          Create Transaction
        </Button>
      </AnimatePresence>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Delete ${selectedCount} Transaction${
          selectedCount > 1 ? "s" : ""
        }`}
        description="This will permanently remove the selected draft transactions."
        actionLabel="Delete Transactions"
      />
    </div>
  );
};
