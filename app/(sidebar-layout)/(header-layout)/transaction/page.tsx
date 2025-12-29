import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { ROUTES } from "@/lib/routes";
import { TransactionForm } from "@/modules/transaction/transaction-form";
import { redirect } from "next/navigation";

export default async function TransactionPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const inventories = await getInventories({
    userId: user.id,
    fetchAll: true,
  });

  return (
    <TransactionForm
      inventories={inventories.success ? inventories.data.data : []}
    />
  );
}
