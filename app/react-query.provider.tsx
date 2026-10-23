"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { QueryUserIdContext } from "@/hooks/use-get-query-user-id";

interface ReactQueryProviderProps {
  children: React.ReactNode;
  userId?: string | null;
}

export default function ReactQueryProvider({
  children,
  userId = null,
}: ReactQueryProviderProps) {
  return (
    <QueryClientScope key={userId ?? "public"} userId={userId}>
      {children}
    </QueryClientScope>
  );
}

function QueryClientScope({ children, userId }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryUserIdContext.Provider value={userId ?? null}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryUserIdContext.Provider>
  );
}
