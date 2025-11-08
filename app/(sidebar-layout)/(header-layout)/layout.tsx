"use client";

import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="bg-sidebar w-full py-[0.2rem] sm:py-[0.72rem] border-t border-b">
        <h1 className="font-semibold px-4 text-primary">
          {routeNames[pathname]} Page
        </h1>
      </div>
      {children}
    </>
  );
}
