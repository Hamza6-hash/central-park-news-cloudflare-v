"use client";
import React, { useCallback } from "react";
import Image from "next/image";

const AdBanner = () => {
  const adLink = "https://www.scottbaronassociates.com/";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (typeof window !== "undefined" && window.dataLayer) {
        const w = window as typeof window & { dataLayer?: unknown[] };
        w.dataLayer.push({
          event: "banner_click",
          adName: "Top Banner",
          pagePath: window.location.pathname,
          targetUrl: adLink,
        });
      }
    },
    [adLink]
  );

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
          aria-label="Advertisement"
        >
          <div className="relative hidden sm:block w-full overflow-hidden">
            <Image
              src="/top.webp"
              alt="Banner"
              width={1199}
              height={200}
              className="object-contain head-banner-ad"
              sizes="(min-width: 641px) 1199px, 100vw"
              quality={70}
              priority
              fetchPriority="high"
            />
          </div>
          <div className="relative block sm:hidden w-full overflow-hidden mx-auto max-w-[436px]">
            <Image
              src="/mobile.webp"
              alt="Banner"
              width={436}
              height={410}
              className="object-contain head-banner-ad"
              sizes="(max-width: 375px) 100vw, 430px"
              quality={45}
              priority
              fetchPriority="high"
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdBanner;