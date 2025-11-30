import { Button } from "@/components/ui/button";
import { getContracts } from "@/lib/fetchers/get-contracts";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES, SUB_ROUTES } from "@/lib/routes";
import { LucideDock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const contracts = await getContracts({ userId: user.id });
  console.log(contracts);
  return (
    <div className="p-6">
      <Button
        variant="outline"
        className="flex gap-1 flex-row items-center px-12 py-2"
      >
        <LucideDock className="h-4 w-4" />
        <Link href={SUB_ROUTES.CONTRACT_CREATE}>Register new contract</Link>
      </Button>
      {/* todo */}
      {/* list of active / expired / terminated contracts */}
    </div>
  );
}
