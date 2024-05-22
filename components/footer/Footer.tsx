"use client"

import React from "react";
import LastestNews from "./LastestNews";
import PopularLinks from "./PopularLinks";
import SocialMedia from "../common/SocialMedia";
import FooterLinks from "./FooterLinks";

const Footer = () => {
    return (
        <footer className="">
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
                <p className="text-center text-sm">
                    COPYRIGHT 2024 © <strong>BLOCKCHAIN BRIEFING</strong>. ALL RIGHTS
                    RESERVED
                </p>
            </div>
        </footer>
    );
};

export default Footer;
