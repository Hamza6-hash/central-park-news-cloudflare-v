"use client"

import React from "react";
import LastestNews from "./LastestNews";
import PopularLinks from "./PopularLinks";
import SocialMedia from "../common/SocialMedia";
import FooterLinks from "./FooterLinks";
import SuggestedBlogs from "../suggestedBlogs/SuggestedBlogs";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";

const Footer = () => {
    const pathName = usePathname();
    const showSuggestedBlogs =
        pathName === routes.blogs || pathName.startsWith(`${routes.blogs}/`) || pathName === routes.articles || pathName.startsWith(`${routes.articles}/`);

    return (
        <footer className="">
            {showSuggestedBlogs && <SuggestedBlogs />}
            <LastestNews />
            <PopularLinks />

            <section className="w-full flex flex-col justify-center items-center gap-8 bg-gray-100 p-4">

                <FooterLinks />


                <div className="space-y-3">
                    <p className="font-bold text-primary-900">Follow Blockchain Briefing:</p>
                    <SocialMedia />

                </div>
            </section>

            <div className="bg-primary-900 w-full text-white p-4">
                <p className="text-center sm:text-sm text-xs">
                    COPYRIGHT 2024 © <strong>BLOCKCHAIN BRIEFING</strong>. ALL RIGHTS
                    RESERVED
                </p>
            </div>
        </footer>
    );
};

export default Footer;
