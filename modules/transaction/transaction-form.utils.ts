import { TransactionWithItems } from "@/lib/fetchers/get-transaction";
import { TransactionFormSchema } from "./transaction-form.validation";

export function canVisitStep<T>(
  targetStep: T,
  completedSteps: Set<T>,
  stepOrder: T[]
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
  transaction?: TransactionWithItems | null
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
