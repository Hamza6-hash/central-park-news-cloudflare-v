'use client'
import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import Searchbar from './Searchbar';
import { usePathname } from 'next/navigation';
import Adbanner from '../Ads/Adbanner';

const Header = () => {
    const pathName = usePathname()
    const hideBanner = pathName === '/privacy' || pathName === '/terms-and-conditions' || pathName === '/unsubscribe';
    return (
        <header>
            <Navbar />
            {
                hideBanner ? "" : <>
                    <Banner />
                    <Adbanner />
                </>
            }
            <Searchbar />
        </header>
    )
}

export default Header;