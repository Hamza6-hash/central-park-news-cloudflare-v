"use client";
import React from 'react'
import Header from './header/Header'
import Footer from './footer/Footer'
import { usePathname } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isUnsubscribe = pathname.includes('/unsubscribe')
  if (isUnsubscribe) {
    return <>{children}</>
  }
  return (
    <div>
        {!isUnsubscribe && <Header />}
          <main className="flex items-center justify-center px-generic pageTopBottonMargin overflow-hidden ">
            <div className="max-width">
              {children}
            </div>
          </main>
        
          {!isUnsubscribe && <Footer />}
    </div>
  )

}

export default Layout
