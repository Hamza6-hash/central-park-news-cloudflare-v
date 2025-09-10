"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const AdBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 640);
    checkSize();

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const adLink = "https://www.scottbaronassociates.com/";

  const handleClick = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "banner_click",
      adName: "Top Banner",
      device: isMobile ? "mobile" : "desktop",
      pagePath: window.location.pathname,
      targetUrl: adLink,
    });
  };

  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        <a
          href={adLink}
          onClick={handleClick}
          className="head-banner-ad block"
          data-ad-name="Homepage Top Banner"
          target="_blank"
          rel="noopener noreferrer"
        >
          {isMobile ? (
            <div className="relative w-full aspect-[1/1]">
              <Image
                src="/bottomBanner.webp"
                alt="mobile-banner"
                fill
                quality={65}
                fetchPriority="high"
                className="head-banner-ad object-contain"
                sizes="(max-width: 768px) 100vw, 357px"
                loading="eager"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full aspect-[1199/153]">
              <Image
                src="/top.png"
                alt="desktop-banner"
                fill
                quality={80}
                className="head-banner-ad object-contain"
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 1000px, 1199px"
                priority
              />
            </div>
          )}
        </a>
      </div>
    </div>
  );
};

export default AdBanner;
