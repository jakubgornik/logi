import { getSession } from "@/lib/fetchers/get-session";
import { getTransactions } from "@/lib/fetchers/get-transactions";
import { ROUTES } from "@/lib/routes";
import { TransactionTable } from "@/modules/transaction/table/transaction-table";
import { redirect } from "next/navigation";

export default async function TransactionPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const transactions = await getTransactions({ userId: session.userId });

  return (
    <TransactionTable
      initialData={transactions.success ? transactions.data : undefined}
    />
  );
}
