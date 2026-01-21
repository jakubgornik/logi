import { getSession } from "@/lib/fetchers/get-session";
import { ROUTES } from "@/lib/routes";
import { CustomerForm } from "@/modules/customer/customer-form";
import { redirect } from "next/navigation";

export default async function CreateCustomerPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }
  return <CustomerForm />;
}
