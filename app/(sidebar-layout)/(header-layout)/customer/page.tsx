import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getCustomers } from "@/lib/fetchers/get-customers";
import { ROUTES } from "@/lib/routes";
import { CustomerTable } from "@/modules/customer/customer-table";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const customer = await getCustomers({ userId: user.id });

  return (
    <CustomerTable initialData={customer.success ? customer.data : undefined} />
  );
}
