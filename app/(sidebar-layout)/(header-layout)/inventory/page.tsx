import { getInventories } from "@/lib/fetchers/get-inventories";
import { getSession } from "@/lib/fetchers/get-session";
import { ROUTES } from "@/lib/routes";
import { InventoryTable } from "@/modules/inventory/inventory-table";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const inventories = await getInventories({
    userId: session.userId,
  });

  return (
    <InventoryTable
      userId={session.userId}
      initialData={inventories.success ? inventories.data : undefined}
    />
  );
}
