import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const inventories = await getInventories({
    userId: user.id,
  });
  console.log(inventories.success ? inventories.data : []);
  return <></>;
}
