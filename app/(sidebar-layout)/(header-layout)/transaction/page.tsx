import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getTransactions } from "@/lib/fetchers/get-transactions";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function TransactionPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const transactions = await getTransactions({ userId: user.id });

  return <></>;
}
