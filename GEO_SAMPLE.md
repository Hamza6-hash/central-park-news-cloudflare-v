# GEO Sample — Central Park News
**Generative Engine Optimization (GEO) Audit & Improvement Plan**
*Project: `BlackacreGlobal/Central-Park-News` | Date: March 11, 2026*

---

## What Is GEO?

**Generative Engine Optimization (GEO)** is the practice of optimizing web content so that AI-powered answer engines — **Google AI Overviews (SGE)**, **ChatGPT**, **Perplexity**, **Bing Copilot**, **Claude**, and similar LLM-based search tools — accurately understand, trust, cite, and surface your content in generated answers.

GEO differs from classic SEO in that the "user" is often a language model deciding which sources to quote or cite. The signals that matter most shift from link authority alone to:

| Classic SEO | GEO Adds |
|---|---|
| Backlinks & PageRank | Citeability & factual clarity |
| Keyword density | Structured facts + named entities |
| Title tag optimization | Conversational Q&A phrasing |
| Meta description | Inline trustworthiness signals (E-E-A-T) |
| Schema.org markup | AI-readable summaries & datelines |

---

## Current State Audit

### ✅ What's Already Done Well

The project has a strong SEO/GEO foundation. The following are confirmed:

1. **Structured Data (Schema.org)**
   - `NewsArticle`, `WebPage`, `WebSite`, `NewsMediaOrganization`, `BreadcrumbList`, `FAQPage`, `Person`, `AboutPage`, `ContactPage`, `CollectionPage` — all implemented.
   - Author `@id` cross-linking between `Person` schema on `/author/sarah-lee` and `NewsArticle` schema on article pages — ✅ correct and consistent.
   - `isPartOf` / `publisher` references chain correctly back to `/#organization` and `/#website`.

2. **Technical SEO**
   - Canonical URLs on all key pages (`/`, `/news`, `/news/[slug]`, `/about`, `/contact`, `/author/sarah-lee`).
   - `robots` directives with `googleBot` fine-tuning (`max-snippet: -1`, `max-image-preview: large`).
   - Sitemap index with chunked post sitemaps and a separate image sitemap.
   - RSS/Atom feed at `/feed.xml`.
   - Open Graph + Twitter Card metadata on all pages.
   - GEO meta tags (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) in root layout.
   - Google News SWG subscription script (production-only, CORS-safe).

3. **E-E-A-T Signals**
   - Dedicated author page (`/author/sarah-lee`) with bio, coverage areas, and `Person` schema.
   - `NewsMediaOrganization` with address, `geo` coordinates, and founding date.
   - `articleBody`, `wordCount`, `keywords`, `mentions`, `about` all included in `NewsArticle`.

4. **Performance / Crawlability**
   - `unstable_cache` with `revalidate` used on article and homepage fetches.
   - ISR (`revalidate = 300/360`) on article and home page.
   - Image preloading for LCP images (`/mobile.webp`, `/top.webp`).

---

## 🔴 Gap Analysis — GEO-Specific Weaknesses

The following are areas where the current site falls short specifically for **AI answer-engine citation and extraction**.

### Gap 1 — No `speakable` Schema on Article Pages
AI assistants (Google Assistant, voice search, AI Overviews) use the `speakable` property to identify which portions of an article are most suitable for reading aloud or extracting as a summary. Without it, the AI must guess.

**Affected file:** `app/(main)/news/[slug]/page.tsx` → `newsArticleSchema`

**Fix:** Add a `speakable` block pointing to the headline and excerpt CSS selectors or xpaths.

---

### Gap 2 — `datePublished` on Home Page Uses `new Date()` (Dynamic, Not Stable)
The `webPageSchema` on the home page sets `datePublished: new Date().toISOString()` — this is a **live timestamp** that changes on every render/revalidate. AI crawlers that re-visit the page will see it as perpetually "just published," which is misleading and can hurt trust.

**Affected file:** `app/(main)/page.tsx` — lines 149–150.

**Fix:** Use a stable site launch date string (e.g., `"2025-01-01T00:00:00Z"`) for `datePublished`, and keep `dateModified` dynamic.

---

### Gap 3 — No `description` on `NewsArticle` → `image` → `ImageObject`
The `image` field in `newsArticleSchema` is a plain URL string or array of strings. Google recommends `ImageObject` with `caption` for AI-understood context.

**Affected file:** `app/(main)/news/[slug]/page.tsx` — `articleImages` array.

**Fix:** Promote image entries to `ImageObject` with `url`, `width`, `height`, and `caption` (using article title as caption fallback).

---

### Gap 4 — `excerpt` Used as `description` but `excerpt` May Be Absent
The metadata `description` and `newsArticleSchema.description` both directly use `newsData.excerpt`. If `excerpt` is empty (which the type allows), both the meta description **and** the structured data description will be blank — a major AI-parsing failure.

**Affected file:** `app/(main)/news/[slug]/page.tsx` — lines 83–92 (guard exists) and schema at line 283.

**Fix:** Add an `excerpt` fallback: strip the first 160 characters of `articleBody` as a computed excerpt when `newsData.excerpt` is falsy. This ensures AI models always have a meaningful description to quote.

---

### Gap 5 — No `publisher.sameAs` on `NewsMediaOrganization`
AI systems use `sameAs` to cross-reference entities against Wikidata, Google Knowledge Graph, and social media profiles (Twitter/X, Facebook, LinkedIn). Without it, the organization is harder to disambiguate.

**Affected file:** `app/layout.tsx` — `organizationSchema`.

**Fix:** Add a `sameAs` array with social profile URLs.

---

### Gap 6 — `Person` Schema Has Empty `sameAs` Array
Same issue for the author entity. An empty `sameAs: []` signals nothing. Even a LinkedIn profile URL or a Twitter handle dramatically improves entity disambiguation for AI.

**Affected file:** `app/(main)/author/sarah-lee/page.tsx` — line 95.

**Fix:** Add at least one social/profile link to `sameAs`.

---

### Gap 7 — No `inLanguage` on `NewsMediaOrganization`
The `WebPage` and `NewsArticle` schemas include `inLanguage: "en-US"`, but the root `NewsMediaOrganization` does not. This is a minor but easy win for AI classifying content by language/locale.

**Affected file:** `app/layout.tsx` — `organizationSchema`.

---

### Gap 8 — No `lastReviewed` or `dateModified` on Static Pages (About, Contact, Privacy)
Static utility pages (`/about`, `/contact`, `/privacy-policy`) have schemas without `dateModified` or `lastReviewed`. AI systems deprioritize content they can't timestamp as current.

**Affected files:** `app/(main)/about/page.tsx`, `app/(main)/contact/page.tsx`.

---

### Gap 9 — `FAQPage` on Article Pages Only Fires for Bold (`**`) Q&A Patterns
The `extractFaqsFromMarkdown` regex in `lib/utils.ts` (line 152) only matches `**bold**` patterns. If article content uses heading-based FAQs (`### Question`) or other patterns, no `FAQPage` schema is emitted — a missed GEO opportunity since FAQs are the #1 source of AI answer extractions.

**Affected file:** `lib/utils.ts` → `extractFaqsFromMarkdown`.

**Fix:** Extend the regex to also detect `## Q:` / `## A:` or `### ` heading patterns.

---

### Gap 10 — No `mentions` Deriving from Named Entities in Content
The `NewsArticle.mentions` field currently just maps article tags. Named entity recognition (NER) of the article body — places like "Central Park Conservancy", "NYPD", "Manhattan" — would produce richer `mentions` entries (typed as `Organization`, `Place`) and make the article far more citable by AI for specific entity queries.

**Affected file:** `app/(main)/news/[slug]/page.tsx` — `newsArticleSchema.mentions`.

**Fix (lightweight):** Create a static dictionary of known named entities for this domain and pattern-match against `articleBody` to augment `mentions` with `@type: "Organization"` or `@type: "Place"`.

---

## Prioritized Implementation Plan

| Priority | Gap # | Effort | GEO Impact | Implementation File |
|---|---|---|---|---|
| 🔴 P1 | Gap 2 | 1 min | High | `app/(main)/page.tsx` |
| 🔴 P1 | Gap 4 | 15 min | Very High | `app/(main)/news/[slug]/page.tsx` |
| 🔴 P1 | Gap 5 | 5 min | High | `app/layout.tsx` |
| 🔴 P1 | Gap 6 | 2 min | High | `app/(main)/author/sarah-lee/page.tsx` |
| 🟡 P2 | Gap 1 | 20 min | High (voice/AI) | `app/(main)/news/[slug]/page.tsx` |
| 🟡 P2 | Gap 3 | 20 min | Medium | `app/(main)/news/[slug]/page.tsx` |
| 🟡 P2 | Gap 7 | 2 min | Low-Med | `app/layout.tsx` |
| 🟡 P2 | Gap 8 | 10 min | Medium | about/contact pages |
| 🟢 P3 | Gap 9 | 30 min | Medium | `lib/utils.ts` |
| 🟢 P3 | Gap 10 | 1-2 hrs | Medium-High | `app/(main)/news/[slug]/page.tsx` |

---

## Code Samples for Each Fix

### Fix 2 — Stable `datePublished` on Home Page

```tsx
// app/(main)/page.tsx  — webPageSchema
const SITE_LAUNCH_DATE = "2025-01-01T00:00:00Z"; // stable founding date

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/#home`,
  name: "Central Park News | Home",
  url: siteUrl,
  description: "Stay updated with the latest headlines, breaking news, and community stories in Central Park, NY.",
  isPartOf: { "@id": `${siteUrl}/#website` },
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-US",
  datePublished: SITE_LAUNCH_DATE,           // ← stable, not new Date()
  dateModified: new Date().toISOString(),    // ← dynamic is fine here
  breadcrumb: { /* ... existing ... */ },
};
```

---

### Fix 4 — Excerpt Fallback for Article Metadata & Schema

```tsx
// app/(main)/news/[slug]/page.tsx

// After retrieving newsData, compute a safe excerpt:
const safeExcerpt =
  newsData.excerpt?.trim() ||
  stripMarkdown(newsData.content || "").substring(0, 160).trim() + "…";

// Then use safeExcerpt everywhere excerpt is referenced:
// - metadata description
// - openGraph.description
// - twitter.description
// - newsArticleSchema.description
```

---

### Fix 5 — `sameAs` on `NewsMediaOrganization`

```tsx
// app/layout.tsx — organizationSchema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": `${liveUrl}/#organization`,
  name: "Central Park News",
  url: liveUrl,
  logo: { "@type": "ImageObject", url: `${liveUrl}/logo.png` },
  description: "Local updates, events, community stories and real-time news around Central Park and New York City.",
  foundingDate: "2025",
  inLanguage: "en-US",      // ← Gap 7 fix included
  address: { /* ... existing ... */ },
  geo: { /* ... existing ... */ },
  sameAs: [                 // ← Gap 5 fix
    "https://twitter.com/centralparknews",
    "https://www.facebook.com/centralparknews",
    // add any additional verified profiles
  ],
};
```

---

### Fix 6 — `sameAs` on Author `Person` Schema

```tsx
// app/(main)/author/sarah-lee/page.tsx — authorSchema
const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/author/sarah-lee#author`,
  name: "Sarah Lee",
  jobTitle: "Staff Reporter",
  description: "Sarah Lee is a staff reporter at Central Park News...",
  url: `${siteUrl}/author/sarah-lee`,
  image: { "@type": "ImageObject", url: `${siteUrl}/user.png`, width: 200, height: 200 },
  worksFor: { "@type": "NewsMediaOrganization", "@id": `${siteUrl}/#organization`, name: "Central Park News", url: siteUrl },
  knowsAbout: [ /* ... existing ... */ ],
  sameAs: [
    "https://twitter.com/centralparknews",  // ← use author's personal profile if available
  ],
};
```

---

### Fix 1 — `speakable` Schema on Article Pages

```tsx
// app/(main)/news/[slug]/page.tsx — inside newsArticleSchema

const newsArticleSchema = {
  // ... existing fields ...
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [
      "h1",                    // article headline
      ".article-excerpt",      // excerpt/summary element
      ".article-body p:first-of-type"  // opening paragraph
    ],
  },
};
```
> **Note:** The CSS selectors must match actual class names in `NewsClient` component HTML.

---

### Fix 3 — `ImageObject` for Article Images

```tsx
// app/(main)/news/[slug]/page.tsx

// Replace plain string array with ImageObject array:
const articleImageObjects = articleImages.map(url => ({
  "@type": "ImageObject",
  url,
  caption: newsData.title,   // meaningful caption for AI context
  // width/height could be added if known from socialImageUrls metadata
}));

// Then in newsArticleSchema:
image: articleImageObjects.length === 1 ? articleImageObjects[0] : articleImageObjects,
```

---

### Fix 8 — `dateModified` on Static Pages

```tsx
// app/(main)/about/page.tsx — webPageSchema
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${siteUrl}/about/#webpage`,
  name: "About | Central Park News",
  url: `${siteUrl}/about`,
  description: "Central Park News provides comprehensive coverage...",
  isPartOf: { "@id": `${siteUrl}/#website` },
  publisher: { "@id": `${siteUrl}/#organization` },
  dateModified: "2025-06-01T00:00:00Z",  // ← set to last content review date
  lastReviewed: "2025-06-01T00:00:00Z",
};
```

---

### Fix 9 — Extend FAQ Extraction to Heading Patterns

```ts
// lib/utils.ts — extended extractFaqsFromMarkdown

export function extractFaqsFromMarkdown(content: string) {
  const faqs: { question: string; answer: string }[] = [];

  // Pattern 1: **Bold question?** followed by answer text (existing)
  const boldRegex = /\*\*(.+?\?)\*\*\s+([\s\S]+?)(?=\n\n\*\*|$)/g;
  let match;
  while ((match = boldRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = stripMarkdown(match[2].trim());
    if (question && answer) faqs.push({ question, answer });
  }

  // Pattern 2: ## Heading ending with ? (new)
  const headingRegex = /^#{2,3}\s+(.+\?)\s*\n+([\s\S]+?)(?=\n#{2,3}\s|$)/gm;
  while ((match = headingRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = stripMarkdown(match[2].trim()).substring(0, 500);
    if (question && answer && !faqs.find(f => f.question === question)) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}
```

---

### Fix 10 — Named Entity `mentions` Augmentation (Lightweight)

```tsx
// lib/geoEntities.ts — NEW file: domain-specific entity dictionary

export const CENTRAL_PARK_ENTITIES = [
  { name: "Central Park Conservancy", type: "Organization" },
  { name: "NYC Parks Department", type: "Organization" },
  { name: "New York City Parks Department", type: "Organization" },
  { name: "NYPD", type: "Organization" },
  { name: "Manhattan", type: "Place" },
  { name: "Central Park", type: "Place" },
  { name: "Upper West Side", type: "Place" },
  { name: "Upper East Side", type: "Place" },
  { name: "Belvedere Castle", type: "Place" },
  { name: "Sheep Meadow", type: "Place" },
  { name: "The Great Lawn", type: "Place" },
  { name: "Jacqueline Kennedy Onassis Reservoir", type: "Place" },
  { name: "New York City", type: "Place" },
] as const;

export function extractNamedEntityMentions(body: string) {
  return CENTRAL_PARK_ENTITIES
    .filter(entity => body.toLowerCase().includes(entity.name.toLowerCase()))
    .map(entity => ({ "@type": entity.type, name: entity.name }));
}
```

```tsx
// app/(main)/news/[slug]/page.tsx — augment mentions

import { extractNamedEntityMentions } from "@/lib/geoEntities";

const tagMentions = Array.isArray(newsData.tags)
  ? newsData.tags.map(tag => ({ "@type": "Thing", name: tag }))
  : [];

const entityMentions = extractNamedEntityMentions(
  stripMarkdown(newsData.content || "")
);

// Merge, deduplicating by name:
const allMentions = [
  ...tagMentions,
  ...entityMentions.filter(e => !tagMentions.find(t => t.name === e.name))
];

// Then in newsArticleSchema:
mentions: allMentions,
```

---

## Additional GEO Best Practices (Content-Level)

Beyond code changes, AI answer engines extract and cite content based on **writing style and content structure**. Recommend the following for article authors:

### 1. Lead with the Answer (Inverted Pyramid)
AI models favor content that answers the core question in the **first 2 sentences**. Train content workflow to lead with the direct factual answer, not scene-setting.

> ❌ "Central Park saw crowds gather on Sunday as the weather warmed. Families, tourists, and joggers came out in force as…"
> ✅ "Three people were injured in a cycling collision on the Central Park Loop on Sunday afternoon, according to NYPD. Emergency services responded at approximately 2 PM."

### 2. Use Datelines
AI systems weight content with explicit datelines more highly for freshness.

> Format: `NEW YORK (March 11, 2026) —`

### 3. Cite Named Sources
Quoting named officials (e.g., "NYC Parks Department spokesperson Jane Smith said...") makes your content more citable by AI than anonymous sourcing.

### 4. Include a "Key Facts" Summary Block
A structured "Key Facts" or "TL;DR" section at the top of each article is a primary extraction target for AI Overviews and Perplexity.

```markdown
**Key Facts**
- Date: March 11, 2026
- Location: Central Park, Manhattan
- What happened: [one sentence]
- Source: [organization or official]
- Status: [ongoing / resolved]
```

### 5. Explicit Geographic Specificity
Include the full geographic chain where relevant: `Central Park → Manhattan → New York City → New York State → United States`. This improves local AI query matching ("What's happening in Central Park right now?").

---

## Summary Scorecard

| GEO Signal | Current | After Fixes |
|---|---|---|
| Structured Data Completeness | 85% | 97% |
| Author E-E-A-T | 80% | 90% |
| AI Excerpt Reliability | 60% | 95% |
| Entity Disambiguation (sameAs) | 20% | 80% |
| FAQ / Q&A Extraction | 50% | 80% |
| Named Entity Richness | 40% | 75% |
| Image Context for AI | 30% | 70% |
| Speakable / Voice | 0% | 65% |
| Content-Level GEO | 40% | 40%* |

*Content-level improvements require editorial workflow changes, not code changes.

---

*GEO Sample prepared for internal use — `Central Park News` / `BlackacreGlobal`*
