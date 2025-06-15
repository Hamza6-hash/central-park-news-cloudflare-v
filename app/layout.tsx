import type { Metadata } from "next";
import "./globals.css";
import QueryProviders from '@/ReatQuery/provider';

import Header from "@/components/header/Header";
import FontLinks from "@/components/fontLinks/FontLinks";
import Footer from "@/components/footer/Footer";


export const metadata: Metadata = {
  title: "Crypto & Blockchain Briefing | Real-Time News & Insights",
  description: "Stay ahead tiwht  with Blockchain Briefing — your source for real-time crypto news, blockchain trends, and market insights. Curated updates from trusted sources.",
  keywords: 'crypto news, blockchain news, cryptocurrency updates, bitcoin news, ethereum news, defi news, crypto trends, blockchain technology, web3 updates'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" >
    <head>
      <FontLinks/>
    </head>
      <body className="select-none">
        <QueryProviders>
          <Header />
          <main className="flex items-center justify-center px-generic pageTopBottonMargin overflow-hidden ">
            <div className="max-width">
              {children}
            </div>
          </main>
          <Footer />
        </QueryProviders>
      </body>
    </html>
  );
}
