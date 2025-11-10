
"use client";
import React from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from 'vanilla-cookieconsent';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const CookieConsentWrapper = () => {
  const pathname = usePathname()
  const isUnsubscribe = pathname.includes('/unsubscribe')

  useEffect(() => {
    if (isUnsubscribe) {
      return
    }

    const initCookieConsent = () => {
      try {
        if (typeof window !== 'undefined' && CookieConsent) {
          CookieConsent.run({
            guiOptions: {
              consentModal: {
                layout: "box",
                position: "bottom right",
              },
              preferencesModal: {
                layout: "box"
              }
            },
            categories: {
              necessary: {
                enabled: true,
                readOnly: true
              },
              analytics: {
                enabled: false
              },
              ads: {
                enabled: false
              }
            },
            language: {
              default: "en",
              translations: {
                en: {
                  consentModal: {
                    title: "We use cookies 🍪",
                    description:
                      "We use cookies to improve your experience, for analytics and personalized ads. You can manage your preferences.",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject",
                    showPreferencesBtn: "Manage preferences"
                  },
                  preferencesModal: {
                    title: "Cookie Preferences",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close",
                    sections: [
                      {
                        title: "Necessary Cookies",
                        description: "These are required for the website to function.",
                        linkedCategory: "necessary"
                      },
                      {
                        title: "Analytics Cookies",
                        description: "Help us understand how our website is used.",
                        linkedCategory: "analytics"
                      },
                      {
                        title: "Ads Cookies",
                        description: "Used for personalization and ads tracking.",
                        linkedCategory: "ads"
                      }
                    ]
                  }
                }
              }
            },
            onConsent: ({ cookie }: any) => {
              const granted = (cat: string) => cookie.categories.includes(cat);

              if (window.gtag) {
                if (granted("analytics") && granted("ads")) {
                  window.gtag("consent", "update", {
                    ad_storage: 'granted',
                    analytics_storage: 'granted',
                    personalization_storage: 'granted',
                    functionality_storage: 'granted'
                  });
                } else {
                  window.gtag("consent", "update", {
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    personalization_storage: 'denied',
                    functionality_storage: 'denied'
                  });
                }
              } else {
                console.warn('gtag not available - cannot update consent');
              }
            }
          });

          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error initializing cookie consent:', error);
        return false;
      }
    };

    let retryCount = 0;
    const maxRetries = 3;

    const attemptInit = () => {
      if (retryCount >= maxRetries) {
        return;
      }

      if (!initCookieConsent()) {
        retryCount++;
        setTimeout(attemptInit, 1000);
      }
    };

    attemptInit();

    return () => {
      retryCount = maxRetries;
    };
  }, [isUnsubscribe]);

  return null;
}

export default CookieConsentWrapper