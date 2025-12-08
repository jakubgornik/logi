import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES, SUB_ROUTES } from "@/lib/routes";
import { FilePlus, Truck, Bell, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Notification } from "@/lib/types/common.types";
import { DashboardActionTile } from "@/modules/dashboard/dashboard-action-tile";
import { DashboardTile } from "@/modules/dashboard/dashboard-tile";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const notifications: Notification[] = [];
  const today = new Date();

  return (
    <div className="p-6">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center xl:justify-items-start">
        <DashboardActionTile
          title="Contracts"
          icon={FilePlus}
          contentHeader="New Contract"
          contentDescription="Draft a new agreement."
          actionLabel="Create Contract"
          actionHref={SUB_ROUTES.CONTRACT_CREATE}
        />
        <DashboardActionTile
          title="Suppliers"
          icon={Truck}
          contentHeader="New Supplier"
          contentDescription="Register a new vendor."
          actionLabel="Register Supplier"
          actionHref={SUB_ROUTES.SUPPLIER_CREATE}
        />
        <DashboardTile title="Notifications" icon={Bell}>
          {/* todo refactor */}
          <ScrollArea className="h-[250px]">
            {notifications.length > 0 ? (
              <div className="p-5 flex flex-col gap-4">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground pt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            )}
          </ScrollArea>
        </DashboardTile>
        <DashboardTile>
          <div className="p-4 flex justify-center items-center">
            <Calendar
              mode="single"
              selected={today}
              className="rounded-md border bg-card shadow-sm"
            />
          </div>
        </DashboardTile>
      </div>
    </div>
  );
}
