"use client";
import { email } from "@/constants";
import { liveUrl } from "@/lib/utils";
import React from "react";

const policySections = [
  {
    title: "Introduction",
    content: (
      <>
        Welcome to Central Park News ("we," "our," or "us"). This Privacy Policy explains
        how we collect, use, disclose, and safeguard your information when you visit our
        website, <a href={liveUrl} className="text-blue-600 underline">centralpark.news</a>, or engage with our services. Central Park News curates
        and presents news content using advanced machine learning and automation technologies,
        rather than traditional journalism practices. We are committed to protecting your
        privacy and ensuring transparency in how we handle your information. Please read
        this policy carefully to understand your rights and our responsibilities.
      </>
    ),
  },
  {
    title: "Information We Collect",
    content: (
      <>
        <p>
          <b>Information You Provide Directly:</b> We collect the following personal information
          when you voluntarily provide it through forms or communication:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Email address (e.g., for subscriptions or inquiries)</li>
          <li>Name (optional, where submitted)</li>
          <li>Any personal details shared in messages or feedback</li>
        </ul>

        <p className="mt-3">
          <b>Information Collected Automatically:</b> When you visit our website, we automatically
          collect certain information through cookies and analytics tools, including:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device identifiers</li>
          <li>Referring website or search terms</li>
          <li>Pages viewed and time spent on our site</li>
          <li>Clickstream data</li>
        </ul>

        <p className="mt-3">
          <b>Information from Third Parties:</b> We may receive data from trusted third-party services
          to enhance our platform functionality, such as:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Analytics Providers (e.g., Google Analytics)</li>
          <li>Email Service Providers (e.g., Mailchimp, SendGrid)</li>
          <li>Content Delivery Networks and Hosting Providers</li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <ul className="list-disc list-inside">
        <li>To operate, maintain, and improve our website and services</li>
        <li>To send you newsletters or updates you have opted into</li>
        <li>To analyze usage patterns for website performance and optimization</li>
        <li>To respond to user inquiries and provide customer support</li>
        <li>To enhance and personalize your user experience</li>
        <li>To detect, prevent, and respond to technical issues and security threats</li>
      </ul>
    ),
  },
  {
    title: "Automated Content and AI Disclosure",
    content: (
      <>
        Central Park News uses proprietary algorithms and machine learning models to:
        <ul className="list-disc list-inside mt-2">
          <li>Summarize or paraphrase verified news from vetted sources</li>
          <li>Generate reporting-style content based on publicly available data or press releases</li>
        </ul>
        These processes do not involve the use of user-submitted personal information for training
        or content generation.
      </>
    ),
  },
  {
    title: "Legal Bases for Processing (GDPR Applicability)",
    content: (
      <>
        If you are located in the European Economic Area (EEA), our legal bases for processing
        your personal data may include:
        <ul className="list-disc list-inside mt-2">
          <li>Your consent (e.g., subscribing to a newsletter)</li>
          <li>Compliance with legal obligations</li>
          <li>Our legitimate interests in operating and improving our services</li>
        </ul>
      </>
    ),
  },
  {
    title: "Sharing and Disclosure of Information",
    content: (
      <>
        <p>
          <b>Service Providers:</b> We may share your information with third-party service providers
          to perform services on our behalf, such as email marketing, web hosting, and analytics.
        </p>
        <p className="mt-3">
          <b>Legal Requirements:</b> We may disclose your information to comply with applicable laws,
          respond to lawful requests by public authorities, or protect the rights, safety, and property
          of Central Park News or others.
        </p>
        <p className="mt-3">
          <b>Business Transfers:</b> In the event of a merger, acquisition, or sale of assets, your
          information may be transferred as part of that transaction.
        </p>
        <p className="mt-3">
          <b>Public Forums:</b> If we enable comments or public feedback, any personal information you
          choose to post may become publicly visible. Use discretion when sharing such data.
        </p>
      </>
    ),
  },
  {
    title: "Cookies and Tracking Technologies",
    content: (
      <>
        We use cookies and similar technologies to enable essential website functions, monitor site
        usage, and customize your experience. You can manage your cookie preferences through your
        browser settings or via cookie banners provided on our site.
      </>
    ),
  },
  {
    title: "Your Rights and Choices",
    content: (
      <>
        Depending on your location, you may have the following rights:
        <ul className="list-disc list-inside mt-2">
          <li>Access to your personal data</li>
          <li>Correction of inaccuracies</li>
          <li>Erasure of your data (right to be forgotten)</li>
          <li>Restriction of data processing</li>
          <li>Portability of data</li>
          <li>Objection to certain processing</li>
          <li>Withdrawal of Consent at any time</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, please contact us at{" "}
          <a href={`mailto:${email}@newtrix.app`} className="text-blue-600 underline">
            {email}@newtrix.app
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Data Security",
    content: (
      <>
        We implement appropriate technical and organizational safeguards to protect your information,
        including secure HTTPS connections, restricted access controls, data encryption during
        transmission, and regular monitoring. While we strive to protect your data, no method
        of transmission over the internet is completely secure.
      </>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <>
        We retain personal data only as long as necessary for the purposes outlined in this policy
        or to meet legal requirements. Criteria for determining retention include duration of your
        engagement, legal obligations, and nature of the data collected.
      </>
    ),
  },
  {
    title: "International Users",
    content: (
      <>
        If you are accessing our site from outside the United States, your information may be
        transferred to, stored in, or processed in the U.S. By using our services, you consent
        to this transfer.
      </>
    ),
  },
  {
    title: "Children's Privacy",
    content: (
      <>
        Our services are not directed to children under 13 (or under 16 in the EU). We do not knowingly
        collect or solicit personal data from minors. If you believe a child has provided us information,
        contact us to delete it.
      </>
    ),
  },
  {
    title: "Third-Party Links and Services",
    content: (
      <>
        Our website may contain links to external websites not operated by us. We are not responsible
        for the privacy practices or content of those sites. We encourage you to review their privacy
        policies.
      </>
    ),
  },
  {
    title: "Changes to This Privacy Policy",
    content: (
      <>
        We may update this Privacy Policy periodically. Changes will be posted on this page with a
        revised Effective Date. Continued use of our services after updates signifies acceptance
        of the new terms.
      </>
    ),
  },
  {
    title: "Contact Information",
    content: (
      <>
        If you have any questions, concerns, or requests regarding this Privacy Policy, please contact:
        <div className="mt-3">
          <p><b>Central Park News</b></p>
          <p>
            Email:{" "}
            <a href="mailto:centralparknews@newtrix.app" className="text-blue-600 underline">
              {email}@newtrix.app
            </a>
          </p>
          <p>Attn: Privacy Compliance Officer</p>
        </div>
      </>
    ),
  },
];

const PrivacyAndPolicy = () => {
  return (
    <div className="min-h-screen bg-white lg:px-20">
      <div className="w-full mx-auto">
        <hr className="w-64 h-0.5 mb-2 bg-gray-200" />
        <h1 className="text-4xl font-bold text-[#2B4864] mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">
          Effective Date: 10-06-2025
        </p>
        <div className="space-y-8">
          {policySections.map((section, index) => (
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

export default PrivacyAndPolicy;