import { getCurrentUser } from "@/lib/get-current-user";
import { SupplierTable } from "@/modules/supplier/supplier-table";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const initialData = [
    {
      id: "1",
      name: "ABC Logistics Sp. z o.o.",
      phone: "+48 22 123 4567",
      email: "kontakt@abclogistics.pl",
      addressCountry: "PL",
      addressCity: "Warszawa",
      addressStreet: "ul. Marszałkowska 123",
      addressPostalCode: "00-001",
    },
    {
      id: "2",
      name: "ABC Logistics Sp. z o.o.",
      phone: "+48 22 123 4567",
      email: "kontakt@abclogistics.pl",
      addressCountry: "PL",
      addressCity: "Warszawa",
      addressStreet: "ul. Marszałkowska 123",
      addressPostalCode: "00-001",
    },
  ];

  return (
    <div>
      <SupplierTable initialData={initialData} />
    </div>
  );
}
