"use client";

import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SidebarIcon } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarInset>
      <nav className="flex justify-between sticky h-16 shrink-0 items-center px-4 border-b md:hidden bg-card">
        <Button
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="mr-2"
        >
          <SidebarIcon />
        </Button>
        <h1 className="text-2xl font-extrabold text-secondary">Logi</h1>
        <div className="w-8" />
      </nav>
      <main className="flex flex-1 flex-col">{children}</main>
    </SidebarInset>
  );
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  );
}
