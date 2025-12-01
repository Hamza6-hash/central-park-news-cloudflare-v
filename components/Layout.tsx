// app/layout.tsx (SERVER COMPONENT)
import React from 'react'
import Header from './header/Header'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic';

// Lazy load non-critical components
const Footer = dynamic(() => import('./footer/Footer'), {
  ssr: false, 
});

const CookieConsentWrapper = dynamic(() => import('./ClientPages/Cookie/CookieConsentWrapper'), {
  ssr: false,
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <CookieConsentWrapper />
      <Header />
      <main className="flex items-center justify-center px-generic pageTopBottonMargin overflow-hidden">
        <div className="max-width">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout