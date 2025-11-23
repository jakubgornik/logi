import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return <div className="h-full">Dash</div>;
}
