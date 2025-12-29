"use client";

import { cn } from "@/lib/utils";

export interface StepperProps {
  steps: string[];
  currentStepId: string;
  onStepClick?: (id: string) => void;
  isStepValid?: (id: string) => boolean;
}

export function Stepper({
  steps,
  currentStepId,
  onStepClick,
  isStepValid,
}: StepperProps) {
  const activeIndex = steps.indexOf(currentStepId);

  return (
    <div className="px-6 mb-6">
      <div className="flex gap-3">
        {steps.map((stepId, index) => {
          const isActive = index <= activeIndex;
          const isValid = isStepValid ? isStepValid(stepId) : true;
          return (
            <div key={stepId} className="flex-1 group relative">
              <button
                type="button"
                disabled={!isValid}
                onClick={() => onStepClick?.(stepId)}
                className={cn(
                  "h-2 w-full rounded-md transition-all duration-500 ease-out",
                  "focus:outline-none",
                  isValid && onStepClick
                    ? "cursor-pointer group-active:scale-y-110"
                    : "cursor-not-allowed opacity-50",
                  isActive
                    ? "bg-primary shadow-md shadow-primary/20"
                    : "bg-muted"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
