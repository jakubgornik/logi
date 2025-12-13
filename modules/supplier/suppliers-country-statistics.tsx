import { CustomAccordion } from "@/components/custom-accordion";
import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";
import { mapCountryCodeToName } from "./supplier-form.utils";

export default async function SuppliersCountryStatistics() {
  const user = await getCurrentUser();

  const result = await getSuppliers({
    userId: user!.id,
    fetchAll: true,
  });

  const suppliers = result.success ? result.data.data : [];

  const countriesData = suppliers.reduce(
    (acc: Record<string, number>, supplier) => {
      const country = mapCountryCodeToName(supplier.addressCountry);
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="py-4">
      <CustomAccordion label="Suppliers country of origin statistics">
        {JSON.stringify(countriesData)}
      </CustomAccordion>
    </div>
  );
}
