"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MultiSelectField } from "@/components/multi-select-field";
import { SCOPE_OPTIONS } from "@/lib/shared/consts";
import { UserFormSchema, userSchema } from "./user-form.validation";
import { createDefaultUserFormData } from "./user-form.utils";
import { User } from "@/prisma/client/client";

interface UserFormProps {
  user: User;
}

export const UserForm = ({ user }: UserFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: createDefaultUserFormData(user),
  });

  //   const { mutate: updateUser } = useUpdateUser();
  const onSubmit = (data: UserFormSchema) => {
    // updateUser({ id: userId, data });
  };

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="rounded-lg border p-3 bg-background/35">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="name"
                  >
                    User Name
                  </FieldLabel>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="Enter user name"
                        aria-invalid={!!errors.name}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.name]}
                    className="text-xs text-destructive"
                  />
                </Field>
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="scopes"
                  >
                    Scopes
                  </FieldLabel>
                  <Controller
                    name="scopes"
                    control={control}
                    render={({ field }) => (
                      <MultiSelectField
                        options={SCOPE_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select scopes"
                        ariaInvalid={!!errors.scopes}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.scopes]}
                    className="text-xs text-destructive"
                  />
                </Field>
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="lg" type="submit">
                Update User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
