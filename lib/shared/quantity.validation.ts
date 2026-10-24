import { z } from "zod";

export const MAX_QUANTITY = 2_147_483_647;

export const quantitySchema = z
  .number({
    error: (issue) => {
      const isQuantityMissing =
        issue.input === undefined || Number.isNaN(issue.input);

      return isQuantityMissing
        ? "Quantity is required"
        : "Quantity must be a finite number";
    },
  })
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(MAX_QUANTITY, `Quantity must not exceed ${MAX_QUANTITY}`);
