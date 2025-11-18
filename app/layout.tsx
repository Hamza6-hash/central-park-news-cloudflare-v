import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import FontLinks from "@/components/fontLinks/FontLinks";
import { ToastProvider } from "@/context/ToastContext";
import { Providers } from "@/context/Providers";
import Script from "next/script";
import SchemaOrg from "@/components/Schema";
import CSSOptimizer from "@/components/CSSOptimizer";

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
    "name": "Central Park News",
    "url": "https://central-park-news.vercel.app/",
    "logo": "https://central-park-news.vercel.app/logo.png",
    "description": "Local updates, events, community stories and real-time news around Central Park and New York City.",
    "foundingDate": "2025",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.7829,
      "longitude": -73.9654
    },
    "sameAs": [
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://twitter.com/"
    ]
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
        {/* --------------------- GEO META TAGS ------------------ */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York" />
        <meta name="geo.position" content="40.7829;-73.9654" />
        <meta name="ICBM" content="40.7829, -73.9654" />

        {/* --------------------- GEO META TAGS ------------------ */}
        <meta name="google-site-verification" content="IX-zmkyeEfEBU_8lk9SpqKuxdnNAM8T_Tla3i0qDrw0" />

        {/* Resource hints for performance optimization */}
        <link rel="dns-prefetch" href="https://central-park-news.vercel.app" />
        <link rel="preconnect" href="https://central-park-news.vercel.app" crossOrigin="anonymous" />

        {/* Preconnect to Google Fonts if used */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <SchemaOrg schemas={[websiteSchema, organizationSchema]} />
        <link
          rel="preload"
          as="image"
          href="/mobile.webp"
          fetchPriority="high"
          sizes="(max-width: 375px) 100vw, 430px"
        />
        <link rel="preload" as="image" href="/top.webp" media="(min-width: 641px)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <FontLinks />
        {/* CSS optimization is handled by CSSOptimizer component and Next.js optimizeCss */}
        <Script
          id="gtm-script"
          // strategy="afterInteractive"
          strategy="lazyOnload"
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
        <Script
          // strategy="afterInteractive"
          strategy="lazyOnload"
          id="ga-init"
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
        <CSSOptimizer />
        <Providers>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
