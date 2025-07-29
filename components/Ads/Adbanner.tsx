import React from "react";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {/* Mobile Image */}
        <div className="block sm:hidden">
          <img
            src="/MobileBanner.webp"
            alt="ad-banner"
            width={390}
            height={50}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, 390px"
            className="mx-auto object-contain w-full h-auto"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden sm:block">
          <img
            src="/banner.webp"
            alt="ad-banner"
            width={1199}
            height={153}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1200px) 1199px, (min-width: 640px) 100vw, 1199px"
            className="mx-auto object-contain w-full h-auto"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
