import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES } from "@/lib/routes";
import { ContractForm } from "@/modules/contract/contract-form";
import { get } from "http";
import { redirect } from "next/navigation";

export default function CreateContractPage() {
  const user = getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  return <ContractForm />;
}
