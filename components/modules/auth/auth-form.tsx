"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion"; // Note: motion is from framer-motion
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthenticationForm,
  authenticationSchema,
} from "./auth-form.validation";
import { itemVariants } from "../home/animation-variants/variants";
import { AuthFormHeader } from "./auth-form-header";
import { AuthFormFields } from "./auth-form-fields";
import { Button } from "@/components/ui/button";
import { AuthFormFooter } from "./auth-form-footer";
import { AuthVariant as AuthFormProps } from "./auth-form.types";
import { useSignUp } from "@/hooks/use-signup";
import { useSignIn } from "@/hooks/use-signin";
import { Spinner } from "@/components/ui/spinner";

export const AuthForm = ({ variant }: AuthFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticationForm>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signUp, isPending: isSigningUp } = useSignUp();
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();

  const isLoading = isSigningUp || isSigningIn;

  const onSubmit = (data: AuthenticationForm) => {
    if (variant === "signIn") {
      signIn(data);
    } else {
      signUp(data);
    }
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="relative z-[999] p-8 shadow-2xl border-0">
        <div className="space-y-8">
          <AuthFormHeader variant={variant} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthFormFields control={control} errors={errors} />
            <Button
              size="lg"
              className="w-full mt-3"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : variant === "signIn" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          <AuthFormFooter variant={variant} />
        </div>
      </Card>
    </motion.div>
  );
};
