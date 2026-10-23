"use client";

import { createContext, useContext } from "react";

export const QueryUserIdContext = createContext<string | null>(null);

export function useGetQueryUserId() {
  const userId = useContext(QueryUserIdContext);

  if (!userId) {
    throw new Error("Private queries require an authenticated query provider.");
  }

  return userId;
}
