import About from "@/components/ClientPages/About/About";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Central Park News",
    description:
        "Learn about Central Park News - your trusted source for Central Park and NYC local news, community events, and stories. Powered by AI-driven journalism.",
    keywords: [
        "About Central Park News",
        "Central Park news coverage",
        "NYC local news",
        "news aggregation",
        "community journalism"
    ],
    alternates: {
        canonical: `${liveUrl}/about`
    },
    openGraph: {
        title: "About Central Park News",
        description:
            "Learn about Central Park News - your trusted source for Central Park and NYC local news, community events, and stories.",
        url: `${liveUrl}/about`,
        siteName: "Central Park News",
        type: "website",
        images: [
            { url: `${liveUrl}/images/og-image.jpg` }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "About Central Park News",
        description:
            "Learn about Central Park News - your trusted source for Central Park and NYC local news, community events, and stories.",
    },
};

const AboutPage = () => {
    const siteUrl = liveUrl;

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${siteUrl}/about/#webpage`,
        name: "About | Central Park News",
        url: `${siteUrl}/about`,
        description: "Central Park News provides comprehensive coverage of Central Park and NYC community events with AI-driven journalistic content.",
        isPartOf: { "@id": `${siteUrl}/#website` },
        publisher: { "@id": `${siteUrl}/#organization` },
        dateModified: "2025-06-01T00:00:00Z",
        lastReviewed: "2025-06-01T00:00:00Z"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${siteUrl}/about/#faq`,
        mainEntity: [
            {
                "@type": "Question",
                name: "What is Central Park News?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Central Park News is your trusted source for comprehensive coverage of community events, local news, and stories happening in and around Central Park, New York City. We deliver fresh coverage and updates daily."
                }
            },
            {
                "@type": "Question",
                name: "How often do you update your news?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We update our news coverage daily to ensure you have the latest information about Central Park, Manhattan, and the surrounding NYC neighborhoods."
                }
            },
            {
                "@type": "Question",
                name: "Can I subscribe to Central Park News?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! You can subscribe to our newsletter to receive the latest news, updates, and stories directly in your inbox. Visit our subscription page to sign up."
                }
            },
            {
                "@type": "Question",
                name: "How can I contact you?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can reach us through our contact form on the website. We also welcome feedback and story suggestions from our readers."
                }
            },
            {
                "@type": "Question",
                name: "Is your news aggregated or original?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Central Park News combines community-driven coverage with AI-assisted journalism to bring you the most relevant and timely stories from Central Park and the surrounding New York City area."
                }
            }
        ]
    };

    return (
        <main>
            <SchemaOrg schemas={[webPageSchema, faqSchema]} />
            <About />
        </main>
    );
};

export default AboutPage;
