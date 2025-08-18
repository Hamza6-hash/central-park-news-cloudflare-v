"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";

export function ToastHandler() {
    const searchParams = useSearchParams()
    const toastParams = searchParams.get('toast')
    const router = useRouter()
    const { showToast } = useToast()

    useEffect(() => {
        if (!toastParams) return;

        const toastMap: Record<string, { title: string; description: string }> = {
            "expired": {
                title: "Expired",
                description: "This unsubscribe link has expired.",
            },
            "token-already-used": {
                title: "Error",
                description: "This link was already used. You’re already unsubscribed.",
            },
            "user-check-failed": {
                title: "Error",
                description: "Something went wrong. Please try again later.",
            },
        };

        const toastData = toastMap[toastParams];

        if (toastData) {
            showToast({
                title: toastData.title,
                description: toastData.description,
                type: "error",
            });

            router.replace("/");
        }
    }, [toastParams, router, showToast]);

    return null;
} 