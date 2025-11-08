"use client";

import { AuthVariant as AuthFormHeaderProps } from "./auth-form.types";

const AUTH_HEADER = {
  signIn: {
    title: "Welcome back",
    description: "Sign in to your account and continue your journey with Logi",
  },
  signUp: {
    title: "Create your account",
    description:
      "Start your journey with Logi and transform your logistics operations",
  },
} as const;

export function AuthFormHeader({ variant }: AuthFormHeaderProps) {
  const authHeaderVariant =
    variant === "signIn" ? AUTH_HEADER.signIn : AUTH_HEADER.signUp;

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold text-balance">
        {authHeaderVariant.title}
      </h1>
      <p className="text-muted-foreground text-pretty">
        {authHeaderVariant.description}
      </p>
    </div>
  );
}
