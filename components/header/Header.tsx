import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import Searchbar from './Searchbar';

const Header = () => {
    return (
        <header>
            <Navbar />
            <Banner />
            <Searchbar />
        </header>
    )
}

export default Header;