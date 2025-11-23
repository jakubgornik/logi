"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { buttonVariants } from "../home/animation-variants/variants";
import { DeleteSupplierDialog } from "./delete-supplier-dialog";
import { useState } from "react";
import { useDeleteSupplier } from "@/hooks/use-delete-supplier";

interface SupplierTableActionsProps {
  selectedIds: string[];
  onDelete?: () => void;
}

export default function SupplierTableActions({
  selectedIds,
  onDelete,
}: SupplierTableActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const selectedCount = selectedIds.length;
  const showEditButton = selectedCount === 1;
  const showDeleteButton = selectedCount > 0;
  const isMultipleSelection = selectedCount > 1;

  return (
    <div className="pb-2 flex gap-2">
      <AnimatePresence>
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
              onClick={() => console.log("edit")}
            >
              Edit Supplier
            </Button>
          </motion.div>
        )}
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
              Delete {selectedCount === 1 ? "" : selectedCount} Supplier
              {isMultipleSelection ? "s" : ""}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <DeleteSupplierDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDelete}
        supplierCount={selectedCount}
      />
    </div>
  );
}
