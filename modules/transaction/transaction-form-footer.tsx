"use client";

import { Button } from "@/components/ui/button";
import { TransactionFormSteps } from "./transaction-form";

interface TransactionFormFooterProps {
  currentStep: TransactionFormSteps;
  onBack: () => void;
}

export function TransactionFormFooter({
  currentStep,
  onBack,
}: TransactionFormFooterProps) {
  const isFirstStep = currentStep === TransactionFormSteps.DETAILS;
  const isLastStep = currentStep === TransactionFormSteps.SUMMARY;

  return (
    <div className="flex justify-end gap-2 mt-4">
      {!isFirstStep && (
        <Button size="lg" variant="outline" onClick={onBack} type="button">
          Back
        </Button>
      )}
      {!isLastStep && (
        <Button size="lg" variant="secondary" type="submit">
          Save & Continue
        </Button>
      )}
      {isLastStep && (
        <Button size="lg" type="submit">
          Confirm Transaction
        </Button>
      )}
    </div>
  );
}
