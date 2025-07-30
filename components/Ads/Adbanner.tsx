import Image from "next/image";

// const DesktopAdBanner = () => {
//   return (
//     <div className="hidden sm:flex px-generic justify-center w-full">
//       <div className="w-full max-w-[1199px] mx-auto mt-3">
//         <Image
//           src="/banner.webp"
//           alt="desktop-banner"
//           width={1199}
//           height={153}
//           quality={100}
//           className="object-contain w-full h-auto"
//           loading="eager"
//           priority={true}
//           fetchPriority="high"
//         />
//       </div>
//     </div>
//   );
// };

// export default DesktopAdBanner;


const AdBanner = ({ pathname = "/" }) => {
  const isHomePage = pathname === '/'
  return (
    <div className="px-generic flex justify-center w-full">
      <div className="w-full max-w-[1199px] mx-auto mt-3">
        {!isHomePage && (
          <div className="sm:hidden">
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
        )}


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
    </div >
  );
};

export default AdBanner;