import Image from "next/image";

const MobileAdBanner = () => {
  return (
    <div className="sm:hidden w-full mt-0 mb-6">
      {/* Centered Image */}
      <div className="flex justify-center mt-3">
        <Image
          src="/MobileBanner.webp"
          alt="mobile-banner"
          width={390}
          height={200}
          quality={75}
          className="object-contain w-full h-auto"
          loading="eager"
          priority={true}
          fetchPriority="high"
        />
      </div>

      {/* Left-aligned "TOP STORY" */}
      <div className="mt-6 ">
        <div className="py-1 px-4 font-bold text-[#363636] bg-[#E1E1E1] font-century-schoolbook rounded-full w-fit">
          <p>TODAY'S TOP STORY</p>
        </div>
      </div>
    </div>
  );
};

export default MobileAdBanner;
