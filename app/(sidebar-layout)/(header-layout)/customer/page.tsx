import { getCustomers } from "@/lib/fetchers/get-customers";
import { getSession } from "@/lib/fetchers/get-session";
import { ROUTES } from "@/lib/routes";
import { CustomerTable } from "@/modules/customer/customer-table";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const customer = await getCustomers({ userId: session.userId });

  return (
    <CustomerTable initialData={customer.success ? customer.data : undefined} />
  );
}
