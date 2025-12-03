"use client";
import { email } from "@/constants";
import React from "react";

const termsSections = [
    {
        title: "Acceptance of Terms",
        content: (
            <>
                By accessing and using Central Park News, you agree to be bound by these
                Terms & Conditions. If you do not agree, please do not use the website.
            </>
        ),
    },
    {
        title: "Use of the Website",
        content: (
            <>
                You agree to use the website for lawful purposes and in a way that does
                not infringe the rights of others or restrict their use of the website.
            </>
        ),
    },
    {
        title: "Intellectual Property",
        content: (
            <>
                All content on the website, including text, graphics, and logos, is the
                property of Central Park News and is protected by intellectual property
                laws.
            </>
        ),
    },
    {
        title: "User Contributions",
        content: (
            <>
                If you submit content to the website, you grant us a non-exclusive,
                royalty-free license to use, reproduce, and distribute such content.
            </>
        ),
    },
    {
        title: "Disclaimers",
        content: (
            <>
                The content on Central Park News is for informational purposes only and
                does not constitute financial or investment advice.
            </>
        ),
    },
    {
        title: "Limitation of Liability",
        content: (
            <>
                Central Park News is not liable for any damages arising from your use of
                the website.
            </>
        ),
    },
    {
        title: "Changes to Terms",
        content: (
            <>
                We reserve the right to modify these Terms & Conditions at any time.
                Changes will be posted on this page with an updated effective date.
            </>
        ),
    },
    {
        title: "Contact Us",
        content: (
            <>
                For any questions regarding these Terms & Conditions, please contact us
                at <a href={`mailto:${email}@newstrix.app`} className="text-blue-600 underline">{email}@newtrix.app.</a>
            </>
        ),
    },
];

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="w-full mx-auto">
                <h1 className="text-4xl font-bold text-[#2B4864] mb-2">
                    Terms & Conditions
                </h1>
                <p className="text-gray-600 mb-8">
                    Effective Date: June 4, 2025
                </p>

                {/* Full Page Content */}
                <div className="space-y-8">
                    {termsSections.map((section, index) => (
                        <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0">
                            <h2 className="text-2xl font-bold text-[#2B4864] mb-3">
                                {section.title}
                            </h2>
                            <p className="text-black leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;