"use client";

import React from "react";
import Link from "next/link";

export default function About() {
    return (
        <div className="min-h-screen bg-white lg:px-20">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="space-y-4 mb-8">
                        <hr className="w-48 sm:w-64 h-0.5 bg-gray-200" />
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-century-schoolbook capitalize leading-tight mb-4 text-[#2B4864]">
                                About Central Park News
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-black font-poppins leading-relaxed">
                                Your trusted source for Central Park and New York City community news, stories, and updates.
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8 font-poppins text-black leading-relaxed">
                        {/* Mission Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                                Our Mission
                            </h2>
                            <p className="text-sm sm:text-base text-black">
                                Central Park News is dedicated to delivering timely, accurate, and comprehensive coverage of Central Park and the surrounding New York City community. We bring you the latest stories about events, developments, and news that matter to locals and visitors alike.
                            </p>
                            <p className="text-sm sm:text-base text-black">
                                Our mission is to keep the community informed and connected through quality news reporting and storytelling, leveraging cutting-edge technology to gather and curate the most relevant content.
                            </p>
                        </section>

                        {/* What We Cover Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                                What We Cover
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                                        Community Events
                                    </h3>
                                    <p className="text-sm sm:text-base text-black">
                                        Stay updated on festivals, performances, and community gatherings in and around Central Park.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                                        Local News
                                    </h3>
                                    <p className="text-sm sm:text-base text-black">
                                        Breaking news and updates affecting Central Park and the Manhattan community.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                                        Park Updates
                                    </h3>
                                    <p className="text-sm sm:text-base text-black">
                                        Information about park improvements, closures, and announcements from park management.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                                        Feature Stories
                                    </h3>
                                    <p className="text-sm sm:text-base text-black">
                                        In-depth stories, interviews, and human interest pieces from the Central Park community.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* How We Work Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                                How We Work
                            </h2>
                            <p className="text-sm sm:text-base text-black">
                                Central Park News leverages advanced machine learning and AI technology to intelligently aggregate, analyze, and present news content from trusted sources. Our system works around the clock to:
                            </p>
                            <ul className="space-y-3 list-none">
                                <li className="flex gap-3 items-start">
                                    <span className="w-6 h-6 min-w-[24px] rounded-full bg-[#E4212B] text-white flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold">1</span>
                                    <span className="text-sm sm:text-base text-black">Monitor and collect news from authoritative sources and official channels</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="w-6 h-6 min-w-[24px] rounded-full bg-[#E4212B] text-white flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold">2</span>
                                    <span className="text-sm sm:text-base text-black">Analyze content to extract the most important information and context</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="w-6 h-6 min-w-[24px] rounded-full bg-[#E4212B] text-white flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold">3</span>
                                    <span className="text-sm sm:text-base text-black">Present stories in a clear, accessible format for our readers</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="w-6 h-6 min-w-[24px] rounded-full bg-[#E4212B] text-white flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold">4</span>
                                    <span className="text-sm sm:text-base text-black">Update content continuously as new information becomes available</span>
                                </li>
                            </ul>
                        </section>

                        {/* Technology Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                                Technology
                            </h2>
                            <p className="text-sm sm:text-base text-black">
                                We utilize state-of-the-art AI and machine learning technologies to enhance your news experience:
                            </p>
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-3">
                                <div>
                                    <h4 className="font-bold text-black mb-2 text-sm sm:text-base">Intelligent Categorization</h4>
                                    <p className="text-sm sm:text-base text-black">Our algorithms automatically categorize news into relevant topics for easy browsing.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black mb-2 text-sm sm:text-base">Content Summarization</h4>
                                    <p className="text-sm sm:text-base text-black">Complex stories are distilled into concise, readable summaries without losing important details.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black mb-2 text-sm sm:text-base">Real-time Updates</h4>
                                    <p className="text-sm sm:text-base text-black">Breaking news is identified and surfaced immediately, keeping you informed as events unfold.</p>
                                </div>
                            </div>
                        </section>

                        {/* Transparency Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                                Our Commitment to Transparency
                            </h2>
                            <p className="text-sm sm:text-base text-black">
                                We believe in transparency about how we operate. Central Park News uses AI-assisted technology to enhance our news coverage, but we always prioritize accuracy and editorial integrity. We are committed to:
                            </p>
                            <ul className="space-y-2 list-disc list-inside text-black text-sm sm:text-base">
                                <li>Clearly sourcing and attributing all information</li>
                                <li>Fact-checking content before publication</li>
                                <li>Disclosing our use of AI and automation technologies</li>
                                <li>Correcting errors promptly and transparently</li>
                                <li>Protecting your privacy and personal data</li>
                                <li>Providing multiple ways to contact us with feedback and concerns</li>
                            </ul>
                        </section>

                        {/* Contact Section */}
                        <section className="space-y-4 p-4 sm:p-6 rounded-lg">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                                Stay Connected
                            </h2>
                            <p className="text-sm sm:text-base text-black">
                                Have a story tip? Want to get in touch? Subscribe to our newsletter for daily updates or reach out directly through our contact page.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#E4212B] text-white font-poppins font-bold text-sm sm:text-base rounded hover:bg-red-700 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
