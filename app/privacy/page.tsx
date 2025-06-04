import PrivacyAndPolicy from '@/components/PrivacyAndPolicy/PrivacyAndPolicy'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy And Policy | Blockchain Briefing",
  description:
    "Have questions, tips, or partnership inquiries? Get in touch with the Blockchain Briefing team. We’d love to hear from you!",
  keywords:
    "contact blockchain news site, crypto media inquiries, blockchain briefing contact, submit crypto news, crypto press contact",
};


const Privacy = () => {
  return (
    <div className='h-screen'>
     <PrivacyAndPolicy/>
    </div>
  )
}

export default Privacy
