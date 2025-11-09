// app/layout.tsx (SERVER COMPONENT)
import React from 'react'
import Header from './header/Header'
import Footer from './footer/Footer'
import CookieConsentWrapper from './ClientPages/Cookie/CookieConsentWrapper' 
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

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