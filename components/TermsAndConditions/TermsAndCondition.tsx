"use client";

import React, { useState, useEffect } from "react";

const termsSections = [
    {
        title: "Acceptance of Terms",
        content: (
            <>
                By accessing and using Blockchain Briefing, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the website.
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
                All content on the website, including text, graphics, and logos, is the property of Blockchain Briefing and is protected by intellectual property laws.
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
                The content on Blockchain Briefing is for informational purposes only and does not constitute financial or investment advice.
            </>
        ),
    },
    {
        title: "Limitation of Liability",
        content: (
            <>
                Blockchain Briefing is not liable for any damages arising from your use of the website.
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
    {
        title: "Governing Law",
        content: (
            <>
                These Terms & Conditions are governed by the laws of [Insert Jurisdiction].
            </>
        ),
    },
    {
        title: "Contact Us",
        content: (
            <>
                For any questions regarding these Terms & Conditions, please contact us at [Insert Contact Email].
            </>
        ),
    },
];

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}

const TermsConditions = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isMobile = useIsMobile();

    return (
        <main className="w-full  bg-white text-black px-3">
            <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
            <h1 className="text-3xl font-bold text-primary-300 font-century-schoolbook mb-2">
                Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500 mb-6">Effective Date: June 4, 2025</p>

            <div className="max-w-[1200px] mx-auto flex  flex-col md:flex-row gap-6">
                {/* Sidebar tabs for desktop */}
                {!isMobile && (
                    <aside className="md:w-1/3 border-r border-gray-300 pr-4">
                        {termsSections.map((section, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={`w-full text-left py-2 px-3 rounded-md mb-2 text-sm font-medium ${index === selectedIndex
                                        ? "bg-primary-100 text-primary-600"
                                        : "hover:bg-gray-100"
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </aside>
                )}

                {/* Content */}
                <article className="md:w-2/3 w-full whitespace-pre-line text-sm leading-relaxed text-black">
                    {isMobile ? (
                        // On mobile show all sections vertically
                        termsSections.map((section, index) => (
                            <section key={index} className="mb-8">
                                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                                <div>{section.content}</div>
                            </section>
                        ))
                    ) : (
                        // On desktop show only selected section
                        <>
                            <h2 className="text-xl font-semibold mb-2">
                                {termsSections[selectedIndex].title}
                            </h2>
                            <div>{termsSections[selectedIndex].content}</div>
                        </>
                    )}
                </article>
            </div>
        </main>
    );
};

export default TermsConditions;
