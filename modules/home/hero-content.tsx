"use client";

import { motion, Variants } from "motion/react";
import { HeroTitle } from "./hero-title";
import { HeroDescription } from "./hero-description";
import { HeroCTA } from "./hero-cta";
import { HeroMarketingItems } from "./hero-marketing-items";

interface HeroContentProps {
  containerVariants: Variants;
  itemVariants: Variants;
}

export const HeroContent = ({
  containerVariants,
  itemVariants,
}: HeroContentProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-3xl mx-auto space-y-8 px-4 text-center"
    >
      <HeroTitle variants={itemVariants} />
      <HeroDescription variants={itemVariants} />
      <HeroCTA variants={itemVariants} />
      <HeroMarketingItems variants={itemVariants} />
    </motion.div>
  );
};
