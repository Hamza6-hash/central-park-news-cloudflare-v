import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const PAGE_URL = `${liveUrl}/author/sarah-lee`;

export const metadata: Metadata = {
  title: "Sarah Lee | Author | Central Park News",
  description:
    "Sarah Lee is a staff reporter at Central Park News covering events, public safety, nature, and community stories in Central Park, NYC.",
  keywords: ["Sarah Lee", "Central Park News", "author", "journalist", "reporter"],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: PAGE_URL,
    title: "Sarah Lee | Central Park News",
    description: "Staff reporter covering Central Park, NYC.",
  },
  twitter: {
    card: "summary",
    title: "Sarah Lee | Central Park News",
    description: "Staff reporter covering Central Park, NYC.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${PAGE_URL}#author`,
  name: "Sarah Lee",
  jobTitle: "Staff Reporter",
  description:
    "Sarah Lee is a staff reporter at Central Park News covering events, public safety, nature, and community stories in Central Park, NYC.",
  url: PAGE_URL,
  worksFor: {
    "@type": "Organization",
    name: "Central Park News",
    url: liveUrl,
  },
};

export default function AuthorPage() {
  return (
    <>
      <SchemaOrg schemas={[authorSchema]} />
      <div className="min-h-screen bg-white lg:px-20">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="space-y-8">

            {/* Header Section */}
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

            {/* Author Content */}
            <div className="space-y-8 font-poppins text-black leading-relaxed">

              {/* Author Bio Section */}
              <section className="space-y-4">
                <div className="flex gap-8 max-md:flex-col items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src="/user.png" // replace with actual image path
                      alt="Sarah Lee - Staff Reporter"
                      width={200}
                      height={200}
                      className="rounded-lg w-40 h-40 object-cover"
                      priority
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-sm sm:text-base text-black">
                      Sarah Lee is a dedicated staff reporter at Central Park News, bringing you comprehensive coverage of one of New York City&apos;s most iconic landmarks. With a passion for community journalism, she delivers timely and accurate reporting on the events, stories, and developments that shape Central Park and the surrounding Manhattan neighborhoods.
                    </p>
                    <p className="text-sm sm:text-base text-black">
                      Her reporting focuses on community events, public safety updates, seasonal nature stories, and the human elements that make Central Park such a special place for millions of visitors each year.
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
                      Festivals, performances, and gatherings that bring the community together.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Public Safety
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      Updates on park safety, emergency responses, and community well-being.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Nature & Environment
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      Seasonal changes, wildlife updates, and environmental stories.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E4212B] rounded-full flex-shrink-0"></span>
                      Cultural Stories
                    </h3>
                    <p className="text-sm sm:text-base text-black">
                      Human interest pieces and cultural happenings in Central Park.
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
                  Have a tip, story idea, or feedback for Sarah? We welcome community input to help us bring you the best coverage of Central Park news.
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