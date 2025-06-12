import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import QueryProviders from '@/ReatQuery/provider';
import { Montserrat } from 'next/font/google';
import DisableDevTools from "@/components/ProtectImages/DisableDivTools";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

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
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="select-none">
        <QueryProviders>
          <Header />
          <main className="flex items-center justify-center px-generic pageTopBottonMargin overflow-hidden ">
            <div className="max-width">
              {/* <div>
                <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
              </div> */}
              {/* <DisableDevTools/> */}
              {children}
            </div>
          </main>
          <Footer />
        </QueryProviders>
      </body>
    </html>
  );
}
