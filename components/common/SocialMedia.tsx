import React from "react";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
    return (
        <div className="rounded-full border border-primary-900 p-2 cursor-pointer">
            {icon}
        </div>
    );
};

const SocialMedia = () => {
    const socialMediaArray = [
        {
            icon: <IoLogoLinkedin className="text-primary-900" size={20} />,
            link: ''
        },
        {
            icon: <FaInstagram className="text-primary-900" size={20} />,
            link: ''
        },
        {
            icon: <FaTwitter className="text-primary-900" size={20} />,
            link: ''
        },
        {
            icon: <FaFacebookSquare className="text-primary-900" size={20} />,
            link: ''
        },
    ]

    return (
        <section className="flex gap-4">
            {socialMediaArray.map((item) => {

                return (<React.Fragment key={item.link}>
                    <SocialMediaTag icon={item.icon} link={item.link} />
                </React.Fragment>)
            })}
        </section>
    );
};

export default SocialMedia;
