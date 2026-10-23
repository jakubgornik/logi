import { SupplierForm } from "@/modules/supplier/supplier-form";
import { notFound } from "next/navigation";
import { getSupplier } from "@/lib/fetchers/get-supplier";

interface SupplierEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierEditPage({
  params,
}: SupplierEditPageProps) {
  const { id } = await params;
  const supplier = await getSupplier(id);

  if (!supplier) {
    notFound();
  }

  return <SupplierForm initialData={supplier} supplierId={id} />;
}
