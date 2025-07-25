"use client";

import { ToastProvider } from "./ToastContext";
import QueryProviders from "@/ReatQuery/provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProviders>
            <ToastProvider>{children}</ToastProvider>
        </QueryProviders>
    );
}