import { getContracts } from "@/lib/fetchers/get-contracts";
import { getSession } from "@/lib/fetchers/get-session";
import { ROUTES } from "@/lib/routes";
import { ContractTable } from "@/modules/contract/contract-table";
import { redirect } from "next/navigation";

export default async function ContractPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const contracts = await getContracts({
    userId: session.userId,
  });

  return (
    <ContractTable
      initialData={contracts.success ? contracts.data : undefined}
    />
  );
}
