import React from "react";
import Image from "next/image";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {/* Mobile Banner */}
        <div className="sm:hidden">
          <Image
            src="/MobileBanner.webp"
            alt="mobile-banner"
            width={364}
            height={190}
            quality={60}
            className="object-contain w-full h-auto"
            loading="eager"
            priority={true}
            fetchPriority="high"
          />
        </div>

        {/* Desktop Banner */}
        <div className="hidden sm:block">
          <Image
            src="/banner.webp"
            alt="desktop-banner"
            width={1199}
            height={153}
            quality={100}
            className="object-contain w-full h-auto"
            loading="eager"
            priority={true}
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;