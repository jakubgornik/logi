import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES } from "@/lib/routes";
import { CustomerForm } from "@/modules/customer/customer-form";
import { redirect } from "next/navigation";

export default async function CreateCustomerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }
  return <CustomerForm />;
}
