import { Scope } from "@/prisma/client/browser";
import { SupplierScopesItem } from "./supplier-scopes-item";

interface ScopeItemProps {
  scopes: Scope[];
}

export const SupplierScopesList = ({ scopes }: ScopeItemProps) => {
  if (!scopes || scopes.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Scopes</h2>
      <div className="flex flex-wrap gap-2">
        {scopes.map((scope) => (
          <SupplierScopesItem key={scope} scope={scope} />
        ))}
      </div>
    </div>
  );
};
