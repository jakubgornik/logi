import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, UserCog } from "lucide-react";
import { User } from "@/prisma/client/client";
import { ScopesList } from "../supplier/scopes-list";
import { UserDetailsCardPreview } from "./user-details-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SUB_ROUTES } from "@/lib/routes";

interface UserDetailsCardProps {
  user: User;
}

export const UserDetailsCard = ({ user }: UserDetailsCardProps) => {
  return (
    <div className="p-6 space-y-4">
      <UserDetailsCardPreview />
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                {user.name ?? "[Please set your name]"}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{user.id}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ScopesList scopes={user.scopes} />
    </div>
  );
};
