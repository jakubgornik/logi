import { SupplierForm } from "@/modules/supplier/supplier-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSupplier } from "@/lib/fetchers/get-supplier";
import { ROUTES } from "@/lib/routes";

interface SupplierEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierEditPage({
  params,
}: SupplierEditPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const { id } = await params;
  const supplier = await getSupplier(id);

  return <SupplierForm initialData={supplier} supplierId={id} />;
}
