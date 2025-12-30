"use client";

import { useCallback, useEffect } from "react";

export const useRefreshWarning = (shouldBlock?: boolean) => {
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
      }
    },
    [shouldBlock]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock]);
};
