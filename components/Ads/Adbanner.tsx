"use client";
import React, { useCallback, useMemo } from "react";
import Image from "next/image";

const AdBanner = () => {
  const adLink = "https://www.scottbaronassociates.com/";

  // Cache device type to prevent forced reflows
  const deviceType = useMemo(() => {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 640 ? "mobile" : "desktop";
  }, []);

  // Optimized click handler with cached values to prevent reflows
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const w = window as typeof window & { dataLayer?: unknown[] };
      w.dataLayer.push({
        event: "banner_click",
        adName: "Top Banner",
        device: deviceType,
        pagePath: window.location.pathname,
        targetUrl: adLink,
      });
    }
  }, [adLink, deviceType]);

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
          {/* Desktop Image */}
          <div className="relative hidden sm:block w-full aspect-[1199/200] overflow-hidden" style={{ contain: 'layout style paint' }}>
            <Image
              src="/top.webp"
              alt="Banner"
              fill
              className="object-contain"
              sizes="(min-width: 641px) 1199px, 100vw"
              quality={70}
              loading="eager"
              priority={true}
              fetchPriority="high"
              style={{ willChange: 'auto' }}
            />
          </div>

          {/* Mobile Image - Optimized for LCP with constrained dimensions */}
          <div 
            className="relative block sm:hidden w-full max-w-[430px] mx-auto aspect-[3/4] overflow-hidden" 
            style={{ contain: 'layout style paint' }}
          >
            <Image
              src="/bottomBanner.webp"
              alt="Banner"
              fill
              className="object-contain"
              sizes="(max-width: 375px) 100vw, (max-width: 430px) 100vw, 430px"
              quality={45}
              loading="eager"
              priority={true}
              fetchPriority="high"
              style={{ willChange: 'auto' }}
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdBanner;