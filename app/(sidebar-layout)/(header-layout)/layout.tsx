"use client";

import { normalizePath } from "@/lib/utils/normalize-path";
import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/supplier": "Suppliers",
  "/supplier/create": "Create Supplier",
  "/supplier/edit/[id]": "Edit Supplier",
  "/supplier/[id]": "Supplier Details",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = routeNames[normalizePath(pathname)];

  return (
    <>
      <div className="bg-sidebar w-full py-[0.2rem] sm:py-[0.72rem] border-t border-b">
        <h1 className="flex justify-center md:justify-start w-full font-semibold px-4 text-primary">
          {pageTitle}
        </h1>
      </div>
      {children}
    </>
  );
}
