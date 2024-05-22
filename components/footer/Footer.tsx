import React from "react";
import LastestNews from "./LastestNews";
import PopularLinks from "./PopularLinks";
import Link from "next/link";
import { navbarLinks } from "@/constants";
import SocialMedia from "../common/SocialMedia";

const Footer = () => {
    return (
        <footer className="">
            <LastestNews />
            <PopularLinks />

            <section className="w-full flex flex-col justify-center items-center gap-8 bg-gray-100 p-4">
                <div className="flex flex-col justify-center items-center gap-2">
                    <h4 className="font-bold text-primary-900 uppercase">LINKS</h4>
                    <div className="flex gap-3">
                        {navbarLinks.map((item) => {
                            return (
                                <Link href={item.route} key={item.label}>
                                    <p className=" font-Century-751-BT text-sm text-primary-900 uppercase">
                                        {item.label}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

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
