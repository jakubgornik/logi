import { getSession } from "@/lib/fetchers/get-session";
import { ROUTES } from "@/lib/routes";
import { SupplierForm } from "@/modules/supplier/supplier-form";
import { redirect } from "next/navigation";

export default async function SupplierCreatePage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  return <SupplierForm />;
}
