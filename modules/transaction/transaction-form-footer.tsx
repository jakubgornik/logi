"use client";

import { Button } from "@/components/ui/button";
import { TransactionFormSteps } from "./transaction-form";
import { Loader2 } from "lucide-react";

interface TransactionFormFooterProps {
  currentStep: TransactionFormSteps;
  onBack: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}

export function TransactionFormFooter({
  currentStep,
  onBack,
  isLoading,
  isSuccess,
}: TransactionFormFooterProps) {
  const isFirstStep = currentStep === TransactionFormSteps.DETAILS;
  const isLastStep = currentStep === TransactionFormSteps.SUMMARY;

  return (
    <div className="flex justify-end gap-2 mt-4">
      {!isFirstStep && (
        <Button
          size="lg"
          variant="outline"
          onClick={onBack}
          type="button"
          disabled={isLoading || isSuccess}
        >
          Back
        </Button>
      )}
      {!isLastStep && (
        <Button
          size="lg"
          variant="secondary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save & Continue"}
        </Button>
      )}
      {isLastStep && (
        <Button size="lg" type="submit" disabled={isLoading || isSuccess}>
          {(isLoading || isSuccess) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isSuccess
            ? "Redirecting..."
            : isLoading
            ? "Confirming..."
            : "Confirm Transaction"}
        </Button>
      )}
    </div>
  );
}
