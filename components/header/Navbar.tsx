"use client";

import React, { useState } from "react";
import { routes } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.webp";
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
              src={Logo}
              alt="Horizon logo"
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
              className="flex gap-1 text-[#dbdad7] items-center hover:opacity-70 transition-opacity"
            >
              Search
              <Search size={20} className=" text-[#dbdad7]" />
            </button>


            {/* MobileNav */}
            {/* <MobileNav /> */}
          </div>
        </div>

        {/* Desktop view */}
        <nav className="hidden lg:flex items-center justify-between w-full relative px-5 py-6">
          {/* Centered logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href={routes.home}>
              <Image
                src={Logo}
                alt="Horizon logo"
                quality={75}
                width={191}
                height={120}
                priority
                loading="eager"
                // style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>

          {/* Search icon aligned right */}
          <div className="ml-auto flex items-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="mt-2 flex gap-1 items-center text-[#dbdad7] sm:mt-0 hover:opacity-70 transition-opacity"
              aria-label="Open search"
            >
              Search
              <Search size={20} color="#dbdad7" />
            </button>
          </div>
        </nav>

      </section>
    </>
  );
};

export default Navbar;
