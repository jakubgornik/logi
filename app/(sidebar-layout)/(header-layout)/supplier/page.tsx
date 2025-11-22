import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return <div className="h-full">Suppliers page</div>;
}
