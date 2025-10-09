"use client";

import { motion, Variants } from "motion/react";

interface HeroTitleProps {
  variants: Variants;
}

export const HeroTitle = ({ variants }: HeroTitleProps) => {
  return (
    <motion.h2
      variants={variants}
      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground text-balance leading-tight"
    >
      Transform your supply chain today
    </motion.h2>
  );
};
