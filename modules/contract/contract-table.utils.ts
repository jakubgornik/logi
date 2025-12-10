import { differenceInDays, startOfDay } from "date-fns";
import { ContractTimeStatus, DerivedContractStatus } from "./contract.types";
import { cva } from "class-variance-authority";

export const getContractTimeStatus = (validUntil: Date) => {
  const today = startOfDay(new Date());
  const validUntilDate = startOfDay(validUntil);
  const days = differenceInDays(validUntilDate, today);

  let status: ContractTimeStatus = "good";
  let label = `${days} days`;

  switch (true) {
    case days < 0:
      status = "expired";
      label = "Expired";
      break;
    case days === 0:
      status = "critical";
      label = "Ends today";
      break;
    case days <= 30:
      status = "critical";
      break;
    case days <= 120:
      status = "warning";
      break;
    default:
      status = "good";
  }

  return { label, status, days };
};

export const getDerivedContractStatus = (
  validUntil: Date
): DerivedContractStatus => {
  const today = startOfDay(new Date());
  const validUntilDate = startOfDay(validUntil);

  if (validUntilDate < today) {
    return "EXPIRED";
  }
  return "ACTIVE";
};

export const contractStatusVariants = cva(
  "capitalize shadow-sm border px-2 py-0.5",
  {
    variants: {
      status: {
        ACTIVE:
          "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/50",
        EXPIRED:
          "bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 border-slate-500/50",
      },
    },
    defaultVariants: {
      status: "ACTIVE",
    },
  }
);

export const timeRemainingVariants = cva("truncate font-medium", {
  variants: {
    status: {
      expired: "text-muted-foreground",
      critical: "text-destructive",
      warning: "text-amber-500",
      good: "text-emerald-600",
    },
  },
  defaultVariants: {
    status: "good",
  },
});
