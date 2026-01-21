import { getSession } from "@/lib/fetchers/get-session";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";
import { ROUTES } from "@/lib/routes";
import { SupplierTable } from "@/modules/supplier/supplier-table";
import SuppliersCountryStatistics from "@/modules/supplier/suppliers-country-statistics";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const suppliers = await getSuppliers({
    userId: session.userId,
  });

  return (
    <SupplierTable initialData={suppliers.success ? suppliers.data : undefined}>
      <SuppliersCountryStatistics />
    </SupplierTable>
  );
}
