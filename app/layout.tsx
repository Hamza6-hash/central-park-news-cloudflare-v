import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import QueryProviders from '@/ReatQuery/provider';
import { Montserrat, Gothic_A1 } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

// const ghotic = Gothic_A1({
//   subsets: ['latin'],
//   variable: '--font-century-gothic',
//   weight: ['100', '200', '300', '400', '500', '600', '700'],
//   display: 'swap',
// });

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
    <html lang="en" className={`${montserrat.variable}` }>
      <body>
        <QueryProviders>
          <Header />
          <main className="flex items-center justify-center md:px-generic pageTopBottonMargin overflow-hidden">
            <div className="max-width">
              <div className="max-md:flex max-md:justify-center max-md:items-center">
                <hr className="w-64 h-0.5 mb-2 bg-gray-200" />
              </div>
              {children}
            </div>
          </main>
          <Footer />
        </QueryProviders>
      </body>
    </html>
  );
}
