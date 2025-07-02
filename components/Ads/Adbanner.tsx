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

  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {isMobile ? (
          <div className="relative w-full aspect-[390/200]">
            <Image
              src="/topBanner.webp"
              alt="mobile-banner"
              fill
              quality={75}
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 390px"

              priority={true}
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[1199/153]">
            <Image
              src="/banner.webp"
              alt="desktop-banner"
              fill
              quality={100}
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 1000px, 1199px"
              priority={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
