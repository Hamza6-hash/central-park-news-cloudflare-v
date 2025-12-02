"use client";

import React, { useState } from "react";

const termsSections = [
    {
        title: "Acceptance of Terms",
        content: (
            <>
                By accessing and using Central Park News, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the website.
            </>
        ),
    },
    {
        title: "Use of the Website",
        content: (
            <>
                You agree to use the website for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the website.
            </>
        ),
    },
    {
        title: "Intellectual Property",
        content: (
            <>
                All content on the website, including text, graphics, and logos, is the property of Central Park News and is protected by intellectual property laws.
            </>
        ),
    },
    {
        title: "User Contributions",
        content: (
            <>
                If you submit content to the website, you grant us a non-exclusive, royalty-free license to use, reproduce, and distribute such content.
            </>
        ),
    },
    {
        title: "Disclaimers",
        content: (
            <>
                The content on Central Park News is for informational purposes only and does not constitute financial or investment advice.
            </>
        ),
    },
    {
        title: "Limitation of Liability",
        content: (
            <>
                Central Park News is not liable for any damages arising from your use of the website.
            </>
        ),
    },
    {
        title: "Changes to Terms",
        content: (
            <>
                We reserve the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date.
            </>
        ),
    },
    // {
    //     title: "Governing Law",
    //     content: (
    //         <>
    //             These Terms & Conditions are governed by the laws of US.
    //         </>
    //     ),
    // },
    {
        title: "Contact Us",
        content: (
            <>
                For any questions regarding these Terms & Conditions, please contact us at <a href="mailto:centralparknews@newtrix.app" className="text-blue-700">centralparknews@newtrix.app</a>.
            </>
        ),
    },
];

const TermsConditions = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <main className="w-full min-h-screen bg-white text-black">
            <div className="max-w-[1200px] mx-auto px-4 py-6">
                <hr className="w-64 h-0.5 mb-2 bg-gray-200" />
                <h1 className="text-3xl font-century-schoolbook font-normal text-[#2B4864] mb-2">
                    Terms & Conditions
                </h1>
                <p className="text-sm text-gray-400 mb-6">Effective Date: June 4, 2025</p>

                {/* Desktop Tabs */}
                <div className="hidden md:flex flex-row gap-6 min-h-[500px]">
                    {/* Sidebar Options */}
                    <aside className="md:w-1/3 border-r border-gray-300 pr-4">
                        <div className="sticky top-6">
                            {termsSections.map((section, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={`w-full text-left py-3 px-4 rounded-md mb-2 text-sm font-medium transition-colors ${index === selectedIndex
                                        ? "bg-blue-100 text-black border-l-4 border-blue-600"
                                        : "hover:bg-gray-100 text-[#2B4864]"
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <article className="md:w-2/3 text-sm leading-relaxed text-black">
                        <h2 className="text-xl font-semibold mb-4 text-[#2B4864]">
                            {termsSections[selectedIndex].title}
                        </h2>
                        <div className="prose prose-sm max-w-none text-black">
                            {termsSections[selectedIndex].content}
                        </div>
                    </article>
                </div>

                {/* Mobile Full List */}
                <div className="md:hidden flex flex-col gap-6">
                    {termsSections.map((section, index) => (
                        <section key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                            <h2 className="text-lg font-semibold mb-3 text-[#2B4864]">
                                {section.title}
                            </h2>
                            <div className="text-sm leading-relaxed text-black prose prose-sm max-w-none">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default TermsConditions;