import type { TransactionWithItems } from "@/lib/fetchers/get-transaction";
import type { UseFormReturn } from "react-hook-form";
import type { TransactionFormSchema } from "./transaction-form.validation";

export const updateTransactionSavedBaseline = (
  {
    getValues,
    reset,
  }: Pick<UseFormReturn<TransactionFormSchema>, "getValues" | "reset">,
  savedValues: TransactionFormSchema,
) => {
  const currentValues = getValues();
  const keepCurrentInputState = {
    keepValues: true,
    keepErrors: true,
    keepTouched: true,
  };

  // Update the saved defaults, then recalculate dirtiness without replacing newer edits
  reset(savedValues, keepCurrentInputState);
  reset(currentValues, { ...keepCurrentInputState, keepDefaultValues: true });
};

export function canVisitStep<T>(
  targetStep: T,
  completedSteps: Set<T>,
  stepOrder: T[],
): boolean {
  const targetIndex = stepOrder.indexOf(targetStep);

  if (targetIndex === -1) return false;

  for (let i = 0; i < targetIndex; i++) {
    const previousStep = stepOrder[i];

    if (!completedSteps.has(previousStep)) {
      return false;
    }
  }

  return true;
}

export const createTransactionDefaultValues = (
  transaction?: TransactionWithItems | null,
): TransactionFormSchema => {
  const noItems = [{ productId: "", quantity: 0 }];

  if (!transaction) {
    return {
      name: "",
      customerId: "",
      items: noItems,
    };
  }

  return {
    name: transaction.name,
    customerId: transaction.customerId || "",
    items:
      transaction.items.length > 0
        ? transaction.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        : noItems,
  };
};
