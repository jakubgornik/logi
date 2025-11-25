"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { buttonVariants } from "../home/animation-variants/variants";
import { DeleteSupplierDialog } from "./delete-supplier-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUB_ROUTES } from "@/lib/routes";

interface SupplierTableActionsProps {
  selectedIds: string[];
  onDelete?: () => void;
}

export default function SupplierTableActions({
  selectedIds,
  onDelete,
}: SupplierTableActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const selectedCount = selectedIds.length;
  const showEditButton = selectedCount === 1;
  const showDeleteButton = selectedCount > 0;
  const isMultipleSelection = selectedCount > 1;

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
              Delete {selectedCount === 1 ? "" : selectedCount} Supplier
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
                router.push(SUB_ROUTES.SUPPLIER_EDIT(selectedIds[0]))
              }
            >
              Edit Supplier
            </Button>
          </motion.div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => router.push(SUB_ROUTES.SUPPLIER_CREATE)}
        >
          Create Supplier
        </Button>
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
