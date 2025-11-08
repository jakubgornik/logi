import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { AuthenticationForm } from "./auth-form.validation";

interface AuthFormFieldsProps {
  control: Control<AuthenticationForm>;
  errors: FieldErrors<AuthenticationForm>;
}

export function AuthFormFields({ control, errors }: AuthFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Field>
        <FieldLabel className="font-semibold" htmlFor="email">
          Email
        </FieldLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input {...field} id="email" type="email" />}
        />
        {errors.email && <FieldError errors={[errors.email]} />}
      </Field>
      <Field>
        <FieldLabel className="font-semibold" htmlFor="password">
          Password
        </FieldLabel>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input {...field} id="password" type="password" />
          )}
        />
        {errors.password && <FieldError errors={[errors.password]} />}
      </Field>
    </div>
  );
}
