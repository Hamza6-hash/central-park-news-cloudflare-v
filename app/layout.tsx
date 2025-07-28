import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import FontLinks from "@/components/fontLinks/FontLinks";
import { ToastProvider } from "@/context/ToastContext";
import { Providers } from "@/context/Providers";

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
        <FontLinks />
      </head>
      <body className="select-none ">
        <Providers>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
