"use client";

import { Button } from "@/components/ui/button";
import { useDeleteSupplier } from "@/hooks/supplier/supplier.hooks";
import { ROUTES, SUB_ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

interface SupplierDetailsCardPreviewProps {
  id: string;
}

export const SupplierDetailsCardPreview = ({
  id,
}: SupplierDetailsCardPreviewProps) => {
  const router = useRouter();
  const { mutate: deleteSupplier } = useDeleteSupplier({
    onSuccess: () => {
      router.push(ROUTES.SUPPLIER);
    },
  });

  return (
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Supplier Details
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage supplier information
        </p>
      </div>
      <div className="flex gap-3 align-bottom">
        <Button
          variant="outline"
          onClick={() => router.push(SUB_ROUTES.SUPPLIER_EDIT(id))}
        >
          Edit Supplier
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            deleteSupplier({
              ids: [id],
            })
          }
        >
          Delete Supplier
        </Button>
      </div>
    </div>
  );
};
