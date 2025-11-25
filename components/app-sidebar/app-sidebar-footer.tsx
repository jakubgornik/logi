"use client";

import {
  SidebarFooter as SidebarFooterBase,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut as LogOutIcon } from "lucide-react";

interface SidebarFooterProps {
  onLogout: () => void;
}

export function SidebarFooter({ onLogout }: SidebarFooterProps) {
  const { state } = useSidebar();

  return (
    <SidebarFooterBase className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={onLogout}
            tooltip={state === "collapsed" ? "Logout" : undefined}
            className="w-full cursor-pointer"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooterBase>
  );
}
