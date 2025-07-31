import Image from "next/image";

const MobileAdBanner = () => {
  return (
    <div className="sm:hidden w-full mt-0 mb-6">
      {/* Centered Image with optimized rendering */}
      <div className="flex justify-center mt-3">
        <Image
          src="/MobileBanner.webp"
          alt="mobile-banner"
          width={390}
          height={200}
          quality={85} // Slightly higher quality for better compression/rendering balance
          className="object-contain w-full h-auto"
          loading="eager"
          priority={true}
          fetchPriority="high"
          placeholder="blur" // Add blur placeholder
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Yts2iTMlIcpOzN4rdOUz6L"
          // Use transform instead of object-contain for better performance
          style={{
            transform: 'translateZ(0)', // Force hardware acceleration
            willChange: 'transform', // Hint to browser for optimization
          }}
        />
      </div>

      {/* Left-aligned "TOP STORY" with optimized rendering */}
      <div className="mt-6">
        <div
          className="py-1 px-4 font-bold text-[#363636] bg-[#E1E1E1] font-century-schoolbook rounded-full w-fit"
          style={{
            transform: 'translateZ(0)', // Force hardware acceleration
            contain: 'layout style paint', // CSS containment for better performance
          }}
        >
          <p>TODAY'S TOP STORY</p>
        </div>
      </div>
    </div>
  );
};

export default MobileAdBanner;