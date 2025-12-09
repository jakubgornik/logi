import { getContracts } from "@/lib/fetchers/get-contracts";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function ContractPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const contracts = await getContracts({
    userId: user.id,
  });
  console.log(contracts.success ? contracts.data : "No contracts");
  return <div></div>;
}
