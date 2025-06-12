
"use client";

import React from "react";
import { routes } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import Logo from "@/assets/logo.png";

const Navbar = () => {
  const pathName = usePathname();

  return (
    <section className="navbar">
      <div className="flex justify-between items-center w-full lg:hidden">
        <Link href={routes.home}>
          <Image
            src={Logo}
            alt="Horizon logo"
            quality={80}
            width={120}
            height={60}
            priority={true}
            loading="eager"
            style={{ objectFit: "cover", width: "auto", height: "auto" }}
            className="block lg:hidden"
          />
        </Link>
        <div className="ml-auto">
          {/* <MobileNav /> */}
        </div>
      </div>

      <nav className="hidden lg:flex justify-center items-center gap-28">
        <Link href={routes.home} className="relative lg:block hidden xl:px-10 px-0">
          <Image
            src={Logo}
            alt="Horizon logo"
            quality={100}
            width={120}
            height={80}
            style={{ width: "auto", height: "auto" }}
          />
        </Link>
      </nav>
    </section>
  );
};

export default Navbar;