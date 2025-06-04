"use client";
import React, { useState } from "react";

const policySections = [
    {
        title: "Introduction",
        content: (
            <>
                Welcome to Blockchain Briefing. We are committed to protecting your personal
                information and your right to privacy. This Privacy Policy outlines how we
                collect, use, and safeguard your information when you visit our website.
            </>
        ),
    },
    {
        title: "Information We Collect",
        content: (
            <>
                <p>
                    <b>Personal Information:</b> When you subscribe to our newsletter or contact
                    us, we may collect personal details such as your name and email address.
                </p>
                <p className="mt-3">
                    <b>Usage Data:</b> We may collect information on how you access and use the
                    website, including your IP address, browser type, and pages visited.
                </p>
            </>
        ),
    },
    {
        title: "How We Use Your Information",
        content: (
            <ul className="list-disc list-inside">
                <li>Provide and maintain our services</li>
                <li>Communicate with you, including sending newsletters</li>
                <li>Improve our website and user experience</li>
            </ul>
        ),
    },
    {
        title: "Cookies and Tracking Technologies",
        content: (
            <>We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings.</>
        ),
    },
    {
        title: "Data Sharing and Disclosure",
        content: (
            <>We do not sell or rent your personal information to third parties. We may share information with service providers who assist us in operating the website, subject to confidentiality agreements.</>
        ),
    },
    {
        title: "Data Security",
        content: (
            <>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</>
        ),
    },
    {
        title: "Your Rights",
        content: (
            <>Depending on your location, you may have rights under data protection laws, including the right to access, correct, or delete your personal information.</>
        ),
    },
    {
        title: "Changes to This Privacy Policy",
        content: (
            <>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</>
        ),
    },
    {
        title: "Contact Us",
        content: (
            <>If you have any questions about this Privacy Policy, please contact us at [Insert Contact Email].</>
        ),
    },
];

const SideTabbedPolicy = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <main className="w-full h-full bg-white text-black">

            <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
            <h1 className="text-3xl font-bold text-primary-300 font-century-schoolbook mb-2">
                Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-6">Effective Date: June 4, 2025</p>
            <div className="max-w-[1200px] px-5 mx-auto ">
                {/* Desktop Tabs */}
                <div className="hidden md:flex flex-row gap-6">
                    {/* Sidebar Options */}
                    <aside className="md:w-1/3 border-r border-gray-300 pr-4">
                        {policySections.map((section, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={`w-full text-left py-2 px-3 rounded-md mb-2 text-sm font-medium ${index === selectedIndex ? "bg-primary-100 text-primary-600" : "hover:bg-gray-100"
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </aside>

                    {/* Paragraph Content */}
                    <article className="md:w-2/3 whitespace-pre-line text-sm leading-relaxed text-black">
                        <h2 className="text-xl font-semibold mb-2">{policySections[selectedIndex].title}</h2>
                        <div>{policySections[selectedIndex].content}</div>
                    </article>
                </div>

                {/* Mobile Full List */}
                <div className="md:hidden flex flex-col gap-6">
                    {policySections.map((section, index) => (
                        <section key={index} className="border-b border-gray-300 pb-4">
                            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                            <div className="text-sm leading-relaxed">{section.content}</div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default SideTabbedPolicy;
