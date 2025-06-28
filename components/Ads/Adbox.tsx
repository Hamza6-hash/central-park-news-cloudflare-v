"use client";

import React from "react";
import Image from "next/image";

const Adbox = () => {
  return (
    <div className="flex justify-center items-center mt-3 w-full">
      {/* Desktop Ad */}
      <div className="relative  hidden sm:block w-full max-w-[510px] aspect-[17/10] overflow-hidden rounded-lg">
        <Image
          src="/image (12).png"
          alt="desktop ad"
          fill
          className="object-contain"
          sizes="(min-width: 640px) 510px, 100vw"
          quality={90}
          priority
        />
      </div>

      {/* Mobile Ad */}
      <div className="block sm:hidden w-full">
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden ">
          <Image
            src="/bottomBanner.png"
            alt="mobile ad"
            fill
            priority
            loading="eager"
            quality={80}
            className="object-contain pointer-events-none select-none"
            sizes="(max-width: 639px) 100vw, 390px"
          />
        </div>
      </div>
    </div>
  );
};

export default Adbox;
