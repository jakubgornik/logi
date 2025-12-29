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
