import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";
import { SupplierTable } from "@/modules/supplier/supplier-table";
import { PaginatedResponse } from "@/lib/types/common.types";
import { ISupplier } from "@/modules/supplier/supplier.types";
import { redirect } from "next/navigation";

export default async function SupplierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const result = await getSuppliers({});

  let initialData: PaginatedResponse<ISupplier> | undefined;

  if (result.success && result.data) {
    initialData = {
      data: result.data,
      totalCount: result.totalCount!,
      totalPages: result.totalPages!,
      page: result.page!,
      pageSize: result.pageSize!,
    };
  }

  return (
    <div>
      <SupplierTable initialData={initialData} />
    </div>
  );
}
