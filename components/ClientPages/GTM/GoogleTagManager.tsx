"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GTM() {
    const [shouldLoadGTM, setShouldLoadGTM] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        
        // Detect mobile device (screen width < 768px or touch device)
        const isMobile = window.innerWidth < 768 || 
                        ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        let timer: NodeJS.Timeout;
        let hasLoaded = false;
        
        // Only load GTM after user consent or after a delay (for users who don't interact with consent)
        const checkConsent = () => {
            // Check cookie consent status
            const cookieConsent = document.cookie
                .split("; ")
                .find((row) => row.startsWith("cc_cookie"));
            
            if (cookieConsent) {
                try {
                    const consentData = JSON.parse(
                        decodeURIComponent(cookieConsent.split("=")[1])
                    );
                    const hasAnalyticsConsent = 
                        consentData?.categories?.includes("analytics") || 
                        consentData?.categories?.includes("ads");
                    
                    if (hasAnalyticsConsent) {
                        hasLoaded = true;
                        setShouldLoadGTM(true);
                        return true;
                    }
                } catch (e) {
                    // Cookie parsing failed, continue with delay
                }
            }
            return false;
        };

        // Check if consent already exists
        if (checkConsent()) {
            return;
        }

        // Desktop: Load GTM immediately (desktop performance is good)
        if (!isMobile) {
            setShouldLoadGTM(true);
            return;
        }

        // Mobile: Defer GTM loading to improve mobile performance
        // Listen for consent changes from vanilla-cookieconsent
        const handleConsentChange = (event: CustomEvent) => {
            if (hasLoaded) return;
            
            const detail = event.detail as { cookie?: { categories?: string[] } };
            if (detail?.cookie?.categories) {
                const hasAnalyticsConsent = 
                    detail.cookie.categories.includes("analytics") || 
                    detail.cookie.categories.includes("ads");
                
                if (hasAnalyticsConsent) {
                    hasLoaded = true;
                    setShouldLoadGTM(true);
                    if (timer) clearTimeout(timer);
                }
            }
        };

        // Listen for vanilla-cookieconsent events
        window.addEventListener("cc:consent", handleConsentChange as EventListener);
        window.addEventListener("cc:onConsent", handleConsentChange as EventListener);
        
        // Mobile: Load GTM after 8 seconds if no consent interaction (non-blocking)
        // Longer delay on mobile to prioritize page rendering and user experience
        timer = setTimeout(() => {
            if (!hasLoaded) {
                hasLoaded = true;
                setShouldLoadGTM(true);
            }
        }, 8000);
        
        return () => {
            if (timer) clearTimeout(timer);
            window.removeEventListener("cc:consent", handleConsentChange as EventListener);
            window.removeEventListener("cc:onConsent", handleConsentChange as EventListener);
        };
    }, []);

    if (!shouldLoadGTM) {
        return (
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-M5W79LR8"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>
        );
    }

    return (
        <>
            <Script
                id="gtm-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M5W79LR8');
        `,
                }}
            />
            <Script
                id="ga-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted'
            });
          `,
                }}
            />
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-M5W79LR8"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>
        </>
    );
}
