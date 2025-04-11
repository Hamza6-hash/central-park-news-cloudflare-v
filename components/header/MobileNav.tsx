'use client'

import React from 'react'
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
    const pathName = usePathname();

    return (
        <section className='w-full max-w-[264px]'>
            <Sheet>
                <SheetTrigger>
                    <IoMenu className='cursor-pointer' color='white' size={30} />
                </SheetTrigger>
                <SheetContent side={'left'} className='border-none bg-[#1E3D5A] [&>button]:text-white'>
                    <Link href={'/'} className='cursor-pointer flex items-center gap-1 px-4'>
                        <Image
                            src={Logo}
                            width={100}
                            quality={100}
                            height={100}
                            alt='Horizon logo'
                        />
                    </Link>

                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-8">
                                {navbarLinks.map((item, index) => {
                                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)

                                    return (
                                        <React.Fragment key={index}>
                                            {!item.imgURL && <SheetClose asChild key={item.label}>
                                                <Link href={item.route} className={cn(
                                                    'mobilenav-sheet_close w-full',
                                                    { 'bg-white': isActive }
                                                )}>
                                                    <p className={cn('font-montserrat text-[18px] font-light leading-none tracking-normal uppercase', {
                                                        'text-[#1E3D5A]': isActive,
                                                        'text-white': !isActive
                                                    })}>
                                                        {item.label}
                                                    </p>
                                                </Link>
                                            </SheetClose>}
                                        </React.Fragment>
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