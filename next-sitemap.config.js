/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://centralpark.news",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  generateIndexSitemap: true,
  exclude: ["/admin/*"],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: "https://centralpark.news",
          hreflang: "en",
        },
      ],
    };
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "GeminiBot", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [`https://centralpark.news/sitemap.xml`],
  },
};
