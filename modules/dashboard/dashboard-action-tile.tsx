import { CardDescription } from "@/components/ui/card";
import { DashboardTile, DashboardTileProps } from "./dashboard-tile";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardActionTileProps
  extends Omit<DashboardTileProps, "children"> {
  contentHeader: string;
  contentDescription: string;
  actionLabel: string;
  actionHref: string;
}

export const DashboardActionTile = ({
  contentHeader,
  contentDescription,
  actionHref,
  actionLabel,
  ...props
}: DashboardActionTileProps) => {
  return (
    <DashboardTile {...props}>
      <div>
        <div className="text-2xl font-bold">{contentHeader}</div>
        <CardDescription>{contentDescription}</CardDescription>
      </div>
      <div className="mt-auto pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </DashboardTile>
  );
};
