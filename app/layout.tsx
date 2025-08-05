import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import FontLinks from "@/components/fontLinks/FontLinks";
import { ToastProvider } from "@/context/ToastContext";
import { Providers } from "@/context/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Central Parks News | Stories from the Heart of New York City",
  description: "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.",
  keywords: "Central Park news, NYC park updates, New York local stories, Manhattan news"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/MobileBanner.webp" media="(max-width: 640px)" />
        <link rel="preload" as="image" href="/banner.webp" media="(min-width: 641px)" />
        <FontLinks />
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
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
