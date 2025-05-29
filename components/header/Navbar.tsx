"use client";

import React from "react";
import { navbarLinks, routes } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import Logo from "@/assets/logo.png";

const Navbar = () => {
  const pathName = usePathname();

  return (
    <section className="navbar">
      <div className="justify-between w-full  flex lg:hidden items-center">
        <Link href={routes.home}>
          <Image
            src={Logo}
            quality={100}
            style={{ objectFit: "cover" }}
            height={60}
            width={120}
            alt="Horizon logo"
            className="block lg:hidden"
          />
        </Link>
        <div className="ml-auto">
          <MobileNav />
        </div>
      </div>

      <nav className="justify-center lg:flex hidden items-center gap-28">
        {navbarLinks.map((item, index) => {
          const isActive =
            pathName === item.route || pathName.startsWith(`${item.route}/`);

          return (
            <React.Fragment key={index}>
              {item.imgURL !== "" ? (
                <Link
                  href={item.route}
                  className="relative  lg:block hidden xl:px-10 px-0"
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    quality={100}
                    height={60}
                    width={120}
                  />
                </Link>
              ) : (
                <Link href={item.route} className="lg:block hidden">
                  <p
                    className={cn("navbar-label", {
                      "!font-bold": isActive,
                    })}
                  >
                    {item.label}
                  </p>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </section>
  );
};

export default Navbar;