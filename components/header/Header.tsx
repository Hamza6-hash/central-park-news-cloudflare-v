'use client'
import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import { usePathname } from 'next/navigation';
import Adbanner from '../Ads/Adbanner';
import Searchbar from './Searchbar';

const Header = () => {
    const pathName = usePathname()
    const hideBanner = pathName === '/privacy' || pathName === '/terms-and-conditions' || pathName === '/unsubscribe';
    const isHomePage = pathName === '/'
    return (
        <header>
            <Navbar />
            {
                hideBanner ? "" : <>
                    <Banner />
                    <Adbanner />
                    {isHomePage && <Searchbar />}
                </>
            }
        </header>
    )
}

export default Header;