import React from "react";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full ">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        <picture>
          {/* Mobile */}
          <source
            srcSet="/MobileBanner.webp"
            media="(max-width: 640px)"
          />
          {/* Desktop */}
          <source
            srcSet="/banner.webp"
            media="(min-width: 641px)"
          />
          {/* Fallback image */}
          <img
            src="/banner.webp"
            alt="ad-banner"
            width={1199}
            height={153}
            loading="eager"
            fetchPriority="high"
            className="mx-auto object-contain w-full h-auto"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </picture>
      </div>
    </div>
  );
};

export default AdBanner;
