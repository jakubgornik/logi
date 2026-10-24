"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/stepper";
import { TransactionFormFooter } from "./transaction-form-footer";
import {
  TransactionFormSchema,
  createDetailsSchema,
  createConfirmationSchema,
} from "./transaction-form.validation";
import type { InventoryWithProduct } from "@/lib/fetchers/get-inventories";
import {
  canVisitStep,
  createTransactionDefaultValues,
  updateTransactionSavedBaseline,
} from "./transaction-form.utils";
import type { Customer } from "@/prisma/client/client";
import { useRefreshWarning } from "@/hooks/use-refresh-warning";
import { TransactionDetailsStep } from "./steps/transaction-details-step";
import { TransactionCustomerStep } from "./steps/transaction-customer-step";
import { TransactionSummaryStep } from "./steps/transaction-summary-step";
import {
  useConfirmTransaction,
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/transaction.hooks";
import type { TransactionWithItems } from "@/lib/fetchers/get-transaction";
import { SUB_ROUTES } from "@/lib/routes";
import { TransactionStatus } from "@/prisma/client/enums";

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
  transaction?: TransactionWithItems;
}

export const TransactionForm = ({
  inventories,
  customers,
  transaction,
}: TransactionFormProps) => {
  const [currentStep, setCurrentStep] = useQueryState<TransactionFormSteps>(
    "step",
    parseAsStringEnum<TransactionFormSteps>(
      Object.values(TransactionFormSteps),
    ).withDefault(TransactionFormSteps.DETAILS),
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<TransactionFormSteps>
  >(() => {
    if (transaction) {
      return new Set(STEPS);
    }
    return new Set();
  });
  const [transactionId, setTransactionId] = useState<string | null>(
    transaction?.id || null,
  );

  const isEditMode = !!transactionId;
  const submissionPendingRef = useRef(false);
  const confirmationCompleteRef = useRef(false);

  const detailsSchema = useMemo(
    () => createDetailsSchema(inventories),
    [inventories],
  );
  const confirmationSchema = useMemo(
    () => createConfirmationSchema(inventories),
    [inventories],
  );
  const currentSchema =
    currentStep === TransactionFormSteps.DETAILS
      ? detailsSchema
      : confirmationSchema;

  const methods = useForm<TransactionFormSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: createTransactionDefaultValues(transaction),
    mode: "onChange",
  });

  const { handleSubmit, formState } = methods;

  const { mutateAsync: createTransaction, isPending: isCreating } =
    useCreateTransaction();
  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();

  const {
    mutateAsync: confirmTransaction,
    isPending: isConfirming,
    isSuccess: isConfirmationSuccessful,
  } = useConfirmTransaction();

  const isConfirmed =
    isConfirmationSuccessful ||
    transaction?.status === TransactionStatus.CONFIRMED;
  const isLoading =
    isCreating || isUpdating || isConfirming || formState.isSubmitting;
  const isFormLocked = isLoading || isConfirmed;

  const isInteractionBlocked = useCallback(
    () =>
      isFormLocked ||
      submissionPendingRef.current ||
      confirmationCompleteRef.current,
    [isFormLocked],
  );

  const onStepSubmit = async (data: TransactionFormSchema) => {
    try {
      if (currentStep === TransactionFormSteps.SUMMARY) {
        if (!transactionId) {
          console.error("Missing transaction ID. Cannot confirm.");
          return;
        }
        await confirmTransaction({ id: transactionId, data });
        confirmationCompleteRef.current = true;
        return;
      }

      let createdDraftId: string | null = null;

      if (!transactionId) {
        const savedTransaction = await createTransaction(data);
        createdDraftId = savedTransaction.data.id;
        setTransactionId(createdDraftId);
      } else {
        await updateTransaction({ id: transactionId, data });
      }

      updateTransactionSavedBaseline(methods, data);

      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep);
        return next;
      });

      const nextStep = nextStepMap[currentStep];

      if (createdDraftId) {
        const savedDraftUrl = new URL(window.location.href);
        savedDraftUrl.pathname = SUB_ROUTES.TRANSACTION_EDIT(createdDraftId);

        if (nextStep) {
          savedDraftUrl.searchParams.set("step", nextStep);
        }

        // Keep the live form mounted so edits made during creation are preserved
        window.history.replaceState(null, "", savedDraftUrl);
      } else if (nextStep) {
        setCurrentStep(nextStep);
      }
    } catch (error) {
      console.error("Step error:", error);
    }
  };

  const handleBack = useCallback(() => {
    if (isInteractionBlocked()) return;

    const prev = prevStepMap[currentStep];
    if (prev) setCurrentStep(prev);
  }, [currentStep, isInteractionBlocked, setCurrentStep]);

  const checkStepValidity = useCallback(
    (stepId: string) => {
      if (isFormLocked) return false;

      return canVisitStep(
        stepId as TransactionFormSteps,
        completedSteps,
        STEPS,
      );
    },
    [completedSteps, isFormLocked],
  );

  const showValidationStep = (fieldNames: string[]) => {
    const hasInvalidDetails =
      fieldNames.includes("name") || fieldNames.includes("items");
    const invalidStep = hasInvalidDetails
      ? TransactionFormSteps.DETAILS
      : TransactionFormSteps.CUSTOMER;

    setCurrentStep(invalidStep);
  };

  const handleInvalidSubmit = (
    errors: FieldErrors<TransactionFormSchema>,
  ) => {
    showValidationStep(Object.keys(errors));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isInteractionBlocked()) return;

    submissionPendingRef.current = true;

    try {
      await handleSubmit(onStepSubmit, handleInvalidSubmit)(event);
    } finally {
      submissionPendingRef.current = false;
    }
  };

  const handleStepClick = (stepId: string) => {
    const isNavigationBlocked =
      isInteractionBlocked() || !checkStepValidity(stepId);

    if (isNavigationBlocked) return;

    const targetStep = stepId as TransactionFormSteps;
    const isMovingForward =
      STEPS.indexOf(targetStep) > STEPS.indexOf(currentStep);

    if (isMovingForward) {
      const targetSchema =
        targetStep === TransactionFormSteps.SUMMARY
          ? confirmationSchema
          : detailsSchema;
      const validation = targetSchema.safeParse(methods.getValues());

      methods.clearErrors();

      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          const fieldName = issue.path.join(
            ".",
          ) as FieldPath<TransactionFormSchema>;
          methods.setError(fieldName, {
            type: "validation",
            message: issue.message,
          });
        });
        showValidationStep(
          validation.error.issues.map((issue) => String(issue.path[0])),
        );
        return;
      }
    }

    setCurrentStep(targetStep);
  };

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

  const shouldBlockRefresh = methods.formState.isDirty && !isConfirmed;

  useRefreshWarning(shouldBlockRefresh);

  const requiresSavedDraft =
    currentStep !== TransactionFormSteps.DETAILS && !transactionId;

  useEffect(() => {
    if (requiresSavedDraft) {
      setCurrentStep(TransactionFormSteps.DETAILS);
    }
  }, [requiresSavedDraft, setCurrentStep]);

  return (
    <div className="p-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {isEditMode ? `Edit Transaction` : "Create Transaction"}
          </CardTitle>
        </CardHeader>
        <Stepper
          steps={STEPS}
          currentStepId={currentStep}
          isStepValid={checkStepValidity}
          onStepClick={handleStepClick}
        />
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <fieldset disabled={isFormLocked} className="contents">
                {renderStep()}
                <TransactionFormFooter
                  currentStep={currentStep}
                  onBack={handleBack}
                  isLoading={isLoading}
                  isSuccess={isConfirmed}
                />
              </fieldset>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
