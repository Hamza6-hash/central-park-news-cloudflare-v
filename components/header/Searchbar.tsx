"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { IoIosSearch } from "react-icons/io";

const Searchbar = () => {
    const pathName = usePathname();

    return (
        <section className="pt-10 px-generic">
            <div className="flex justify-center items-center">
                <div className="bg-blue-gradient rounded-full py-2 px-5 gap-1 flex justify-center items-center">
                    <input
                        type="text"
                        className="bg-transparent border-none focus:outline-none w-96"
                    />
                    <button>
                        <IoIosSearch color="white" size={25} />
                    </button>
                </div>
            </div>

            {pathName === '/' && <div className="py-2 px-4 font-bold bg-yellow-500 rounded-full w-fit">
                <p>TODAY’S TOP STORY</p>
            </div>}
        </section>
    );
};

export default Searchbar;
