import ContactClient from "@/components/ClientPages/ContactPage/ContactClient";
import SchemaOrg from "@/components/Schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Central Parks News",
  description: "Got a tip or feedback? Contact Central Parks News for media inquiries or news leads.",
  keywords: "contact Central Parks News, Central Park NYC newsroom, submit a tip",
};

const Contacts = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cross-bay-news.com";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#webpage`,
    name: "Contact | Cross Bay Current",
    url: `${siteUrl}/contact`,
    description: "Reach out to the Cross Bay Current team for inquiries, press releases, or community tips.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  };

  return (
    <>
      <SchemaOrg schemas={[webPageSchema]} />
      <ContactClient />
    </>
  );
};

export default Contacts;
