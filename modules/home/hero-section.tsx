"use client";

import { motion } from "motion/react";
import { HeroContent } from "./hero-content";
import { containerVariants, itemVariants } from "./animation-variants/variants";
import { InteractiveDots } from "./interactive-dots";

export const HeroSection = () => {
  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <motion.div className="h-full w-full bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center relative">
        <InteractiveDots />
        <HeroContent
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      </motion.div>
    </section>
  );
};
