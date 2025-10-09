"use client";

import { Divider } from "@/components/divider";

interface HeroMarketingItemProps {
  label: string;
  icon: React.ReactNode;
  hideDivider?: boolean;
}

export const HeroMarketingItem = ({
  label,
  icon,
  hideDivider,
}: HeroMarketingItemProps) => {
  return (
    <>
      {!hideDivider && <Divider className="sm:block hidden" />}
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>
    </>
  );
};
