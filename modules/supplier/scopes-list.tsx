import { Scope } from "@/prisma/client/browser";
import { ScopesListItem } from "./scopes-list-item";

interface ScopesListProps {
  scopes: Scope[];
}

export const ScopesList = ({ scopes }: ScopesListProps) => {
  if (!scopes || scopes.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Scopes</h2>
      <div className="flex flex-wrap gap-2">
        {scopes.map((scope) => (
          <ScopesListItem key={scope} scope={scope} />
        ))}
      </div>
    </div>
  );
};
