import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getCustomers } from "@/lib/fetchers/get-customers";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { getTransaction } from "@/lib/fetchers/get-transaction";
import { ROUTES } from "@/lib/routes";
import { TransactionForm } from "@/modules/transaction/transaction-form";
import { redirect, notFound } from "next/navigation";

interface EditTransactionPageProps {
  params: {
    id: string;
  };
}

export default async function EditTransactionPage({
  params,
}: EditTransactionPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const { id } = await params;

  const [inventoriesRes, customersRes, transaction] = await Promise.all([
    getInventories({ userId: user.id, fetchAll: true }),
    getCustomers({ userId: user.id, fetchAll: true }),
    getTransaction(id),
  ]);

  if (!transaction) {
    return notFound();
  }

  return (
    <TransactionForm
      inventories={inventoriesRes.success ? inventoriesRes.data.data : []}
      customers={customersRes.success ? customersRes.data.data : []}
      transaction={transaction}
    />
  );
}
