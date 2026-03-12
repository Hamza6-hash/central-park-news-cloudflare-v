import type { Metadata, Viewport } from "next";
import "./globals.css";
import FontLinks from "@/components/fontLinks/FontLinks";
import { ToastProvider } from "@/context/ToastContext";
import { Providers } from "@/context/Providers";
import Script from "next/script";
import SchemaOrg from "@/components/Schema";
import dynamic from "next/dynamic";
import { liveUrl } from "@/lib/utils";
import * as Sentry from '@sentry/nextjs';

const CSSOptimizer = dynamic(() => import("@/components/CSSOptimizer"), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(liveUrl),
  title: "Central Park News | Stories from the Heart of New York City",
  description: "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.",
  keywords: ["Central Park news", "NYC park updates", "New York local stories", "Manhattan news"],
  icons: {
    apple: "/apple-touch-icon.png",
  },
  other: {
    "x-ua-compatible": "IE=edge",
    ...Sentry.getTraceData()
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${liveUrl}/#organization`,
    name: "Central Park News",
    url: liveUrl,
    logo: {
      "@type": "ImageObject",
      url: `${liveUrl}/logo.png`,
    },
    description:
      "Local updates, events, community stories and real-time news around Central Park and New York City.",
    foundingDate: "2025",
    inLanguage: "en-US",
    sameAs: [
       "https://www.centralpark.news",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Central Park, Manhattan",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10024",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7829,
      longitude: -73.9654,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${liveUrl}/#website`,
    name: "Central Park News",
    url: liveUrl,
    publisher: { "@id": `${liveUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${liveUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };



  return (
    <html lang="en">
      <head>
        {/* --------------------- GEO META TAGS ------------------ */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York" />
        <meta name="geo.position" content="40.7829;-73.9654" />
        <meta name="ICBM" content="40.7829, -73.9654" />

        <meta name="google-site-verification" content="IX-zmkyeEfEBU_8lk9SpqKuxdnNAM8T_Tla3i0qDrw0" />
        {/* --------------------- GEO META TAGS ------------------ */}
        <SchemaOrg schemas={[websiteSchema, organizationSchema]} />
        {/* ----------------- GOOGLE SUBSCRIPTION SCRIPT ---------*/}
        {/* Only load SWG on production; localhost triggers CORS/403 from Google's API */}
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://news.google.com/swg/js/v1/swg-basic.js"
            strategy="beforeInteractive"
            type="application/javascript"
          />
        )}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5W79LR8');`,
          }}
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
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
        {/* ----------------- GOOGLE SUBSCRIPTION SCRIPT ---------*/}
        <link
          rel="preload"
          as="image"
          href="/mobile.webp"
          fetchPriority="high"
          sizes="(max-width: 375px) 100vw, 430px"
        />
        <link rel="preload" as="image" href="/top.webp" media="(min-width: 641px)" />
        <FontLinks />
      </head>
      <body className="select-none ">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5W79LR8"
          height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        <CSSOptimizer />
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
