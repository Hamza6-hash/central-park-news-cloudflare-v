"use client";

import React from "react";
import { navbarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import Logo from '@/assets/logo.png';

const Navbar = () => {
    const pathName = usePathname();

    return (
        <section className="navbar">
            <nav className="flex justify-center items-center gap-20 uppercase px-4">
                <MobileNav />
                {navbarLinks.map((item) => {
                    const isActive =
                        pathName === item.route || pathName.startsWith(`${item.route}/`);

                    return (
                        <React.Fragment key={item.label}>
                            {item.imgURL !== "" ? (
                                <div className="relative  lg:block hidden xl:px-12 px-0">
                                    <Image
                                        src={item.imgURL}
                                        alt={item.label}
                                        height={60}
                                        width={120}
                                    />
                                </div>
                            ) : (
                                <Link href={item.route}>
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

                <Image
                    src={Logo}
                    width={150}
                    quality={100}
                    height={150}
                    alt='Horizon logo'
                />
            </nav>
        </section>
    );
};

export default Navbar;
