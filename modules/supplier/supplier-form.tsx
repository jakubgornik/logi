"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SupplierFormSchema, supplierSchema } from "./supplier-form.validation";
import {
  countryOptions,
  createDefaultSupplierFormData,
} from "./supplier-form.utils";
import { ComboboxField } from "@/components/combobox-field";
import { MultiSelectField } from "@/components/multi-select-field";
import { SCOPE_OPTIONS } from "@/lib/shared/consts";
import { useCreateSupplier, useUpdateSupplier } from "@/hooks/supplier.hooks";
import { Loader2 } from "lucide-react";

interface SupplierFormProps {
  initialData?: SupplierFormSchema;
  supplierId?: string;
}

export const SupplierForm = ({
  initialData,
  supplierId,
}: SupplierFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormSchema>({
    resolver: zodResolver(supplierSchema),
    defaultValues: createDefaultSupplierFormData(initialData),
  });
  const isEditMode = !!supplierId;

  const {
    mutate: createSupplier,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
  } = useCreateSupplier();

  const {
    mutate: updateSupplier,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
  } = useUpdateSupplier();

  const isPending = isCreating || isUpdating;
  const isSuccess = isCreateSuccess || isUpdateSuccess;

  const onSubmit = (data: SupplierFormSchema) => {
    if (isEditMode && supplierId) {
      updateSupplier({ id: supplierId, data });
    } else {
      createSupplier(data);
    }
  };

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {isEditMode ? "Edit Supplier" : "Create Supplier"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="rounded-lg border p-3 bg-background/35">
              <div className="grid grid-cols-1">
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="name"
                  >
                    Supplier Name
                  </FieldLabel>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="Enter supplier name"
                        aria-invalid={!!errors.name}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.name]}
                    className="text-xs text-destructive"
                  />
                </Field>
              </div>
            </div>
            <div className="rounded-lg border p-3 bg-background/35">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="email"
                  >
                    Email
                  </FieldLabel>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        id="email"
                        type="email"
                        placeholder="supplier@example.com"
                        aria-invalid={!!errors.email}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.email]}
                    className="text-xs text-destructive"
                  />
                </Field>
                <Field>
                  <FieldLabel
                    className="font-semibold  text-muted-foreground"
                    htmlFor="phone"
                  >
                    Phone Number
                  </FieldLabel>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        id="phone"
                        type="tel"
                        placeholder="444 444 444"
                        aria-invalid={!!errors.phone}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.phone]}
                    className="text-xs text-destructive"
                  />
                </Field>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border p-3 bg-background/35 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Select a country..."
                          searchPlaceholder="Search country..."
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
                    <FieldLabel
                      className="font-semibold  text-muted-foreground"
                      htmlFor="addressCity"
                    >
                      City
                    </FieldLabel>
                    <Controller
                      name="addressCity"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="addressCity"
                          placeholder="New York"
                          aria-invalid={!!errors.addressCity}
                        />
                      )}
                    />
                    <FieldError
                      errors={[errors.addressCity]}
                      className="text-xs text-destructive"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      className="font-semibold  text-muted-foreground"
                      htmlFor="addressStreet"
                    >
                      Street Address
                    </FieldLabel>
                    <Controller
                      name="addressStreet"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="addressStreet"
                          placeholder="123 Main Street"
                          aria-invalid={!!errors.addressStreet}
                        />
                      )}
                    />
                    <FieldError
                      errors={[errors.addressStreet]}
                      className="text-xs text-destructive"
                    />
                  </Field>
                  <Field>
                    <FieldLabel
                      className="font-semibold text-muted-foreground"
                      htmlFor="addressPostalCode"
                    >
                      Postal Code
                    </FieldLabel>
                    <Controller
                      name="addressPostalCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="addressPostalCode"
                          placeholder="10001"
                          aria-invalid={!!errors.addressPostalCode}
                        />
                      )}
                    />
                    <FieldError
                      errors={[errors.addressPostalCode]}
                      className="text-xs text-destructive"
                    />
                  </Field>
                </div>
                <Field className="md:w-1/2 md:pr-2">
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
              <Button
                size="lg"
                type="submit"
                disabled={isPending || isSubmitting || isSuccess}
              >
                {(isPending || isSubmitting || isSuccess) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending
                  ? "Saving..."
                  : isEditMode
                  ? "Update Supplier"
                  : "Create Supplier"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
