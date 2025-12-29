"use client";

import { useMemo, useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/stepper";
import { TransactionFormFooter } from "./transaction-form-footer";
import { TransactionDetailsStep } from "./transaction-details-step";
import {
  TransactionFormSchema,
  createDetailsSchema,
  customerSchema,
} from "./transaction-form.validation";
import { InventoryWithProduct } from "@/lib/fetchers/get-inventories";
import { canVisitStep } from "./transaction-form.utils";

export enum TransactionFormSteps {
  DETAILS = "details",
  CUSTOMER = "customer",
  SUMMARY = "summary",
}

const STEPS: TransactionFormSteps[] = [
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

interface TransactionFormProps {
  inventories: InventoryWithProduct[];
}

export const TransactionForm = ({ inventories }: TransactionFormProps) => {
  const [currentStep, setCurrentStep] = useQueryState<TransactionFormSteps>(
    "step",
    parseAsStringEnum<TransactionFormSteps>(
      Object.values(TransactionFormSteps)
    ).withDefault(TransactionFormSteps.DETAILS)
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<TransactionFormSteps>
  >(new Set());

  const currentSchema = useMemo(() => {
    switch (currentStep) {
      case TransactionFormSteps.DETAILS:
        return createDetailsSchema(inventories);
      case TransactionFormSteps.CUSTOMER:
        return customerSchema;
      default:
        return createDetailsSchema(inventories);
    }
  }, [currentStep, inventories]);

  const methods = useForm<TransactionFormSchema>({
    resolver: currentSchema ? (zodResolver(currentSchema) as any) : undefined,
    defaultValues: {
      items: [{ productId: "", quantity: 0 }],
      name: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, getValues } = methods;

  const onStepSubmit = (data: TransactionFormSchema) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });
    if (currentStep === TransactionFormSteps.SUMMARY) {
      console.log("confirm", data);
    } else {
      const nextStep = nextStepMap[currentStep];
      if (nextStep) setCurrentStep(nextStep);
    }
  };

  const handleBack = useCallback(() => {
    const prev = prevStepMap[currentStep];
    if (prev) setCurrentStep(prev);
  }, [currentStep, setCurrentStep]);

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
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onStepSubmit)}
              className="flex flex-col gap-4"
            >
              {currentStep === TransactionFormSteps.DETAILS && (
                <TransactionDetailsStep inventories={inventories} />
              )}
              {currentStep === TransactionFormSteps.CUSTOMER && (
                <h3 className="font-bold mb-2">Customer step</h3>
              )}
              {currentStep === TransactionFormSteps.SUMMARY && (
                <div className="bg-muted p-4 rounded-md text-sm font-mono">
                  <h3 className="font-bold mb-2">Summary step</h3>
                  <pre>{JSON.stringify(getValues(), null, 2)}</pre>
                </div>
              )}
              <TransactionFormFooter
                currentStep={currentStep}
                onBack={handleBack}
              />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
