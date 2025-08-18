import TermsAndCondition from '@/components/ClientPages/TermsAndConditions/TermsAndCondition'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Central Park News",
  description:
    "Review the Terms and Conditions for using Central Park News. Learn about user guidelines, legal policies, and our commitment to delivering trusted news.",
  keywords:
    "Central Park News terms, NYC news site policies, user agreement Central Park News, legal terms",
};

const Terms = () => {
  return (
    <div className='bg-primary-100'>
      <TermsAndCondition />

    </div>

  )
}

export default Terms
