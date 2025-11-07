import Image from "next/image";
import BannerClickTracker from "./Client/BannerClickTracker";

export default function AdBanner() {
  const adLink = "https://www.scottbaronassociates.com/";

  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        <BannerClickTracker adLink={adLink} className="head-banner-ad block">
          <picture>
            <source media="(min-width: 641px)" srcSet="/top.webp" type="image/webp" />

            <Image
              src="/bottomBanner.webp"
              alt="Banner"
              width={1199}
              height={153}
              priority
              fetchPriority="high"
              quality={75}
              className="w-full h-auto"
              sizes="(max-width: 640px) 100vw, 1199px"
            />
          </picture>
        </BannerClickTracker>
      </div>
    </div>
  );
}
