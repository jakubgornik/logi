"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarMenuItemsProps {
  items: MenuItem[];
}

export function SidebarMenuItems({ items }: SidebarMenuItemsProps) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={state === "collapsed" ? item.title : undefined}
                  className={cn(
                    "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                    isMobile && "justify-center"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span className={isMobile ? "hidden" : ""}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
