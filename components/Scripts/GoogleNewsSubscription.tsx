import Script from "next/script";

interface GoogleNewsSubscriptionProps {
  slug?: string;
}

export default function GoogleNewsSubscription({ slug }: GoogleNewsSubscriptionProps) {
  return (
    <Script
      id={slug ? `google-news-subscription-${slug}` : `google-news-subscription-${Date.now()}`}
      strategy="afterInteractive"
    >
      {`
        (function() {
          // Ensure SWG library is loaded before initialization
          if (typeof self !== 'undefined') {
            (self.SWG_BASIC = self.SWG_BASIC || []).push(function(basicSubscriptions) {
              basicSubscriptions.init({
                type: "NewsArticle",
                isPartOfType: ["Product"],
                isPartOfProductId: "CAowjsrDDA:openaccess",
                clientOptions: { theme: "light", lang: "en" },
              });
            });
          }
        })();
      `}
    </Script>
  );
}