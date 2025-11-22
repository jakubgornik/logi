import { getCurrentUser } from "@/lib/get-current-user";
import { SupplierForm } from "@/modules/supplier/supplier-form";
import { redirect } from "next/navigation";
import { SupplierFormSchema } from "@/modules/supplier/supplier-form.validation";

interface SupplierEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierEditPage({
  params,
}: SupplierEditPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const mockSupplierData: SupplierFormSchema = {
    name: "ABC Logistics Sp. z o.o.",
    phone: "+48 22 123 4567",
    email: "kontakt@abclogistics.pl",
    addressCountry: "PL",
    addressCity: "Warszawa",
    addressStreet: "ul. Marszałkowska 123",
    addressPostalCode: "00-001",
  };

  return (
    <div className="h-full">
      <SupplierForm initialData={mockSupplierData} />
    </div>
  );
}
