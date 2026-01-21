import { ScrollArea } from "@/components/ui/scroll-area";
import { ROUTES, SUB_ROUTES } from "@/lib/routes";
import {
  FilePlus,
  Truck,
  Bell,
  CheckCircle2,
  Package,
  PersonStanding,
  BadgeCent,
} from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardActionTile } from "@/modules/dashboard/dashboard-action-tile";
import { DashboardTile } from "@/modules/dashboard/dashboard-tile";
import { CustomAccordion } from "@/components/custom-accordion";
import { getLatestNotifications } from "@/lib/fetchers/get-latest-notifications";
import { getSession } from "@/lib/fetchers/get-session";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const notifications = await getLatestNotifications(session.userId);

  return (
    <div className="p-6">
      <CustomAccordion label="Quick actions" defaultOpen>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center xl:justify-items-start">
          <DashboardActionTile
            title="Suppliers"
            icon={Truck}
            contentHeader="Add Supplier"
            contentDescription="Register a new vendor."
            actionLabel="Register Supplier"
            actionHref={SUB_ROUTES.SUPPLIER_CREATE}
          />
          <DashboardActionTile
            title="Contracts"
            icon={FilePlus}
            contentHeader="Add Contract"
            contentDescription="Draft a new agreement."
            actionLabel="Create Contract"
            actionHref={SUB_ROUTES.CONTRACT_CREATE}
          />
          <DashboardActionTile
            title="Inventory"
            icon={Package}
            contentHeader="Add Product to Inventory"
            contentDescription="Register a new product."
            actionLabel="Add Product"
            actionHref={SUB_ROUTES.INVENTORY_CREATE}
          />
          <DashboardActionTile
            title="Customers"
            icon={PersonStanding}
            contentHeader="Add Customer"
            contentDescription="Register a new customer."
            actionLabel="Add Customer"
            actionHref={SUB_ROUTES.CUSTOMER_CREATE}
          />
          <DashboardActionTile
            title="Transactions"
            icon={BadgeCent}
            contentHeader="Add Transaction"
            contentDescription="Register a new transaction."
            actionLabel="Add Transaction"
            actionHref={SUB_ROUTES.TRANSACTION_CREATE}
          />
          <DashboardTile title="Notifications" icon={Bell}>
            {/* todo refactor */}
            <ScrollArea className="h-[180px]">
              {notifications.length > 0 ? (
                <div className="p-5 flex flex-col gap-4">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted/35 p-2 items-center rounded-md flex gap-1 border-b"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-sm text-muted-foreground">
                  No new notifications in the last 24 hours.
                </div>
              )}
            </ScrollArea>
          </DashboardTile>
        </div>
      </CustomAccordion>
    </div>
  );
}
