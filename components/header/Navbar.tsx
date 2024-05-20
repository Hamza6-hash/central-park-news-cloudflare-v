"use client";

import React from "react";
import { navbarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathName = usePathname();

    return (
        <section className="navbar">
            <nav className="flex justify-between items-center gap-4 uppercase">
                {navbarLinks.map((item) => {
                    const isActive =
                        pathName === item.route || pathName.startsWith(`${item.route}/`);

                    return (
                        <React.Fragment key={item.label}>
                            {item.imgURL !== "" ? (
                                <div className="relative">
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
            </nav>
        </section>
    );
};

export default Navbar;
