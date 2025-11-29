import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SCOPES } from "@/lib/shared/consts";
import { Scope } from "@/prisma/client/enums";

interface ScopesListItemProps {
  scope: Scope;
}

export const ScopesListItem = ({ scope }: ScopesListItemProps) => {
  return (
    <Card>
      <div className="flex flex-row w-full items-center gap-3 py-2 px-12">
        <p className="text-sm font-medium">{SCOPES[scope]}</p>
        <span className="border-l h-6 border-muted" />
        <Badge className="bg-green-700 rounded-md">Active</Badge>
      </div>
    </Card>
  );
};
