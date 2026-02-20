import Script from "next/script";

interface GoogleNewsSubscriptionProps {
  slug?: string;
}

export default function GoogleNewsSubscription({ slug }: GoogleNewsSubscriptionProps) {
  return (
    <Script
      id={slug ? `google-news-subscription-${slug}` : "google-news-subscription"}
      strategy="afterInteractive"
    >
      {`
        (function() {
          // SWG script only loads in production; avoid init when script isn't present (e.g. localhost)
          if (typeof self === 'undefined') return;
          (self.SWG_BASIC = self.SWG_BASIC || []).push(function(basicSubscriptions) {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAowjsrDDA:openaccess",
              clientOptions: { theme: "light", lang: "en" },
            });
          });
        })();
      `}
    </Script>
  );
}