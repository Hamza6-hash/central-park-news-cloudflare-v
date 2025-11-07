"use client";
import { ReactNode } from "react";

interface BannerClickTrackerProps {
    adLink: string;
    children: ReactNode;
    className: string;
}

export default function BannerClickTracker({
    adLink,
    children,
    className
}: BannerClickTrackerProps) {
    const handleClick = () => {
        const w = window as typeof window & { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
            event: "banner_click",
            adName: "Top Banner",
            site: "Central Park News",
            device: window.innerWidth < 640 ? "mobile" : "desktop",
            pagePath: window.location.pathname,
            targetUrl: adLink,
        });
    };

    return (
        <a
            href={adLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={className}
        >
            {children}
        </a>
    );
}
