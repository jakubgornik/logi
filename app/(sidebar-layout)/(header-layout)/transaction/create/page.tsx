import { getCustomers } from "@/lib/fetchers/get-customers";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { getSession } from "@/lib/fetchers/get-session";
import { ROUTES } from "@/lib/routes";
import { TransactionForm } from "@/modules/transaction/transaction-form";
import { redirect } from "next/navigation";

export default async function CreateTransactionPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const [inventories, customers] = await Promise.all([
    getInventories({
      userId: session.userId,
      fetchAll: true,
    }),
    getCustomers({
      userId: session.userId,
      fetchAll: true,
    }),
  ]);

  return (
    <TransactionForm
      inventories={inventories.success ? inventories.data.data : []}
      customers={customers.success ? customers.data.data : []}
    />
  );
}
