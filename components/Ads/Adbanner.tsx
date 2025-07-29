import React from "react";
import Image from "next/image";

const AdBanner = () => {
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {/* Mobile Image */}
        <div className="block sm:hidden">
          <Image
            src="/MobileBanner.webp"
            alt="ad-banner"
            width={390}
            height={50}
            quality={85}
            priority={true}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, 390px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className="mx-auto object-contain w-full h-auto"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden sm:block">
          <Image
            src="/banner.webp"
            alt="ad-banner"
            width={1199}
            height={153}
            quality={85}
            priority={true}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1200px) 1199px, (min-width: 640px) 100vw, 1199px"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRl4AAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKhAACAAFADGJaQAA3aP3aP3aP3aP3AAAAAA="
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