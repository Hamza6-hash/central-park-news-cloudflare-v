import PrivacyAndPolicy from '@/components/ClientPages/PrivacyAndPolicy/PrivacyAndPolicy'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Central Park News",
  description:
    "Read the Privacy Policy of Central Park News to learn how we handle your data, ensure user privacy, and protect your information.",
  keywords:
    "Central Park News privacy policy, data protection NYC news, user privacy Central Park, privacy terms",
};



const Privacy = () => {
  return (
    <div>
      <PrivacyAndPolicy />
    </div>
  )
}

export default Privacy
