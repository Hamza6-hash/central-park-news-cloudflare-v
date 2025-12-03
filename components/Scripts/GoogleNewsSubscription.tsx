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
        (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
          basicSubscriptions.init({
            type: "NewsArticle",
            isPartOfType: ["Product"],
            isPartOfProductId: "CAowjsrDDA:openaccess",
            clientOptions: { theme: "light", lang: "en" },
          });
        });
      `}
    </Script>
  );
}