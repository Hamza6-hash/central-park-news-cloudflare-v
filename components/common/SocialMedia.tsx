import dynamic from "next/dynamic";
import React from "react";

const IoLogoLinkedin = dynamic(() => import("react-icons/io5").then(mod => mod.IoLogoLinkedin));
const FaInstagram = dynamic(() => import("react-icons/fa6").then(mod => mod.FaInstagram));
const FaTwitter = dynamic(() => import("react-icons/fa").then(mod => mod.FaTwitter));
const FaFacebookSquare = dynamic(() => import("react-icons/fa").then(mod => mod.FaFacebookSquare));

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
    return (
        <div className="rounded-full border border-primary-900 p-1.5 cursor-pointer">
            {icon}
        </div>
    );
};

const SocialMedia = () => {
    const socialMediaArray = [
        {
            icon: <IoLogoLinkedin className="text-primary-900" size={15} />,
            link: ''
        },
        {
            icon: <FaInstagram className="text-primary-900" size={15} />,
            link: ''
        },
        {
            icon: <FaTwitter className="text-primary-900" size={15} />,
            link: ''
        },
        {
            icon: <FaFacebookSquare className="text-primary-900" size={15} />,
            link: ''
        },
    ]

    return (
        <section className="flex gap-[15px]">
            {socialMediaArray.map((item, index) => {

                return (<React.Fragment key={index}>
                    <SocialMediaTag icon={item.icon} link={item.link} />
                </React.Fragment>)
            })}
        </section>
    );
};

export default SocialMedia;
