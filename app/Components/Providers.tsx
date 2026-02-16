"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";
import { AppStore, makeStore } from "../lib/store";
import { Provider } from "react-redux";
import { user } from "../lib/AuthSlice";
import AuthHydrator from "./AuthHydrator";
import { SessionProvider } from "next-auth/react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});
export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: user | null;
}) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  return (
    <SessionProvider>
    <Provider store={storeRef.current}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator user={user} />
        {children} <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
    </SessionProvider>
  );
}
