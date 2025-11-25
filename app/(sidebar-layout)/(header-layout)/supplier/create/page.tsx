import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { SupplierForm } from "@/modules/supplier/supplier-form";
import { redirect } from "next/navigation";

export default async function SupplierCreatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return <SupplierForm />;
}
