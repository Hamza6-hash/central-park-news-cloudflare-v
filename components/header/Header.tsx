'use client'
import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import Searchbar from './Searchbar';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathName = usePathname()
    const hideBanner = pathName === '/privacy' || pathName === '/terms-and-conditions';
    return (
        <header>
            <Navbar />
            {
                hideBanner ? "" :
                    <Banner />
            }
            <Searchbar />
        </header>
    )
}

export default Header;