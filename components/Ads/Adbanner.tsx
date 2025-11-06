"use client";
import React from "react";

const AdBanner = () => {
  const adLink = "https://www.scottbaronassociates.com/";

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const w = window as typeof window & { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "banner_click",
        adName: "Top Banner",
        device: window.innerWidth < 640 ? "mobile" : "desktop",
        pagePath: window.location.pathname,
        targetUrl: adLink,
      });
    }
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
          <picture>
            {/* Desktop source */}
            <source
              media="(min-width: 641px)"
              srcSet="/top.webp"
              type="image/webp"
            />

            {/* Mobile source (WebP) */}
            <source
              media="(max-width: 640px)"
              srcSet="/bottomBanner.webp"
              type="image/webp"
            />

            {/* Fallback img - uses mobile image */}
            <img
              src="/bottomBanner.webp"
              alt="Banner"
              className="w-full h-auto object-contain"
              width="640"
              height="640"
              // @ts-ignore
              fetchpriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
        </a>
      </div>
    </div>
  );
};

export default AdBanner;