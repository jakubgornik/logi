"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "motion/react";
import Link from "next/link";

interface HeroCTAProps {
  variants: Variants;
}

export const HeroCTA = ({ variants }: HeroCTAProps) => {
  return (
    <motion.div variants={variants} className="flex justify-center pt-4">
      <Button variant="outline" size="lg" asChild className="font-semibold">
        <Link href="/signup">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </motion.div>
  );
};
