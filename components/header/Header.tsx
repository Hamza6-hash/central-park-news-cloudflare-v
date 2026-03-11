'use client'
import Navbar from "./Navbar";
import Banner from "./Banner";
import Adbanner from "../Ads/Adbanner";
import Searchbar from "./Searchbar";
import { usePathname } from 'next/navigation'

export default function Header() {

    const pathname = usePathname()
    const hideBanner = ["/privacy-policy", "/terms-and-conditions", "/unsubscribe", '/about', '/author/sarah-lee'].includes(pathname);
    const isHomePage = pathname === "/";
    const showHeader = pathname === '/'  || pathname === '/author/sarah-lee'  || pathname === '/news' || pathname === '/contact' || pathname === 'contact' || pathname === '/privacy-policy' || pathname === '/terms-and-conditions' || pathname.includes('/news') || pathname === '/about'
    if (!showHeader) return null

    return (
        <header>
            <Navbar />
            {!hideBanner && (
                <>
                    <Banner />
                    <Adbanner />
                    {isHomePage && <Searchbar />}
                </>
            )}
        </header>
    );
}