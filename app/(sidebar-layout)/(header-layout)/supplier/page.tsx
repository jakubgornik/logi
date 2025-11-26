import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";
import { ROUTES } from "@/lib/routes";
import { SupplierTable } from "@/modules/supplier/supplier-table";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const result = await getSuppliers({});

  return (
    <div>
      <SupplierTable initialData={result.success ? result.data : undefined} />
    </div>
  );
}
