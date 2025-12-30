"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/stepper";
import { TransactionFormFooter } from "./transaction-form-footer";
import {
  TransactionFormSchema,
  createDetailsSchema,
  customerSchema,
} from "./transaction-form.validation";
import { InventoryWithProduct } from "@/lib/fetchers/get-inventories";
import { canVisitStep } from "./transaction-form.utils";
import { Customer, Transaction } from "@/prisma/client/client";
import { useRefreshWarning } from "@/hooks/use-refresh-warning";
import { TransactionDetailsStep } from "./steps/transaction-details-step";
import { TransactionCustomerStep } from "./steps/transaction-customer-step";
import { TransactionSummaryStep } from "./steps/transaction-summary-step";
import {
  useConfirmTransaction,
  useUpsertTransaction,
} from "@/hooks/transaction.hooks";

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
  customers: Customer[];
  transaction?: Transaction;
}

export const TransactionForm = ({
  inventories,
  customers,
  transaction,
}: TransactionFormProps) => {
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

  const isEdit = !!transaction;

  const methods = useForm<TransactionFormSchema>({
    resolver: currentSchema ? zodResolver(currentSchema) : undefined,
    defaultValues: {
      name: "",
      items: [{ productId: "", quantity: 0 }],
      customerId: "",
    },
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const { mutate: confirmTransaction } = useConfirmTransaction();
  const { mutate: upsertTransaction } = useUpsertTransaction();

  const onStepSubmit = async (data: TransactionFormSchema) => {
    if (currentStep === TransactionFormSteps.SUMMARY) {
      confirmTransaction(data);
      return;
    }
    try {
      upsertTransaction(data);

      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep);
        return next;
      });

      const nextStep = nextStepMap[currentStep];
      if (nextStep) setCurrentStep(nextStep);
    } catch (error) {
      console.error(error);
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

  const renderStep = () => {
    switch (currentStep) {
      case TransactionFormSteps.DETAILS:
        return <TransactionDetailsStep inventories={inventories} />;
      case TransactionFormSteps.CUSTOMER:
        return <TransactionCustomerStep customers={customers} />;
      case TransactionFormSteps.SUMMARY:
        return (
          <TransactionSummaryStep
            inventories={inventories}
            customers={customers}
          />
        );
      default:
        return null;
    }
  };

  useRefreshWarning(methods.formState.isDirty && !isEdit);

  useEffect(() => {
    if (currentStep !== TransactionFormSteps.DETAILS && !isEdit) {
      setCurrentStep(TransactionFormSteps.DETAILS);
    }
  }, []);

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {isEdit
              ? `Edit Transaction: ${transaction.name}`
              : "Create Transaction"}
          </CardTitle>
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
              {renderStep()}
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
