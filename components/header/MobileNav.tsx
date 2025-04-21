'use client'

import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { navbarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { IoMenu } from "react-icons/io5";
import Logo from '@/assets/logo.png';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Filter and sort the navigation links
    const orderedNavLinks = navbarLinks
        .filter(item => !item.imgURL) // Remove logo
        .sort((a, b) => {
            if (a.label === "Home") return -1;
            if (b.label === "Home") return 1;
            if (a.label === "Article") return -1;
            if (b.label === "Article") return 1;
            return 0;
        });

    return (
        <section className='w-full max-w-[264px] lg:hidden'>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="focus:outline-none focus:ring-0">
                    <IoMenu className='cursor-pointer' color='white' size={30} />
                </SheetTrigger>
                <SheetContent side={'right'} className='border-none bg-[#1E3D5A] [&>button]:text-white [&>button]:outline-none [&>button]:ring-0 [&>button]:focus:outline-none [&>button]:focus:ring-0 [&>button]:focus-visible:outline-none [&>button]:focus-visible:ring-0 [&>button]:focus-within:outline-none [&>button]:focus-within:ring-0 [&_button]:focus:ring-0 [&_button]:focus:ring-offset-0 [&_button]:focus-visible:ring-0 [&_button]:focus-visible:ring-offset-0'>
                    <Link href={'/'} className='cursor-pointer flex items-center gap-1 px-4'>
                        <Image
                            src={Logo}
                            width={220}
                            height={89}
                            quality={100}
                            alt='Horizon logo'
                        />
                    </Link>

                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-8">
                                {orderedNavLinks.map((item, index) => {
                                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)

                                    return (
                                        <SheetClose asChild key={item.label}>
                                            <Link href={item.route} className={cn(
                                                'mobilenav-sheet_close w-full border-none outline-none ring-0',
                                                { 'bg-white': isActive }
                                            )}>
                                                <p className={cn('font-montserrat text-[18px] leading-none tracking-normal uppercase', {
                                                    'text-[#1E3D5A] font-bold': isActive,
                                                    'text-white font-light': !isActive
                                                })}>
                                                    {item.label}
                                                </p>
                                            </Link>
                                        </SheetClose>
                                    )
                                })}
                            </nav>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav;