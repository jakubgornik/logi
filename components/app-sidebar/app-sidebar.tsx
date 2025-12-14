"use client";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { HomeIcon, Indent, Folder, Settings, Package } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";
import { SidebarHeader } from "./app-sidebar-header";
import { SidebarMenuItems } from "./app-sidebar-menu-items";
import { SidebarFooter } from "./app-sidebar-footer";
import { ROUTES } from "@/lib/routes";

const SIDEBAR_MENU = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: HomeIcon,
  },
  {
    title: "Suppliers",
    url: ROUTES.SUPPLIER,
    icon: Indent,
  },
  {
    title: "Contracts",
    url: ROUTES.CONTRACT,
    icon: Folder,
  },
  {
    title: "Products",
    url: ROUTES.PRODUCT,
    icon: Package,
  },
  {
    title: "Settings",
    url: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function AppSidebar() {
  const { mutate: logout } = useLogout();
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar();

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(state === "expanded" ? false : true);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader onToggle={toggleSidebar} />
      <SidebarContent>
        <SidebarMenuItems items={SIDEBAR_MENU} />
      </SidebarContent>
      <SidebarFooter onLogout={handleLogout} />
    </Sidebar>
  );
}
