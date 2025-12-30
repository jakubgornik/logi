import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { ROUTES } from "@/lib/routes";
import { InventoryTable } from "@/modules/inventory/inventory-table";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const inventories = await getInventories({
    userId: user.id,
  });

  return (
    <InventoryTable
      userId={user.id}
      initialData={inventories.success ? inventories.data : undefined}
    />
  );
}
