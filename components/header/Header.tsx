
import Navbar from "./Navbar";
import Banner from "./Banner";
import Adbanner from "../Ads/Adbanner";
import Searchbar from "./Searchbar";

export default function Header({ pathname = "/" }) {
    const hideBanner = ["/privacy", "/terms-and-conditions", "/unsubscribe"].includes(pathname);
    const isHomePage = pathname === "/";

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