"use client";

import React from "react";
import Image from "next/image";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {/* Desktop Banner */}
        <div className="relative hidden sm:block w-full aspect-[1199/153] ">
          <Image
            src="/banner.png"
            alt="desktop-banner"
            fill
            quality={100}
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Mobile Banner */}
        <div className="relative block sm:hidden w-full aspect-[390/200] ">
          <Image
            src="/topBanner.png"
            alt="mobile-banner"
            fill
            quality={100}
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
