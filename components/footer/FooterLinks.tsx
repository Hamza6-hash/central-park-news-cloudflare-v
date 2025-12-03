'use client'

import React from 'react'
import Link from "next/link";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const FooterLinks = () => {
    const pathName = usePathname();
    const isActive = pathName === '/privacy-policy' || pathName === '/terms-and-conditions';

    return (
        // <div className="flex flex-row border border-black justify-between items-center gap-4 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-row max-[718px]:flex-col justify-between items-center gap-4 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* <h4 className="font-bold text-primary-900 uppercase text-lg sm:text-xl">LINKS</h4> */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
                {navbarLinks.map((item, index) => {
                    const isActive =
                        pathName === item.route || pathName.startsWith(`${item.route}/`);

                    return (
                        <React.Fragment key={index}>
                            {!item.imgURL && <Link href={item.route} key={item.label}>
                                <p className={cn("footer-label h-[20px] flex items-center text-[14px]  font-montserrat", {
                                    "font-bold": isActive,
                                })} >
                                    {item.label}
                                </p>
                            </Link>}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className='flex gap-3 max-[398px]:flex-col max-[398px]:items-center font-normal font-montserrat text-[14px] text-[#1E3D5A]'>
                <Link href={'/privacy-policy'} >
                    <p
                        className={`cursor-pointer hover:font-bold hover:text-primary-900 ${pathName === '/privacy-policy' ? 'font-bold' : ''
                            }`}>PRIVACY POLICY</p>
                </Link>
                <Link href={'/terms-and-conditions'} >
                    <p  className={`cursor-pointer hover:font-bold hover:text-primary-900 ${pathName === '/terms-and-conditions' ? 'font-bold' : ''
                            }`}>TERMS AND CONDITIONS</p>
                </Link>

            </div>
        </div>
    )
}

export default FooterLinks