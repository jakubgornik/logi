"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { TransactionFormSchema } from "../transaction-form.validation";
import { InventoryWithProduct } from "@/lib/fetchers/get-inventories";

interface TransactionDetailsStepProps {
  inventories: InventoryWithProduct[];
}

interface TransactionItemProps {
  index: number;
  inventories: InventoryWithProduct[];
  onRemove: () => void;
  isRemoveDisabled: boolean;
  items: TransactionFormSchema["items"];
}

export const TransactionDetailsStep = ({
  inventories = [],
}: TransactionDetailsStepProps) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<TransactionFormSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  return (
    <div className="space-y-6">
      <Card className="bg-background/35">
        <CardContent className="pt-6">
          <Field>
            <FieldLabel
              className="font-semibold text-muted-foreground"
              htmlFor="transactionName"
            >
              Transaction Name
            </FieldLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="transactionName"
                  placeholder="Transaction name"
                  aria-invalid={!!errors.name}
                />
              )}
            />
            <FieldError
              errors={[errors.name]}
              className="text-xs text-destructive"
            />
          </Field>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <TransactionItem
            key={field.id}
            index={index}
            inventories={inventories}
            onRemove={() => remove(index)}
            isRemoveDisabled={fields.length === 1}
            items={items}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ productId: "", quantity: 0 })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add another product
      </Button>
    </div>
  );
};

const TransactionItem = ({
  index,
  inventories,
  onRemove,
  isRemoveDisabled,
  items,
}: TransactionItemProps) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<TransactionFormSchema>();

  const selectedProductId = watch(`items.${index}.productId`);
  const currentItemErrors = errors.items?.[index];

  const getMaxQuantity = (prodId: string) => {
    return inventories.find((i) => i.productId === prodId)?.quantity || 0;
  };

  const maxQuantity = getMaxQuantity(selectedProductId);

  return (
    <Card className="bg-background/35 relative group">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10"
        onClick={onRemove}
        disabled={isRemoveDisabled}
        title="Remove item"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove item</span>
      </Button>
      <CardContent className="flex flex-col md:flex-row gap-4 items-start pt-6 pr-12 pb-6">
        <Field className="flex-1 w-full">
          <FieldLabel
            className="font-semibold text-muted-foreground"
            htmlFor={`items.${index}.productId`}
          >
            Select Product
          </FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.productId`}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger
                  id={`items.${index}.productId`}
                  aria-invalid={!!currentItemErrors?.productId}
                >
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {inventories.map((inventoryItem) => {
                    const isSelected = items?.some(
                      (item, itemIndex) =>
                        item.productId === inventoryItem.productId &&
                        itemIndex !== index
                    );
                    return (
                      <SelectItem
                        key={inventoryItem.productId}
                        value={inventoryItem.productId}
                        disabled={isSelected}
                        className={isSelected ? "opacity-50" : ""}
                      >
                        {inventoryItem.product.name}
                        {isSelected && " (Selected)"}
                        {!isSelected && ` (Avail: ${inventoryItem.quantity})`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError
            errors={[currentItemErrors?.productId]}
            className="text-xs text-destructive"
          />
        </Field>
        <Field className="w-full md:w-40">
          <FieldLabel
            className="font-semibold text-muted-foreground"
            htmlFor={`items.${index}.quantity`}
          >
            Quantity
          </FieldLabel>
          <Controller
            control={control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <Input
                {...field}
                id={`items.${index}.quantity`}
                type="number"
                placeholder="Qty"
                min={1}
                max={maxQuantity}
                disabled={!selectedProductId}
                aria-invalid={!!currentItemErrors?.quantity}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            )}
          />
          <FieldError
            errors={[currentItemErrors?.quantity]}
            className="text-xs text-destructive"
          />
        </Field>
      </CardContent>
    </Card>
  );
};
