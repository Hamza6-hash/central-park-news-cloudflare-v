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

  return (
    <footer className="w-full">
      {!hideNews && <LastestNews />}

      {
        hideLinks ? null :
          <section className="w-full flex flex-col justify-center items-center gap-10 bg-gray-100 p-4 py-6">
            <FooterLinks />
          </section>
      }

      <div className="bg-primary-900 w-full text-white py-3 px-1">
        <p className="text-center sm:text-xs text-[10px]">
          COPYRIGHT 2025 © <strong>BLOCKCHAIN BRIEFING</strong>. ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
};

export default Footer;
