import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";
import { ROUTES } from "@/lib/routes";
import { SupplierTable } from "@/modules/supplier/supplier-table";
import SuppliersCountryStatistics from "@/modules/supplier/suppliers-country-statistics";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const suppliers = await getSuppliers({
    userId: user.id,
  });

  return (
    <SupplierTable initialData={suppliers.success ? suppliers.data : undefined}>
      <SuppliersCountryStatistics />
    </SupplierTable>
  );
}
