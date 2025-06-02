import ContactClient from "@/components/ContactPage/ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Blockchain Briefing",
  description:
    "Have questions, tips, or partnership inquiries? Get in touch with the Blockchain Briefing team. We’d love to hear from you!",
  keywords:
    "contact blockchain news site, crypto media inquiries, blockchain briefing contact, submit crypto news, crypto press contact",
};

const Contacts = () => {
  return (
    <main className="w-[90vw] ">
      <ContactClient />

    </main>
  );
};

export default Contacts;
