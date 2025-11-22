import { getCurrentUser } from "@/lib/get-current-user";
import { SupplierTable } from "@/modules/supplier/supplier-table";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div>
      <SupplierTable />
    </div>
  );
}
