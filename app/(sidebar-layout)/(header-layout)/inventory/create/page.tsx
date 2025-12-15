import { getContracts } from "@/lib/fetchers/get-contracts";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES } from "@/lib/routes";
import { InventoryForm } from "@/modules/inventory/inventory-form";
import { redirect } from "next/navigation";

export default async function CreateInventoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }
  const result = await getContracts({
    userId: user.id,
    fetchAll: true,
  });

  const contracts = result.success ? result.data.data : [];

  return <InventoryForm contracts={contracts} userScopes={user.scopes} />;
}
