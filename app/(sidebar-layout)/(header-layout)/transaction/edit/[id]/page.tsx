import { getCustomers } from "@/lib/fetchers/get-customers";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { getSession } from "@/lib/fetchers/get-session";
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
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const { id } = await params;

  const [inventories, customers, transaction] = await Promise.all([
    getInventories({ userId: session.userId, fetchAll: true }),
    getCustomers({ userId: session.userId, fetchAll: true }),
    getTransaction(id),
  ]);

  if (!transaction) {
    return notFound();
  }

  return (
    <TransactionForm
      inventories={inventories.success ? inventories.data.data : []}
      customers={customers.success ? customers.data.data : []}
      transaction={transaction}
    />
  );
}
