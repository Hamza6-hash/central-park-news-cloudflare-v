"use client";

import React from "react";
import Image from "next/image";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {/* Desktop ad banner */}
        <div className="relative hidden sm:block w-full aspect-[1199/153]">
          <Image
            src="/banner.webp"
            alt="desktop-banner"
            fill
            quality={75} 
            className="object-contain"
            sizes="(max-width: 1199px) 100vw, 1199px"
            priority
          />
        </div>

        {/* Mobile ad banner */}
        <div className="relative block sm:hidden w-full aspect-[390/200]">
          <Image
            src="/topBanner.webp"
            alt="mobile-banner"
            fill
            quality={75}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 390px"
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
