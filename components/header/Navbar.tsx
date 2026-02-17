"use client";

import React, { useState } from "react";
import { routes } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import Searchbar from "../search/SearchComp";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };
  
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };


  return (
    <>
      <Searchbar
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        onOpen={handleOpenSearch}
      />
      <section className="navbar w-full px-6 py-8 flex items-center justify-between">
        {/* Mobile view */}
        <div className="flex justify-between items-center w-full lg:hidden">
          <Link href={routes.home}>
            <Image
              src={'/logo.png'}
              alt="Central Park News logo linking to homepage"
              title="Links to homepage"
              quality={75}
              width={120}
              height={120}
              priority
              loading="eager"
              className="block"
              style={{ objectFit: "cover" }}
            />
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="flex gap-1 text-[#303130] items-center hover:opacity-70 transition-opacity"
            >
              Search
              <Search size={20} className=" text-[#303130]" />
            </button>


            {/* MobileNav */}
            {/* <MobileNav /> */}
          </div>
        </div>

        {/* Desktop view */}
        <nav className="hidden lg:flex items-center justify-between w-full relative px-5 py-6">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href={routes.home}>
              <Image
                src={'/logo.png'}
                alt="Central Park News logo linking to homepage"
                title="Links to homepage"
                quality={75}
                width={151}
                height={120}
                priority
                loading="eager"
                // style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>

          <div className="ml-auto flex items-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="mt-2 flex gap-1 items-center text-[#303130] sm:mt-0 hover:opacity-70 transition-opacity"
              aria-label="Open search"
            >
              Search
              <Search size={20} color="#303130" />
            </button>
          </div>
        </nav>

      </section>
    </>
  );
};

export default Navbar;
