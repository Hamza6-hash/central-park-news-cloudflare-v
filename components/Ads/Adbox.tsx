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
          quality={70}
          loading="eager"
          priority={true}
          fetchPriority="high"
        />
      </div>

      {/* Mobile Ad */}
      <div className="block sm:hidden w-full">
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden ">
          <Image
            src="/bottomBanner.webp"
            alt="mobile ad"
            fill
            quality={65}
            className="object-contain pointer-events-none select-none"
            sizes="(max-width: 768px) 100vw, 364px"
            loading="eager"
            priority={true}
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default Adbox;
