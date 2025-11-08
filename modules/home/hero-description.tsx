"use client";

import { motion, Variants } from "motion/react";

interface HeroDescriptionProps {
  variants: Variants;
}

export function HeroDescription({ variants }: HeroDescriptionProps) {
  return (
    <motion.p
      variants={variants}
      className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty leading-relaxed"
    >
      Join industry leaders who trust Logi to power their logistics operations.
      Start your free trial and experience the difference.
    </motion.p>
  );
}
