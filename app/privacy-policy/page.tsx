import PrivacyAndPolicy from '@/components/ClientPages/PrivacyAndPolicy/PrivacyAndPolicy'
import SchemaOrg from '@/components/Schema';
import { liveUrl } from '@/lib/utils';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Central Park News",
  description:
    "Read the Privacy Policy of Central Park News to learn how we handle your data, ensure user privacy, and protect your information.",
  keywords:
    "Central Park News privacy policy, data protection NYC news, user privacy Central Park, privacy terms",
  alternates: {
    canonical: `${liveUrl}/privacy-policy`
  }
};

const Privacy = () => {
  const siteUrl = liveUrl;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#privacy`,
    name: "Privacy Policy | Central Park News",
    url: `${siteUrl}/privacy-policy`,
    description: "Read the Privacy Policy of Central Park News to understand how we collect, use, and protect your personal information while delivering local news and stories.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  };
  return (
    <div>
      <SchemaOrg schemas={[webPageSchema]} />
      <PrivacyAndPolicy />
    </div>
  )
}

export default Privacy
