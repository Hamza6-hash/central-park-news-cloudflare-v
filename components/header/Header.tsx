import Navbar from "./Navbar";
import Banner from "./Banner";
import Adbanner from "../Ads/Adbanner";
import Searchbar from "./Searchbar";

export default function Header({ pathname = "/" }) {
    const hideBanner = ["/privacy", "/terms-and-conditions", "/unsubscribe"].includes(pathname);
    const isHomePage = pathname === "/";
     const showHeader = pathname === '/' || pathname === '/news' || pathname === '/contact' || pathname === 'contact' || pathname === '/privacy' || pathname === '/terms-and-conditions' || pathname.includes('/news')
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