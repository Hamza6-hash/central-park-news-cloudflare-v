// lib/sitemapGenerator.ts - Background sitemap generation service
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";

interface SitemapConfig {
  baseUrl: string;
  articlesPerSitemap: number;
  maxSitemaps: number;
  cacheDuration: number;
}

interface GeneratedSitemap {
  page: number;
  content: string;
  timestamp: number;
  articleCount: number;
}

class BackgroundSitemapGenerator {
  private cache = new Map<string, GeneratedSitemap>();
  private readonly config: SitemapConfig;
  private isGenerating = false;
  private lastGeneration = 0;
  private readonly GENERATION_INTERVAL = 30 * 60 * 1000; // 30 minutes

  constructor(config: SitemapConfig) {
    this.config = config;
  }

  async getSitemap(page: number): Promise<string | null> {
    const cacheKey = `sitemap_${page}`;
    const cached = this.cache.get(cacheKey);

    // Check if cache is still valid
    if (
      cached &&
      Date.now() - cached.timestamp < this.config.cacheDuration * 1000
    ) {
      return cached.content;
    }

    // If not generating and cache is stale, trigger background generation
    if (
      !this.isGenerating &&
      Date.now() - this.lastGeneration > this.GENERATION_INTERVAL
    ) {
      this.generateSitemapsInBackground().catch(console.error);
    }

    // Return stale cache if available, otherwise generate on-demand
    if (cached) {
      return cached.content;
    }

    return await this.generateSitemapOnDemand(page);
  }

  private async generateSitemapsInBackground(): Promise<void> {
    if (this.isGenerating) return;

    this.isGenerating = true;
    this.lastGeneration = Date.now();

    try {
      console.log("Starting background sitemap generation...");

      // Generate sitemap index
      const indexContent = await this.generateSitemapIndex();
      this.cache.set("sitemap_0", {
        page: 0,
        content: indexContent,
        timestamp: Date.now(),
        articleCount: 0,
      });

      // Generate first few sitemaps (most important ones)
      const sitemapsToGenerate = Math.min(5, this.config.maxSitemaps);

      for (let page = 1; page <= sitemapsToGenerate; page++) {
        const content = await this.generateIndividualSitemap(page);
        this.cache.set(`sitemap_${page}`, {
          page,
          content,
          timestamp: Date.now(),
          articleCount: this.extractArticleCount(content),
        });
      }

      console.log(
        `Background sitemap generation completed. Generated ${
          sitemapsToGenerate + 1
        } sitemaps.`
      );
    } catch (error) {
      console.error("Error in background sitemap generation:", error);
    } finally {
      this.isGenerating = false;
    }
  }

  private async generateSitemapOnDemand(page: number): Promise<string> {
    if (page === 0) {
      return await this.generateSitemapIndex();
    } else {
      return await this.generateIndividualSitemap(page);
    }
  }

  private async generateSitemapIndex(): Promise<string> {
    const estimatedSitemaps = await this.estimateSitemapCount();

    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${this.config.baseUrl}/sitemap.xml?page=1</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;

    for (let i = 2; i <= estimatedSitemaps; i++) {
      sitemapIndex += `
  <sitemap>
    <loc>${this.config.baseUrl}/sitemap.xml?page=${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
    }

    sitemapIndex += `
</sitemapindex>`;

    return sitemapIndex;
  }

  private async generateIndividualSitemap(page: number): Promise<string> {
    let pages: any[] = [];

    if (page === 1) {
      pages = [
        { url: "", priority: "1.0", changefreq: "daily" },
        { url: "/news", priority: "0.8", changefreq: "daily" },
        { url: "/contact", priority: "0.6", changefreq: "monthly" },
        { url: "/privacy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms-and-conditions", priority: "0.3", changefreq: "yearly" },
      ];
    } else {
      pages = await this.getArticlesWithEfficientPagination(page);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${this.config.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return sitemap;
  }

  private async estimateSitemapCount(): Promise<number> {
    if (!db) return 5;

    try {
      const newsCollection = collection(db, "blog/centralparkNews/newsletter");
      const sampleQuery = query(
        newsCollection,
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(100)
      );

      const sampleSnapshot = await getDocs(sampleQuery);

      if (sampleSnapshot.empty) return 1;

      const oldestDoc = sampleSnapshot.docs[sampleSnapshot.docs.length - 1];
      const oldestDate = oldestDoc.data().createdAt?.toDate();

      if (!oldestDate) return 5;

      const daysDiff =
        (Date.now() - oldestDate.getTime()) / (1000 * 60 * 60 * 24);
      const estimatedYearlyTotal = Math.ceil(
        (100 / Math.max(daysDiff, 1)) * 365
      );
      const estimatedSitemaps = Math.ceil(
        estimatedYearlyTotal / this.config.articlesPerSitemap
      );

      return Math.min(Math.max(estimatedSitemaps, 5), this.config.maxSitemaps);
    } catch (error) {
      console.error("Error estimating sitemap count:", error);
      return 5;
    }
  }

  private async getArticlesWithEfficientPagination(
    page: number
  ): Promise<any[]> {
    if (!db) return [];

    const newsCollection = collection(db, "blog/centralparkNews/newsletter");

    try {
      const articlesToSkip = (page - 2) * this.config.articlesPerSitemap;
      let lastDoc: DocumentSnapshot | null = null;

      if (articlesToSkip > 0) {
        const batchSize = 500;
        let currentSkip = 0;

        while (currentSkip < articlesToSkip) {
          const remainingSkip = articlesToSkip - currentSkip;
          const currentBatchSize = Math.min(batchSize, remainingSkip);

          let queryRef = query(
            newsCollection,
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            limit(currentBatchSize)
          );

          if (lastDoc) {
            queryRef = query(
              newsCollection,
              where("status", "==", "published"),
              orderBy("createdAt", "desc"),
              startAfter(lastDoc),
              limit(currentBatchSize)
            );
          }

          const snapshot = await getDocs(queryRef);

          if (snapshot.empty) break;

          lastDoc = snapshot.docs[snapshot.docs.length - 1];
          currentSkip += snapshot.docs.length;

          if (currentSkip >= articlesToSkip) break;
        }
      }

      let finalQuery = query(
        newsCollection,
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(this.config.articlesPerSitemap)
      );

      if (lastDoc) {
        finalQuery = query(
          newsCollection,
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(this.config.articlesPerSitemap)
        );
      }

      const snapshot = await getDocs(finalQuery);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          url: `/news/${data.titleSlug}`,
          priority: "0.7",
          changefreq: "weekly",
          lastmod: data.createdAt
            ? new Date(data.createdAt).toISOString()
            : new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error("Error in efficient pagination:", error);
      return [];
    }
  }

  private extractArticleCount(content: string): number {
    const matches = content.match(/<url>/g);
    return matches ? matches.length : 0;
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      isGenerating: this.isGenerating,
      lastGeneration: this.lastGeneration,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        page: value.page,
        articleCount: value.articleCount,
        age: Date.now() - value.timestamp,
      })),
    };
  }
}

// Export singleton instance
export const sitemapGenerator = new BackgroundSitemapGenerator({
  baseUrl: "https://www.centralpark.news",
  articlesPerSitemap: 1000,
  maxSitemaps: 100,
  cacheDuration: 3600,
});
