import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
export const runtime = "edge";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || liveUrl).replace(/\/$/, "");
const PAGE_URL = `${siteUrl}/author/sarah-lee`;

export const metadata: Metadata = {
  title: "Sarah Lee | Staff Reporter | Central Park News",
  description:
    "Sarah Lee is a staff reporter at Central Park News specializing in Central Park events, NYC public safety, urban nature, and Manhattan community stories. Based in New York City.",
  keywords: [
    "Sarah Lee",
    "Central Park News reporter",
    "NYC journalist",
    "Central Park correspondent",
    "Manhattan community reporter",
    "New York City local news",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: PAGE_URL,
    title: "Sarah Lee | Staff Reporter | Central Park News",
    description:
      "Sarah Lee covers Central Park events, NYC public safety, and Manhattan community stories for Central Park News.",
    siteName: "Central Park News",
    images: [
      {
        url: `${siteUrl}/user.png`,
        width: 200,
        height: 200,
        alt: "Sarah Lee - Staff Reporter at Central Park News",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@centralparknews",
    title: "Sarah Lee | Staff Reporter | Central Park News",
    description:
      "Sarah Lee covers Central Park events, NYC public safety, and Manhattan community stories for Central Park News.",
    images: [`${siteUrl}/user.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/author/sarah-lee#author`,
  name: "Sarah Lee",
  jobTitle: "Staff Reporter",
  description:
    "Sarah Lee is a staff reporter at Central Park News covering community events, public safety, urban nature, and cultural stories in and around Central Park, Manhattan.",
  url: `${siteUrl}/author/sarah-lee`,
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/user.png`,
    width: 200,
    height: 200,
  },
  worksFor: {
    "@type": "NewsMediaOrganization",
    "@id": `${siteUrl}/#organization`,
    name: "Central Park News",
    url: siteUrl,
  },
  knowsAbout: [
    "Central Park",
    "New York City community events",
    "NYC public safety",
    "Manhattan neighborhoods",
    "Urban nature and wildlife",
    "Cultural events in New York City",
    "Central Park Conservancy",
    "New York City Parks Department",
  ],
  sameAs: [
    "https://www.centralpark.news/author/sarah-lee", 
  ],
};

export default function AuthorPage() {
  return (
    <>
      <SchemaOrg schemas={[authorSchema]} />
      <div className="min-h-screen bg-white lg:px-20">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-4 md:py-2">
          <div className="space-y-8">

            {/* Header */}
            <div className="space-y-4 mb-8">
              <hr className="w-48 sm:w-64 h-0.5 bg-gray-200" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-century-schoolbook capitalize leading-tight mb-4 text-[#2B4864]">
                  Sarah Lee
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-black font-poppins leading-relaxed">
                  Staff Reporter at Central Park News
                </p>
              </div>
            </div>

            <div className="space-y-8 font-poppins text-black leading-relaxed">

              {/* Bio Section */}
              <section className="space-y-4">
                <div className="flex gap-8 max-md:flex-col items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src="/user.png"
                      alt="Sarah Lee, Staff Reporter at Central Park News"
                      width={200}
                      height={200}
                      className="rounded-lg w-40 h-40 object-cover"
                      priority
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    {/*
                      BIO NOTES FOR E-E-A-T:
                      - Establishes specific subject matter expertise (Central Park beat)
                      - References real, verifiable institutions (Central Park Conservancy, NYPD, NYC Parks)
                      - Grounds the reporter in a real geographic community
                      - Uses active, specific language rather than generic claims
                      - Does NOT make unverifiable career claims (awards, decades of experience, etc.)
                    */}
                    <p className="text-sm sm:text-base text-black">
                      Sarah Lee is a staff reporter at Central Park News, where she covers the full range of stories that shape life in and around one of the world&apos;s most visited urban parks. Her beat spans community events, public safety developments, seasonal nature updates, and the human interest stories that reflect the daily rhythms of Central Park and the surrounding Manhattan neighborhoods.
                    </p>
                    <p className="text-sm sm:text-base text-black">
                      With a focus on accountability and community, Sarah regularly reports on announcements from the Central Park Conservancy, the NYC Parks Department, and the NYPD, translating official developments into clear, accessible reporting for the millions of New Yorkers and visitors who use the park each year. She is committed to timely, accurate local journalism that connects residents with the events and decisions that affect their neighborhood.
                    </p>
                    <p className="text-sm sm:text-base text-black">
                      Sarah is based in New York City. Have a tip or story idea? She welcomes community input — use the contact link below.
                    </p>
                  </div>
                </div>
              </section>

              {/* Coverage Areas */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                  Coverage Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Community Events
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      Festivals, concerts, cultural performances, and community gatherings across Central Park and Manhattan.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Public Safety
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      NYPD updates, park safety advisories, emergency responses, and community well-being initiatives.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Nature &amp; Environment
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      Seasonal wildlife, tree canopy updates, Central Park Conservancy restoration projects, and urban ecology.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Cultural Stories
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      Human interest reporting on the people, traditions, and cultural life that make Central Park unique.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact CTA */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-century-schoolbook font-bold text-[#2B4864]">
                  Get In Touch
                </h2>
                <p className="text-sm sm:text-base text-black">
                  Have a tip, story idea, or feedback? Central Park News relies on community input to bring you the most accurate and complete coverage of the park and surrounding neighborhoods.
                </p>
                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#E4212B] text-white font-poppins font-bold text-sm sm:text-base rounded hover:bg-red-700 transition-colors"
                  >
                    Contact Us →
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}