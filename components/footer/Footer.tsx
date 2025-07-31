"use client";

import React from "react";
import FooterLinks from "./FooterLinks";
import { usePathname } from "next/navigation";
import LastestNews from "./LastestNews";

const Footer = () => {
  const pathName = usePathname();

  const hideNews =
    pathName.startsWith("/terms-and-conditions") ||
    pathName.startsWith("/privacy") ||
    pathName.startsWith("/unsubscribe");

  const hideLinks = pathName.startsWith("/unsubscribe");
  const showFooter = pathName === '/' || pathName === '/contact' || pathName === '/privacy' || pathName === '/terms-and-conditions' || pathName === '/terms-and-conditions' || pathName === '/news' || pathName.startsWith('/news/')
  if (!showFooter) return null

  return (
    <footer className="w-full">
      {!hideNews && <LastestNews />}

      {
        hideLinks ? null :
          <section className="w-full flex flex-col justify-center items-center gap-10 bg-white p-4 py-6">
            <FooterLinks />
          </section>
      }

      <div className="bg-[#303130] w-full text-white py-3 px-1">
        <p className="text-center sm:text-xs text-[10px]">
          COPYRIGHT 2025 © <strong>CENTERAL PARK NEWS</strong>. ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
};

export default Footer;
