import { SupplierForm } from "@/modules/supplier/supplier-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSupplier } from "@/lib/fetchers/get-supplier";
import { ROUTES } from "@/lib/routes";
import { getSession } from "@/lib/fetchers/get-session";

interface SupplierEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierEditPage({
  params,
}: SupplierEditPageProps) {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const { id } = await params;
  const supplier = await getSupplier(id);

  return <SupplierForm initialData={supplier} supplierId={id} />;
}
