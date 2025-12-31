"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useMemo } from "react";
import { IContractWithSupplier } from "../contract/contract.types";
import { PRODUCTS } from "@/lib/shared/consts";
import { Scope } from "@/prisma/client/enums";
import { useAddInventory } from "@/hooks/inventory.hooks";
import {
  InventoryFormSchema,
  inventorySchema,
} from "./inventory-form.validation";
import { Loader2 } from "lucide-react";

interface InventoryFormProps {
  contracts: IContractWithSupplier[];
  userScopes: Scope[];
}

export const InventoryForm = ({
  contracts,
  userScopes,
}: InventoryFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      contractId: "",
      name: "",
      quantity: 1,
    },
  });

  const selectedContractId = watch("contractId");

  const selectedContract = useMemo(() => {
    return contracts.find((c) => c.id === selectedContractId);
  }, [selectedContractId, contracts]);

  const commonScopes = useMemo(() => {
    if (!selectedContract) return [];
    return userScopes.filter((scope) =>
      selectedContract.supplier.scopes.includes(scope)
    );
  }, [selectedContract, userScopes]);

  const availableProducts = useMemo(() => {
    if (!selectedContract || commonScopes.length === 0) return [];

    return PRODUCTS.filter((product) => commonScopes.includes(product.scope));
  }, [selectedContract, commonScopes]);

  const canAddProducts = useMemo(() => {
    if (!selectedContract) return false;
    return commonScopes.length > 0;
  }, [selectedContract, commonScopes]);

  const {
    mutate: addProductToInventory,
    isSuccess,
    isPending,
  } = useAddInventory();

  const onSubmit = (data: InventoryFormSchema) => {
    addProductToInventory(data);
  };

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Add Products to Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="rounded-lg border p-3 bg-background/35 space-y-4">
              <div className="grid grid-cols-1">
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="contractId"
                  >
                    Select Contract
                  </FieldLabel>
                  <Controller
                    name="contractId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("name", "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger
                          id="contractId"
                          aria-invalid={!!errors.contractId}
                        >
                          <SelectValue placeholder="Choose a contract..." />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              No active contracts found.
                            </div>
                          ) : (
                            contracts.map((contract) => (
                              <SelectItem key={contract.id} value={contract.id}>
                                <div className="flex flex-col items-start text-left">
                                  <span className="font-medium">
                                    {contract.title}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError
                    errors={[errors.contractId]}
                    className="text-xs text-destructive"
                  />
                </Field>
              </div>
              {selectedContract && !canAddProducts && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm">
                  <p className="font-medium">
                    You don't have the required capabilities to add products for
                    this contract.
                  </p>
                  <p className="text-xs mt-1">
                    Your capabilities don't match with the supplier's
                    capabilities.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    className="font-semibold text-muted-foreground"
                    htmlFor="name"
                  >
                    Select Product
                  </FieldLabel>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          const selectedProduct = PRODUCTS.find(
                            (p) => p.name === val
                          );
                          if (selectedProduct) {
                            setValue("scope", selectedProduct.scope);
                          }
                        }}
                        value={field.value}
                        disabled={!selectedContractId || !canAddProducts}
                      >
                        <SelectTrigger id="name" aria-invalid={!!errors.name}>
                          <SelectValue
                            placeholder={
                              !selectedContractId
                                ? "Select contract first"
                                : !canAddProducts
                                ? "No matching capabilities"
                                : "Choose a product..."
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              No products available for your capabilities.
                            </div>
                          ) : (
                            availableProducts.map((product) => (
                              <SelectItem
                                key={product.name}
                                value={product.name}
                              >
                                {product.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
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
                    htmlFor="quantity"
                  >
                    Quantity
                  </FieldLabel>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="quantity"
                        type="number"
                        min={1}
                        placeholder="Enter amount"
                        aria-invalid={!!errors.quantity}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={!canAddProducts}
                      />
                    )}
                  />
                  <FieldError
                    errors={[errors.quantity]}
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
                {isPending ? "Saving..." : "Confirm & Add Inventory"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
