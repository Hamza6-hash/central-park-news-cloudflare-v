"use client";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter()
  return (
    <div className="h-screen w-screen fixed inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-center items-center bg-white px-2  py-6 flex-shrink-0">
        <Link href={routes.home}>
          <Image
            src={'/logo.png'}
            alt="Blockchain Briefing logo"
            title="Central Park News logo"
            quality={75}
            width={180}
            height={80}
            priority
            loading="eager"
            className="block"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#E1E1E1] overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
          <div className="w-full flex flex-col items-center justify-center" style={{ gap: '32px' }}>
            {/* Main content - Pink image left, Text right */}
            <div className="flex flex-col lg:flex-row justify-center items-start max-[1021px]:items-center gap-1 lg:gap-2">    {/* Left side - Pink 404 image/card */}
              <div className="flex-shrink-0">

                <Image
                  src="/not-found.png"
                  alt="Not Found"
                  title="Not Found"
                  width={430}
                  height={366}
                  className="w-full max-w-[200px] sm:max-w-[350px] h-auto"
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Right side - Text and button (completely separate) */}
              <div className="flex flex-col mt-6 max-[1021px]:text-center flex-1" style={{ gap: '16px' }}>
                <h2 className="text-[20px] sm:text-[32px] font-bold text-[#303130] font-montserrat">
                  Uh Oh. Page Does Not Exist
                </h2>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <p className="text-[##303130] font-century-gothic text-[14px] sm:text-[24px] ">
                    We looked everywhere for this page.<br /> Are you sure that the URL is correct?
                  </p>
                </div>

                <Button
                  onClick={() => router.push('/')}
                  className="bg-[#E4212B] text-white font-bold py-3 px-6 rounded font-century-gothic hover:bg-white hover:text-black hover:shadow-md transition-colors w-fit mx-auto lg:mx-0">
                  Go Back Home
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[12px] text-white py-2 bg-[#303130] flex-shrink-0">
          COPYRIGHT 2025 © <b>CENTRAL PARK NEWS</b>. ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  );
};

export default NotFound;