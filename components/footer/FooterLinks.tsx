import React from 'react'
import Link from "next/link";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const FooterLinks = () => {
    const pathName = usePathname();

    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h4 className="font-bold text-primary-900 uppercase text-lg sm:text-xl">LINKS</h4>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full">
                {navbarLinks.map((item, index) => {
                    const isActive =
                        pathName === item.route || pathName.startsWith(`${item.route}/`);

                    return (
                        <React.Fragment key={index}>
                            {!item.imgURL && <Link href={item.route} key={item.label}>
                                <p className={cn("footer-label h-[20px] flex items-center text-sm sm:text-base", {
                                    "font-bold": isActive,
                                })} >
                                    {item.label}
                                </p>
                            </Link>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}

export default FooterLinks