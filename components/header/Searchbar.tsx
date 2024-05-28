"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { IoIosSearch } from "react-icons/io";

const Searchbar = () => {
    const pathName = usePathname();

    return (
        <section className="pt-[83px] px-generic w-full  flex justify-center items-center">
            <div className="w-[1200px]">
                <div className="flex justify-center items-center w-full">
                    <div className="bg-blue-gradient rounded-full py-2 sm:w-fit w-full px-5 gap-1 flex justify-center items-center">
                        <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none sm:w-96 text-white w-full"
                        />
                        <button>
                            <IoIosSearch color="white" size={25} />
                        </button>
                    </div>
                </div>

                {pathName === '/' &&
                    <div className="w-full flex md:items-start items-center flex-col">
                        <div className="py-2 px-4 mt-12 font-bold bg-yellow-500 font-century-schoolbook rounded-full w-fit">
                            <p>TODAY’S TOP STORY</p>
                        </div>
                    </div>
                }
            </div>
        </section>
    );
};

export default Searchbar;
