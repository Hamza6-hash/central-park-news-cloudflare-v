import TermsAndCondition from '@/components/TermsAndConditions/TermsAndCondition'
import React from 'react'


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms And Condition | Blockchain Briefing",
  description:
    "Welcome to Blockchain Briefing. By accessing our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part, please do not use our services.",
  keywords:
    "contact blockchain news site, crypto media inquiries, blockchain briefing contact, submit crypto news, crypto press contact",
};

const Terms = () => {
  return (
    <div>
        <TermsAndCondition />
    </div>

  )
}

export default Terms
