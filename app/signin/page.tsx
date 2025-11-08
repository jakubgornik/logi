"use client";

import { AuthForm } from "@/modules/auth/auth-form";
import { InteractiveDots } from "@/modules/home/interactive-dots";
import { motion } from "motion/react";

export default function SignInPage() {
  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <motion.div className="h-full w-full bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center relative">
        <InteractiveDots />
        <AuthForm variant="signIn" />
      </motion.div>
    </section>
  );
}
