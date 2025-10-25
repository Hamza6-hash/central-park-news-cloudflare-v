// next-sitemap.config.js
const { liveUrl } = require('./lib/utils');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: liveUrl,
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
          href: liveUrl,
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
    additionalSitemaps: [`${liveUrl}/sitemap.xml`],
  },
};
