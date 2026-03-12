import ContactClient from "@/components/ClientPages/ContactPage/ContactClient";
import SchemaOrg from "@/components/Schema";
import { Metadata } from "next";
import { liveUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us | Central Park News",
  description: "Got a tip or feedback? Contact Central Park News for media inquiries or news leads.",
  keywords: "contact Central Park News, Central Park NYC newsroom, submit a tip",
  alternates: {
    canonical: `${liveUrl}/contact`
  },
  openGraph: {
    title: "Contact Us | Central Park News",
    description: "Got a tip or feedback? Contact Central Park News for media inquiries or news leads.",
    url: `${liveUrl}/contact`,
    siteName: "Central Park News",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Central Park News",
    description: "Got a tip or feedback? Contact Central Park News for media inquiries or news leads.",
  },
};

const Contacts = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || liveUrl;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact/#webpage`,
    name: "Contact | Central Park News",
    url: `${siteUrl}/contact`,
    description: "Reach out to the Central Park News team for inquiries, press releases, or community tips.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
    dateModified: "2025-06-01T00:00:00Z",   
    lastReviewed: "2025-06-01T00:00:00Z",   
  };
  return (
    <>
      <SchemaOrg schemas={[webPageSchema]} />
      <ContactClient />
    </>
  );
};

export default Contacts;
