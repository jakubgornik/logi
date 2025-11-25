"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader as SidebarHeaderBase,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { SidebarIcon } from "lucide-react";

interface SidebarHeaderProps {
  onToggle: () => void;
}

export function SidebarHeader({ onToggle }: SidebarHeaderProps) {
  const { open, isMobile } = useSidebar();

  return (
    <SidebarHeaderBase>
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
            <Button size="icon" onClick={onToggle} className="h-8 w-8">
              <SidebarIcon />
            </Button>
          </SidebarGroupLabel>
        ) : (
          <div className="w-full flex justify-center items-center">
            <Button size="icon" onClick={onToggle} className="h-8 w-8">
              <SidebarIcon />
            </Button>
          </div>
        )}
      </SidebarGroup>
    </SidebarHeaderBase>
  );
}
