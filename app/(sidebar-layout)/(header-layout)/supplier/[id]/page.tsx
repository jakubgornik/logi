import { getSupplier } from "@/lib/fetchers/get-supplier";
import { SupplierDetailsCard } from "@/modules/supplier/supplier-details";

interface SupplierDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierDetailsPage({
  params,
}: SupplierDetailsPageProps) {
  const { id } = await params;

  const supplier = await getSupplier(id);

  return <SupplierDetailsCard supplier={supplier} />;
}
