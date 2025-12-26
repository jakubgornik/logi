"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CustomerFormSchema, customerSchema } from "./customer-form.validation";
import { ComboboxField } from "@/components/combobox-field";
import { countryOptions } from "../supplier/supplier-form.utils";

export function CustomerForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      isAppUser: false,
      appUserId: undefined,
      customerName: "",
      addressCountry: "",
      addressCity: "",
      addressStreet: "",
      addressPostalCode: "",
    },
  });

  const onSubmit = async (data: CustomerFormSchema) => {
    console.log("Form submitted with data:", data);
    // ..
  };

  //   TODO add mutations and app custoemr logic

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <>
              <div className="rounded-lg border p-3 bg-background/35">
                <div className="grid grid-cols-1">
                  <Field>
                    <FieldLabel
                      className="font-semibold text-muted-foreground"
                      htmlFor="customerName"
                    >
                      Customer Name
                    </FieldLabel>
                    <Controller
                      name="customerName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="customerName"
                          placeholder="Enter customer name"
                          aria-invalid={!!errors.customerName}
                        />
                      )}
                    />
                    <FieldError
                      errors={[errors.customerName]}
                      className="text-xs text-destructive"
                    />
                  </Field>
                </div>
              </div>
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
                      className="font-semibold text-muted-foreground"
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
                      className="font-semibold text-muted-foreground"
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
              </div>
            </>

            <div className="flex justify-end">
              <Button size="lg" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
