import { Button } from "@/components/ui/button";
import { SUB_ROUTES } from "@/lib/routes";
import { UserCog } from "lucide-react";
import Link from "next/link";

export const UserDetailsCardPreview = () => {
  return (
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          User Details
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage user information
        </p>
      </div>
      <Button
        variant="outline"
        className="flex gap-1 flex-row items-center px-12 py-2"
      >
        <UserCog className="h-4 w-4" />
        <Link href={SUB_ROUTES.SETTINGS_UPDATE}>Update user profile</Link>
      </Button>
    </div>
  );
};
