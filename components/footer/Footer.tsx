"use client";

import React from "react";
import FooterLinks from "./FooterLinks";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";
import dynamic from "next/dynamic";

// Dynamically import heavy components
const SuggestedBlogs = dynamic(() => import("../suggestedBlogs/SuggestedBlogs"), {
  ssr: false,
});
const LastestNews = dynamic(() => import("./LastestNews"), {
  ssr: false,
});

const Footer = () => {
  const pathName = usePathname();

  const showSuggestedBlogs =
    pathName === routes.articles ||
    pathName === routes.contact ||
    pathName === routes.home ||
    pathName === routes.news ||
    pathName.startsWith("/news") ||
    pathName.startsWith("/privacy") ||
    pathName.startsWith("/terms-and-conditions") ||
    pathName.startsWith("/about-us") ||
    pathName.startsWith("/careers") ||
    pathName.startsWith("/advertise-with-us") ||
    pathName.startsWith("/sitemap");

  const hideNews =
    pathName.startsWith("/terms-and-conditions") ||
    pathName.startsWith("/privacy");

  return (
    <footer className="w-full">
      {!showSuggestedBlogs && <SuggestedBlogs />}
      {!hideNews && <LastestNews />}

      <section className="w-full flex flex-col justify-center items-center gap-10 bg-gray-100 p-4 py-6">
        <FooterLinks />
      </section>

      <div className="bg-primary-900 w-full text-white py-3 px-1">
        <p className="text-center sm:text-xs text-[10px]">
          COPYRIGHT 2024 © <strong>BLOCKCHAIN BRIEFING</strong>. ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
};

export default Footer;
