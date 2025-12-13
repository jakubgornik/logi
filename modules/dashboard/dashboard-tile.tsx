import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface DashboardTileProps {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export const DashboardTile = ({
  title,
  icon: Icon,
  children,
}: DashboardTileProps) => {
  return (
    <Card className="flex flex-col shadow-sm w-full transition-all hover:scale-[1.02] hover:shadow-md">
      {(title || Icon) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pb-2">
          {title && (
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          )}
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
      )}
      <CardContent className="flex flex-col flex-1">{children}</CardContent>
    </Card>
  );
};
