"use client";

import Link from "next/link";
import { AuthVariant as AuthFormFooterProps } from "./auth-form.types";
import { ROUTES } from "@/lib/routes";

const AUTH_FOOTER = {
  signIn: {
    text: "Don't have an account?",
    linkText: "Sign up",
    href: ROUTES.SIGN_UP,
  },
  signUp: {
    text: "Already have an account?",
    linkText: "Sign in",
    href: ROUTES.SIGN_IN,
  },
} as const;

export function AuthFormFooter({ variant }: AuthFormFooterProps) {
  const authFooterVariant =
    variant === "signIn" ? AUTH_FOOTER.signIn : AUTH_FOOTER.signUp;

  return (
    <div className="flex gap-1  justify-center text-center text-sm text-muted-foreground">
      {authFooterVariant.text}
      <Link
        href={authFooterVariant.href}
        className="text-primary hover:underline font-medium inline"
      >
        {authFooterVariant.linkText}
      </Link>
    </div>
  );
}
