"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboboxField } from "@/components/combobox-field";
import { countryOptions } from "../supplier/supplier-form.utils";
import { CustomerFormSchema, customerSchema } from "./customer-form.validation";
import { AppUserSearchResult } from "./customer.types";
import { defaultFormValues } from "./customer-form.utils";
import { useCreateCustomer } from "@/hooks/customer.hooks";
import { useGetAppUsersToLink } from "@/hooks/user.hooks";

export function CustomerForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [selectedUser, setSelectedUser] = useState<AppUserSearchResult | null>(
    null
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultFormValues,
  });

  const { mutate: createCustomer } = useCreateCustomer();
  const { data, isLoading } = useGetAppUsersToLink({
    search: debouncedQuery,
  });
  const appUsers = useMemo(() => data || [], [data]);

  const handleModeToggle = (checked: boolean) => {
    reset({
      ...defaultFormValues,
      isAppUser: checked,
    });
    setSearchQuery("");
    setSelectedUser(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user: AppUserSearchResult) => {
    setValue("appUserId", user.id, { shouldValidate: true });
    setSearchQuery("");
    setSelectedUser(user);
  };

  const handleUserClear = () => {
    setValue("appUserId", undefined);
    setSearchQuery("");
    setSelectedUser(null);
  };

  const onSubmit = async (data: CustomerFormSchema) => {
    createCustomer(data);
  };

  const isAppUser = watch("isAppUser");
  const noResults =
    !selectedUser && debouncedQuery && appUsers.length === 0 && !isLoading;

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="rounded-lg p-4 border border-primary/50 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">
                    Link to a registered user to enable inventory transfers.
                  </p>
                </div>
                <Controller
                  name="isAppUser"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isAppUser"
                      checked={field.value}
                      onCheckedChange={(checked) => handleModeToggle(checked)}
                    />
                  )}
                />
              </div>
            </div>
            {isAppUser ? (
              <div className="space-y-4">
                {!selectedUser && (
                  <Field>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={handleSearch}
                        autoComplete="off"
                      />
                      {isLoading && (
                        <div className="absolute right-3 top-2.5">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <FieldError errors={[errors.appUserId]} className="mt-1" />
                  </Field>
                )}
                {!selectedUser && appUsers.length > 0 && (
                  <div className="rounded-md border bg-background">
                    <div className="bg-muted/50 px-3 py-1.5 border-b">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Results
                      </span>
                    </div>
                    <ScrollArea className="h-48">
                      <div className="p-1">
                        {appUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="w-full flex items-center gap-3 p-2 rounded-sm hover:bg-accent text-left transition-colors group"
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              {(user.customerName || "U")[0]}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium leading-none">
                                {user.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {user.email}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                {noResults && (
                  <div className="text-center py-4 text-xs text-muted-foreground border rounded-md border-dashed">
                    No users found matching "{debouncedQuery}"
                  </div>
                )}
                {selectedUser && (
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {selectedUser.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedUser.email}
                          </p>
                          <div className="mt-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded inline-block">
                            Address details linked automatically
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleUserClear}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border p-4 bg-background/50">
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
                          placeholder="John Doe Construction"
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
                <div className="rounded-lg border p-4 bg-background/50 space-y-4">
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
                            placeholder="Main Street 101"
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
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button size="lg" type="submit">
                {isAppUser ? "Link App User" : "Create Customer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
