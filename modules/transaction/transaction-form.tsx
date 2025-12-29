"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/stepper";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { useCallback, useState } from "react";
import { canVisitStep } from "./transaction-form.utils";
import { TransactionFormFooter } from "./transaction-form-footer";

export enum TransactionFormSteps {
  DETAILS = "details",
  CUSTOMER = "customer",
  SUMMARY = "summary",
}

export const STEPS = [
  TransactionFormSteps.DETAILS,
  TransactionFormSteps.CUSTOMER,
  TransactionFormSteps.SUMMARY,
];

const nextStepMap: Partial<Record<TransactionFormSteps, TransactionFormSteps>> =
  {
    [TransactionFormSteps.DETAILS]: TransactionFormSteps.CUSTOMER,
    [TransactionFormSteps.CUSTOMER]: TransactionFormSteps.SUMMARY,
  };

const prevStepMap: Partial<Record<TransactionFormSteps, TransactionFormSteps>> =
  {
    [TransactionFormSteps.CUSTOMER]: TransactionFormSteps.DETAILS,
    [TransactionFormSteps.SUMMARY]: TransactionFormSteps.CUSTOMER,
  };

// todo
export const TransactionForm = () => {
  const [currentStep, setCurrentStep] = useQueryState<TransactionFormSteps>(
    "step",
    parseAsStringEnum<TransactionFormSteps>(
      Object.values(TransactionFormSteps)
    ).withDefault(TransactionFormSteps.DETAILS)
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<TransactionFormSteps>
  >(new Set());

  const checkStepValidity = useCallback(
    (stepId: string) => {
      return canVisitStep(
        stepId as TransactionFormSteps,
        completedSteps,
        STEPS
      );
    },
    [completedSteps]
  );

  const handleNextStep = useCallback(() => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });

    const nextStep = nextStepMap[currentStep];
    if (nextStep) setCurrentStep(nextStep);
  }, [currentStep, setCurrentStep]);

  const handlePrevStep = useCallback(() => {
    const prev = prevStepMap[currentStep];
    if (prev) setCurrentStep(prev);
  }, [currentStep, setCurrentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case TransactionFormSteps.DETAILS:
        return <div>Details Form Step</div>;
      case TransactionFormSteps.CUSTOMER:
        return <div>Customer Form Step</div>;
      case TransactionFormSteps.SUMMARY:
        return <div>Summary Step</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Create Transaction</CardTitle>
        </CardHeader>
        <Stepper
          steps={STEPS}
          currentStepId={currentStep}
          isStepValid={checkStepValidity}
          onStepClick={(stepId) => {
            if (checkStepValidity(stepId)) {
              setCurrentStep(stepId as TransactionFormSteps);
            }
          }}
        />
        <CardContent>
          <form className="flex flex-col gap-4">
            {renderStepContent()}
            <div className="flex justify-end gap-2">
              <TransactionFormFooter
                currentStep={currentStep}
                onBack={handlePrevStep}
                onNext={handleNextStep}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
