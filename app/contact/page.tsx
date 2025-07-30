import AdBanner from "@/components/Ads/Adbanner";
import ContactClient from "@/components/ContactPage/ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Central Parks News",
  description: ": Got a tip or feedback? Contact Central Parks News for media inquiries or news leads.",
  keywords: "contact Central Parks News, Central Park NYC newsroom, submit a tip",
};

const Contacts = () => {
  return (
    <>
      <ContactClient />
    </>
  );
};

export default Contacts;
