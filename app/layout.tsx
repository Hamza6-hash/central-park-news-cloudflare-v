import type { Metadata } from "next";
import "./globals.css";
import QueryProviders from "@/ReatQuery/provider";
import FontLinks from "@/components/fontLinks/FontLinks";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Crypto & Blockchain Briefing | Real-Time News & Insights",
  description:
    "Stay ahead tiwht  with Blockchain Briefing — your source for real-time crypto news, blockchain trends, and market insights. Curated updates from trusted sources.",
  keywords:
    "crypto news, blockchain news, cryptocurrency updates, bitcoin news, ethereum news, defi news, crypto trends, blockchain technology, web3 updates",
};

{/* <FontLinks /> */ }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="select-none ">
        <QueryProviders>
          <Layout>{children}</Layout>
        </QueryProviders>
      </body>
    </html>
  );
}
