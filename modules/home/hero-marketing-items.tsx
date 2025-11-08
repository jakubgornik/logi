"use client";

import { CheckCircleIcon } from "lucide-react";
import { motion, Variants } from "motion/react";
import { HeroMarketingItem } from "./hero-marketing-item";

const MARKETING_ITEMS = [
  { icon: CheckCircleIcon, text: "Scale effortlessly" },
  { icon: CheckCircleIcon, text: "Boost performance by 40%" },
  { icon: CheckCircleIcon, text: "Reduce costs instantly" },
];

interface HeroMarketingItemsProps {
  variants: Variants;
}

export const HeroMarketingItems = ({ variants }: HeroMarketingItemsProps) => {
  return (
    <motion.div
      variants={variants}
      className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-primary-foreground/80"
    >
      {MARKETING_ITEMS.map((el, index) => (
        <HeroMarketingItem
          key={index}
          label={el.text}
          icon={<el.icon />}
          hideDivider={index === 0}
        />
      ))}
    </motion.div>
  );
};
