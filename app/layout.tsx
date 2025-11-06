import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import FontLinks from "@/components/fontLinks/FontLinks";
import { ToastProvider } from "@/context/ToastContext";
import { Providers } from "@/context/Providers";
import Script from "next/script";
import SchemaOrg from "@/components/Schema";

export const metadata: Metadata = {
  title: "Central Parks News | Stories from the Heart of New York City",
  description: "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.",
  keywords: "Central Park news, NYC park updates, New York local stories, Manhattan news",
  other: {
    "x-ua-compatible": "IE=edge",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const siteUrl = "https://central-park-news.vercel.app/";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": "https://central-park-news.vercel.app/#organization",
    name: "Central Park News",
    url: "https://central-park-news.vercel.app/",
    logo: {
      "@type": "ImageObject",
      url: "https://central-park-news.vercel.app/logo.png"
    },
    sameAs: [
      "https://twitter.com/centralparknews",
      "https://facebook.com/centralparknews"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Editorial",
      email: "editorial@centralparknews.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://central-park-news.vercel.app/#website",
    name: "Central Park News",
    url: "https://central-park-news.vercel.app/",
    publisher: { "@id": "https://central-park-news.vercel.app/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://central-park-news.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };



  return (
    <html lang="en">
      <head>
        <SchemaOrg schemas={[websiteSchema, organizationSchema]} />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preload" as="image" href="/bottomBanner.webp" fetchPriority="high" media="(max-width: 640px)" />
        <link rel="preload" as="image" href="/top.webp" media="(min-width: 641px)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <FontLinks />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5W79LR8')
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Default: deny all until user consents
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
           });`
          }}
        />
      </head>
      <body className="select-none ">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5W79LR8"
          height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        <Providers>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
