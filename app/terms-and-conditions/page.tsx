import TermsAndCondition from '@/components/ClientPages/TermsAndConditions/TermsAndCondition'
import SchemaOrg from '@/components/Schema';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Central Park News",
  description:
    "Review the Terms and Conditions for using Central Park News. Learn about user guidelines, legal policies, and our commitment to delivering trusted news.",
  keywords:
    "Central Park News terms, NYC news site policies, user agreement Central Park News, legal terms",
};

const Terms = () => {
  const siteUrl = 'https://crossbaycurrent.vercel.app';

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#terms`,
    name: "Terms and Conditions | Central Park News",
    url: `${siteUrl}/terms`,
    description:
      "Welcome to Cross Bay News. By using our website, you agree to comply with these Terms and Conditions and our Privacy Policy.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  }

  return (
    <div className='bg-primary-100'>
      <SchemaOrg schemas={[webPageSchema]} />
      <TermsAndCondition />
    </div>

  )
}

export default Terms
