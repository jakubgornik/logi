"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut as LogOutIcon, SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { mutate: logout } = useLogout();
  const { state, open, setOpen, isMobile, setOpenMobile } = useSidebar();

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
      <SidebarHeader>
        <SidebarGroup className={cn(open && !isMobile && "border-b")}>
          {open ? (
            <SidebarGroupLabel
              className={clsx(
                "flex items-center w-full",
                isMobile ? "justify-center" : "justify-between"
              )}
            >
              {!isMobile && (
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-lg font-extrabold text-primary">Logi</h1>
                </div>
              )}
              <Button size="icon" onClick={toggleSidebar} className="h-8 w-8">
                <SidebarIcon />
              </Button>
            </SidebarGroupLabel>
          ) : (
            <div className="w-full flex justify-center items-center ">
              <Button size="icon" onClick={toggleSidebar} className="h-8 w-8">
                <SidebarIcon />
              </Button>
            </div>
          )}
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={state === "collapsed" ? "Logout" : undefined}
              className="w-full cursor-pointer"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
