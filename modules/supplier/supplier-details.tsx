import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Supplier } from "@/prisma/client/client";
import { formatSupplierAddress } from "@/lib/utils/format-supplier-address";
import { SupplierScopesList } from "./supplier-scopes-list";
import { SupplierDetailsCardPreview } from "./supplier-details-card-preview";

interface SupplierDetailsProps {
  supplier: Supplier;
}

export const SupplierDetailsCard = ({ supplier }: SupplierDetailsProps) => {
  return (
    <div className="p-6 space-y-4">
      <SupplierDetailsCardPreview id={supplier.id} />
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                {supplier.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{supplier.id}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatSupplierAddress(
                  supplier.addressStreet,
                  supplier.addressCity,
                  supplier.addressPostalCode,
                  supplier.addressCountry
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <SupplierScopesList scopes={supplier.scopes} />
    </div>
  );
};
