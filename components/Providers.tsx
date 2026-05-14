"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";
import { Provider } from "react-redux";
import AuthHydrator from "./AuthHydrator";
import { SessionProvider } from "next-auth/react";
import { User } from "@/app/store/AuthSlice";
import { makeStore,AppStore } from "@/app/store/store";
import { Socket } from "dgram";
import { SocketProvider } from "./SocketContext";

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
  user: User | null;
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
        <SocketProvider>
        <AuthHydrator user={user} />
        {children} <ReactQueryDevtools initialIsOpen={false} />
        </SocketProvider>
      </QueryClientProvider>
    </Provider>
    </SessionProvider>
  );
}
