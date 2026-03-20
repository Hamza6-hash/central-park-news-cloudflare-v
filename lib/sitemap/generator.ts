import {
  getTotalPublishedCount,
  getSitemapPostChunk,
  getAllAuthors,
} from "@/lib/services";

const POSTS_PER_SITEMAP = 150;

interface SitemapConfig {
  baseUrl: string;
  cacheDuration: number;
}

interface CacheEntry {
  content: string;
  timestamp: number;
}

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

    const authors = await getAllAuthors();
    authors.forEach((author) => {
      const slug = author.slug ?? author.author_name.toLowerCase().replace(/\s+/g, "-");
      pages.push({ url: `/author/${slug}`, lastmod: now });
    });

    const xml = this.buildUrlset(pages);
    this.setCache(cacheKey, xml);
    return xml;
  }

  async getPostsSitemap(chunkNum: number): Promise<string | null> {
    if (chunkNum < 1) return null;

    const cacheKey = `posts_${chunkNum}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const entries = await getSitemapPostChunk(chunkNum, POSTS_PER_SITEMAP);
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

  private async getPostChunkCount(): Promise<number> {
    try {
      const total = await getTotalPublishedCount();
      return total === 0 ? 0 : Math.ceil(total / POSTS_PER_SITEMAP);
    } catch {
      return 0;
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
  cacheDuration: 900,
});
