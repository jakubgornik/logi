"use client";

import { useFormContext, Controller } from "react-hook-form";
import { User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Customer } from "@/prisma/client/client";
import { formatAddress } from "@/lib/utils/format-address";
import { TransactionFormSchema } from "../transaction-form.validation";

interface TransactionCustomerStepProps {
  customers: Customer[];
}

export const TransactionCustomerStep = ({
  customers = [],
}: TransactionCustomerStepProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TransactionFormSchema>();

  const selectedCustomerId = watch("customerId");
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleRemoveCustomer = () => {
    setValue("customerId", "", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/35">
        <CardContent className="pt-6 space-y-6">
          <Field>
            <FieldLabel
              className="font-semibold text-muted-foreground"
              htmlFor="customerId"
            >
              Select Customer
            </FieldLabel>
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger
                    id="customerId"
                    aria-invalid={!!errors.customerId}
                  >
                    <SelectValue placeholder="Select a customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError
              errors={[errors.customerId]}
              className="text-xs text-destructive"
            />
          </Field>

          {selectedCustomer && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10"
                onClick={handleRemoveCustomer}
                title="Remove customer"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove customer</span>
              </Button>

              <div className="p-4 flex flex-col gap-3 pr-12">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">
                        {selectedCustomer.customerName}
                      </h4>
                    </div>
                  </div>
                  {selectedCustomer.appUserId && (
                    <Badge variant="outline" className="text-xs">
                      Logi App User
                    </Badge>
                  )}
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-sm text-muted-foreground border border-border/50">
                  {formatAddress(
                    selectedCustomer.addressStreet!,
                    selectedCustomer.addressCity!,
                    selectedCustomer.addressPostalCode!,
                    selectedCustomer.addressCountry!
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
