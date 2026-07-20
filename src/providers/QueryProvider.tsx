import NetInfo from "@react-native-community/netinfo";
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        return NetInfo.addEventListener((state) => {
            onlineManager.setOnline(Boolean(state.isConnected));
        });
    }, []);

    useEffect(() => {
        const sub = AppState.addEventListener("change", (status) => {
            focusManager.setFocused(status === "active");
        });
        return () => sub.remove();
    }, []);

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
