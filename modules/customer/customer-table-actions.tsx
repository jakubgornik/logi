"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { buttonVariants } from "../home/animation-variants/variants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUB_ROUTES } from "@/lib/routes";
import { DeleteCustomerDialog } from "./delete-customer-dialog";

interface CustomerTableActionsProps {
  selectedIds: string[];
  onDelete?: () => void;
}

export const CustomerTableActions = ({
  selectedIds,
  onDelete,
}: CustomerTableActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const selectedCount = selectedIds.length;
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
              Delete {selectedCount === 1 ? "" : selectedCount} Customer
              {isMultipleSelection ? "s" : ""}
            </Button>
          </motion.div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => router.push(SUB_ROUTES.CUSTOMER_CREATE)}
        >
          Create Customer
        </Button>
      </AnimatePresence>
      <DeleteCustomerDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDelete}
        customerCount={selectedCount}
      />
    </div>
  );
};
