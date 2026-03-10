// lib/sitemapGenerator.ts - SEO best-practice sitemap for news/blog
// Index at /sitemap.xml, chunked post sitemaps at /sitemap-posts/1, /sitemap-posts/2, etc. (150 URLs per file)
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";

const NEWS_COLLECTION = "blog/centralparkNews/newsletter";
const POSTS_PER_SITEMAP = 150; // 100-200 per file for fast indexing

interface SitemapConfig {
  baseUrl: string;
  cacheDuration: number;
}

interface CacheEntry {
  content: string;
  timestamp: number;
}

/** Escape for XML so special chars in URLs don't break sitemap */
function escapeXmlInUrl(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

class SitemapGenerator {
  private cache = new Map<string, CacheEntry>();
  private readonly config: SitemapConfig;

  constructor(config: SitemapConfig) {
    this.config = config;
  }

  private getCached(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.timestamp > this.config.cacheDuration * 1000)
      return null;
    return entry.content;
  }

  private setCache(key: string, content: string) {
    this.cache.set(key, { content, timestamp: Date.now() });
  }

  /** Sitemap index: lists sitemap-pages.xml + sitemap-posts/1, 2, ... + sitemap-images.xml */
  async getSitemapIndex(): Promise<string> {
    const cacheKey = "index";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const postChunkCount = await this.getPostChunkCount();
    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXmlInUrl(`${this.config.baseUrl}/sitemap-pages.xml`)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

    for (let i = 1; i <= postChunkCount; i++) {
      xml += `
  <sitemap>
    <loc>${escapeXmlInUrl(`${this.config.baseUrl}/sitemap-posts/${i}`)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
    }
    
    // Add image sitemap
    xml += `
  <sitemap>
    <loc>${escapeXmlInUrl(`${this.config.baseUrl}/sitemap-images.xml`)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
    
    xml += `
</sitemapindex>`;

    this.setCache(cacheKey, xml);
    return xml;
  }

  /** Static pages + author pages: /, /news, /contact, /author/[slug], etc. */
  async getPagesSitemap(): Promise<string> {
    const cacheKey = "pages";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const now = new Date().toISOString();
    const pages: { url: string; lastmod: string }[] = [
      { url: "", lastmod: now },
      { url: "/news", lastmod: now },
      { url: "/contact", lastmod: now },
      { url: "/privacy-policy", lastmod: now },
      { url: "/terms-and-conditions", lastmod: now },
    ];

    // Add author pages
    const authors = await this.getAllAuthors();
    authors.forEach((author) => {
      pages.push({
        url: `/author/${author.slug || author.author_name.toLowerCase().replace(/\s+/g, "-")}`,
        lastmod: now,
      });
    });

    const xml = this.buildUrlset(pages);
    this.setCache(cacheKey, xml);
    return xml;
  }

  /** One chunk of post URLs (1-based chunk number, POSTS_PER_SITEMAP per chunk). Returns null if empty or out of range (route should 404). */
  async getPostsSitemap(chunkNum: number): Promise<string | null> {
    if (chunkNum < 1) return null;

    const cacheKey = `posts_${chunkNum}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const entries = await this.getPostChunk(chunkNum);
    if (entries.length === 0) return null;
    const xml = this.buildUrlset(entries);
    this.setCache(cacheKey, xml);
    return xml;
  }

  private buildUrlset(
    entries: { url: string; lastmod: string; changefreq?: string; priority?: string }[]
  ): string {
    const urls = entries
      .map((e) => {
        const loc = escapeXmlInUrl(this.config.baseUrl + (e.url.startsWith("/") ? e.url : "/" + e.url));
        const changefreq = e.changefreq != null ? `\n    <changefreq>${e.changefreq}</changefreq>` : "";
        const priority = e.priority != null ? `\n    <priority>${e.priority}</priority>` : "";
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${e.lastmod}</lastmod>${changefreq}${priority}
  </url>`;
      })
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  /** Number of sitemap files needed for all posts (0 if no posts, else ceil(total / POSTS_PER_SITEMAP)) */
  private async getPostChunkCount(): Promise<number> {
    if (!db) return 0;
    try {
      const total = await this.getTotalPublishedCount();
      return total === 0 ? 0 : Math.ceil(total / POSTS_PER_SITEMAP);
    } catch {
      return 0;
    }
  }

  private async getTotalPublishedCount(): Promise<number> {
    if (!db) return 0;
    try {
      const ref = collection(db, NEWS_COLLECTION);
      const q = query(ref, where("status", "==", "published"));
      const snap = await getCountFromServer(q);
      return snap.data().count ?? 0;
    } catch {
      return 0;
    }
  }

  /** Fetch one chunk of posts (1-based), each with url, lastmod, changefreq, priority */
  private async getPostChunk(
    chunkNum: number
  ): Promise<{ url: string; lastmod: string; changefreq: string; priority: string }[]> {
    if (!db) return [];

    const skip = (chunkNum - 1) * POSTS_PER_SITEMAP;
    let lastDoc: DocumentSnapshot | null = null;

    if (skip > 0) {
      const batchSize = 500;
      let skipped = 0;
      while (skipped < skip) {
        const toSkip = Math.min(batchSize, skip - skipped);
        let q = query(
          collection(db, NEWS_COLLECTION),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(toSkip)
        );
        if (lastDoc) {
          q = query(
            collection(db, NEWS_COLLECTION),
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(toSkip)
          );
        }
        const snap = await getDocs(q);
        if (snap.empty) return [];
        lastDoc = snap.docs[snap.docs.length - 1];
        skipped += snap.docs.length;
      }
    }

    let q = query(
      collection(db, NEWS_COLLECTION),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(POSTS_PER_SITEMAP)
    );
    if (lastDoc) {
      q = query(
        collection(db, NEWS_COLLECTION),
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(POSTS_PER_SITEMAP)
      );
    }

    const snap = await getDocs(q);
    return snap.docs.map((doc) => {
      const d = doc.data();
      const created = d.createdAt;
      let lastmod = new Date().toISOString();
      if (created) {
        if (typeof created.toDate === "function") lastmod = created.toDate().toISOString();
        else if (typeof created?.seconds === "number") lastmod = new Date(created.seconds * 1000).toISOString();
      }
      return {
        url: `/news/${d.titleSlug || doc.id}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.7",
      };
    });
  }

  private async getAllAuthors(): Promise<any[]> {
    if (!db) return [];
    try {
      const authorsRef = collection(db, "blog/centralparkNews/authors");
      const snapshot = await getDocs(authorsRef);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching authors for sitemap:", error);
      return [];
    }
  }

  getCacheStats() {
    const now = Date.now();
    return {
      cacheSize: this.cache.size,
      isGenerating: false,
      lastGeneration: now,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        page: key,
        articleCount: 0,
        ageMinutes: Math.round((now - value.timestamp) / 60000),
      })),
      postsPerSitemap: POSTS_PER_SITEMAP,
    };
  }
}

export const sitemapGenerator = new SitemapGenerator({
  baseUrl: "https://www.centralpark.news",
  cacheDuration: 900, // 15 min — faster discovery of new articles for news/ranking (was 3600)
});
