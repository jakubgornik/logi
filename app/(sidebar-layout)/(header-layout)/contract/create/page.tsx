import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";
import { ROUTES } from "@/lib/routes";
import { ContractForm } from "@/modules/contract/contract-form";
import { get } from "http";
import { redirect } from "next/navigation";

export default async function CreateContractPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const result = await getSuppliers({
    userId: user.id,
    fetchAll: true,
  });

  const suppliers = result.success ? result.data.data : [];
  const userScopes = user.scopes || [];

  return <ContractForm suppliers={suppliers} userScopes={userScopes} />;
}
