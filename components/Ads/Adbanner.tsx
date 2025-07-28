"use client";
import React from "react";
import Image from "next/image";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        <picture>
          {/* Mobile banner */}
          <source
            srcSet="/topBanner.webp"
            media="(max-width: 640px)"
          />
          {/* Desktop banner */}
          <Image
            src="/banner.webp"
            alt="ad-banner"
            width={1199}
            height={153}
            quality={90}
            priority
            loading="eager"
            sizes="(max-width: 640px) 390px, (max-width: 1280px) 1000px, 1199px"
            className="mx-auto object-contain"
          />
        </picture>
      </div>
    </div>
  );
};

export default AdBanner;
