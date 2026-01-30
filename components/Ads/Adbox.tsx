'use client'
import React from "react";
import Image from "next/image";

const Adbox = () => {

  const adLink = "https://www.scottbaronassociates.com/";

  const handleClick = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "banner_click",
      adName: "Bottom Banner",
      device: "desktop",
      pagePath: window.location.pathname,
      targetUrl: adLink,
    });
  };

  return (
    <div className="flex justify-center items-center mt-3 w-full">
      <a
        href={adLink}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="head-banner-ad w-full"
      >
        <div className="relative  hidden sm:block w-full max-w-[510px] aspect-[17/10] overflow-hidden rounded-lg">
          <Image
            src="/image (12).png"
            alt="Sponsored desktop advertisement for legal services"
            title="Displayed on viewports 640px and wider"
            fill
            className="head-banner-ad object-contain"
            sizes="(min-width: 640px) 510px, 100vw"
            quality={70}
            loading="eager"
            priority={true}
            fetchPriority="high"
          />
        </div>
        <div className="block sm:hidden w-full">
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden ">
            <Image
              src="/mobile.webp"
              alt="Sponsored mobile advertisement for legal services"
              title="Displayed on viewports under 768px"
              fill
              quality={65}
              className="head-banner-ad object-contain pointer-events-none select-none"
              sizes="(max-width: 768px) 100vw, 364px"
              loading="eager"
              priority={true}
              fetchPriority="high"
            />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Adbox;
