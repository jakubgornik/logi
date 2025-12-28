import { useGetCustomers } from "@/hooks/customer.hooks";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getCustomers } from "@/lib/fetchers/get-customers";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const result = await getCustomers({ userId: user.id });
  const customers = result.success ? result.data : [];

  return <></>;
}
