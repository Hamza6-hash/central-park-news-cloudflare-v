import SchemaOrg from '@/components/Schema';
import { liveUrl } from '@/lib/utils';
import { Metadata } from "next";
import dynamic from 'next/dynamic';

// 1. Define the component dynamically
const DynamicTermsAndCondition = dynamic(
  () => import('@/components/ClientPages/TermsAndConditions/TermsAndCondition'),
);


export const metadata: Metadata = {
  title: "Terms and Conditions | Central Park News",
  description:
    "Review the Terms and Conditions for using Central Park News. Learn about user guidelines, legal policies, and our commitment to delivering trusted news.",
  keywords:
    "Central Park News terms, NYC news site policies, user agreement Central Park News, legal terms",
  alternates: {
    canonical: `${liveUrl}/terms-and-conditions`
  }
};

const Terms = () => {
  const siteUrl = liveUrl;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#terms`,
    name: "Terms and Conditions | Central Park News",
    url: `${siteUrl}/terms`,
    description:
      "Welcome to Central Park News. By using our website, you agree to comply with these Terms and Conditions and our Privacy Policy.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  }

  return (
    <div className='bg-primary-100'>
      <SchemaOrg schemas={[webPageSchema]} />
      <DynamicTermsAndCondition />
    </div>

  )
}

export default Terms
