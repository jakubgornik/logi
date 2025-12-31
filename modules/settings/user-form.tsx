"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MultiSelectField } from "@/components/multi-select-field";
import { ComboboxField } from "@/components/combobox-field";
import { SCOPE_OPTIONS } from "@/lib/shared/consts";
import { countryOptions } from "../supplier/supplier-form.utils";
import { UserFormSchema, userSchema } from "./user-form.validation";
import { createDefaultUserFormData } from "./user-form.utils";
import { User } from "@/prisma/client/client";
import { useUpdateUser } from "@/hooks/user.hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UserFormProps {
  user: User;
}

export const UserForm = ({ user }: UserFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: createDefaultUserFormData(user),
  });

  const {
    mutate: updateUser,
    isPending: isUpdating,
    isSuccess,
  } = useUpdateUser();

  const isCustomerEnabled = watch("isCustomer");
  const isAlreadyLocked = user.isCustomer;

  const onSubmit = (data: UserFormSchema) => {
    updateUser({ id: user.id, data });
  };

  return (
    <div className="p-3 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Edit User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="rounded-lg border p-4 bg-background/35">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {isAlreadyLocked ? (
              <Alert className="border-primary/50 bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle>Business Profile Active</AlertTitle>
                <AlertDescription>
                  This user is registered as a customer and can receive
                  inventory transfers. Profile details are locked.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border p-2">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <Building2 className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        Enable Inventory Transactions?
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-md">
                        Would you like to receive products directly to your
                        inventory via transactions from other users?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {isCustomerEnabled ? "Yes" : "No"}
                    </span>
                    <Controller
                      name="isCustomer"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                {isCustomerEnabled && (
                  <div className="rounded-lg border p-4 bg-background/35">
                    <div className="mb-6 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-destructive">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold block mb-1">
                          Important Warning
                        </span>
                        Once you save these details, this user becomes a
                        permanent Customer entity. This operation{" "}
                        <span className="underline">cannot be undone</span> and
                        these fields will become read-only.
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <Field>
                        <FieldLabel className="font-semibold text-muted-foreground required-marker">
                          Business / Customer Name
                        </FieldLabel>
                        <Controller
                          name="customerName"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="e.g. Acme Corp Construction"
                            />
                          )}
                        />
                        <FieldError errors={[errors.customerName]} />
                      </Field>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel
                          className="font-semibold text-muted-foreground"
                          htmlFor="addressCountry"
                        >
                          Country
                        </FieldLabel>
                        <Controller
                          name="addressCountry"
                          control={control}
                          render={({ field }) => (
                            <ComboboxField
                              id="addressCountry"
                              fieldRef={field.ref}
                              options={countryOptions}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              placeholder="Select country..."
                              searchPlaceholder="Search..."
                              emptyMessage="No country found."
                              showIcons
                              ariaInvalid={!!errors.addressCountry}
                            />
                          )}
                        />
                        <FieldError
                          errors={[errors.addressCountry]}
                          className="text-xs text-destructive"
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="font-semibold text-muted-foreground required-marker">
                          City
                        </FieldLabel>
                        <Controller
                          name="addressCity"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="City"
                            />
                          )}
                        />
                        <FieldError errors={[errors.addressCity]} />
                      </Field>
                      <Field>
                        <FieldLabel className="font-semibold text-muted-foreground required-marker">
                          Street Address
                        </FieldLabel>
                        <Controller
                          name="addressStreet"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="123 Main St"
                            />
                          )}
                        />
                        <FieldError errors={[errors.addressStreet]} />
                      </Field>
                      <Field>
                        <FieldLabel className="font-semibold text-muted-foreground required-marker">
                          Postal Code
                        </FieldLabel>
                        <Controller
                          name="addressPostalCode"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="Zip Code"
                            />
                          )}
                        />
                        <FieldError errors={[errors.addressPostalCode]} />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button
                size="lg"
                type="submit"
                disabled={isUpdating || isSubmitting || isSuccess}
              >
                {(isUpdating || isSubmitting || isSuccess) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUpdating
                  ? "Saving..."
                  : isAlreadyLocked
                  ? "Update Basic Info"
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
