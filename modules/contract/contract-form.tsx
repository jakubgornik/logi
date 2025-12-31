"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FilteredSupplierSelect } from "@/components/filtered-supplier-select";
import { useCreateContract } from "@/hooks/contract.hooks";
import {
  contractFormSchema,
  ContractFormSchema,
} from "./contract-form.validation";
import { createDefaultContractFormData } from "./contract-form.utils";
import { Scope } from "@/prisma/client/enums";
import { Supplier } from "@/prisma/client/browser";

interface ContractFormProps {
  suppliers: Supplier[];
  userScopes: Scope[];
}

export const ContractForm = ({ suppliers, userScopes }: ContractFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormSchema>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: createDefaultContractFormData(),
  });

  const { mutate: createContract, isPending, isSuccess } = useCreateContract();

  const onSubmit = (data: ContractFormSchema) => {
    createContract(data);
  };
  const isDateDisabled = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Create Contract</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-3 p-2 rounded-lg border border-primary/50 bg-primary/5 text-sm">
            Please review all contract details carefully before submission. You
            are only allowed to register a contract with a supplier that has the
            same scope.
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="rounded-lg border p-3 bg-background/35">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="title"
                  >
                    Contract title
                  </FieldLabel>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="title"
                        placeholder="Contract title"
                        aria-invalid={!!errors.title}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.title]}
                    className="text-xs text-destructive"
                  />
                </Field>
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="validUntil"
                  >
                    Contract valid until
                  </FieldLabel>
                  <Controller
                    name="validUntil"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-background/35",
                              !field.value && "text-muted-foreground",
                              errors.validUntil &&
                                "border-destructive text-destructive"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={isDateDisabled}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  <FieldError
                    errors={[errors.validUntil]}
                    className="text-xs text-destructive"
                  />
                </Field>
                <Field className="col-span-2">
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="supplierId"
                  >
                    Select Supplier
                  </FieldLabel>
                  <Controller
                    name="supplierId"
                    control={control}
                    render={({ field }) => (
                      <FilteredSupplierSelect
                        userScopes={userScopes}
                        suppliers={suppliers}
                        value={field.value}
                        onValueChange={field.onChange}
                        ariaInvalid={!!errors.supplierId}
                        placeholder="Select supplier"
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.supplierId]}
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
                {isPending ? "Saving..." : "Create Contract"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
