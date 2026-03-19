import {
  fetchCmsArticles,
  mapCmsArticleToList,
} from "@/lib/cmsApi";

function getImageUrl(img: string | { url?: string } | undefined): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  return (img as { url?: string }).url || "";
}

export async function getTotalPublishedCount() {
  const res = await fetchCmsArticles({ limit: 1, offset: 0 });
  if (!res?.success || !res.data) return 0;
  return res.data.total;
}

export async function getSitemapPostChunk(
  chunkNum: number,
  postsPerSitemap = 150
) {
  const offset = (chunkNum - 1) * postsPerSitemap;
  const res = await fetchCmsArticles({ limit: postsPerSitemap, offset });
  if (!res?.success || !res.data?.articles) return [];

  return res.data.articles.map((a) => {
    const mapped = mapCmsArticleToList(a);
    const created = mapped.publishDate || mapped.createdAt;
    const lastmod = created
      ? new Date(created).toISOString()
      : new Date().toISOString();
    return {
      url: `/news/${a.titleSlug || a.id}`,
      lastmod,
      changefreq: "weekly" as const,
      priority: "0.7",
    };
  });
}

export async function getAllArticleImages() {
  const images: { url: string; title: string }[] = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const res = await fetchCmsArticles({ limit, offset });
    if (!res?.success || !res.data?.articles || res.data.articles.length === 0)
      break;

    for (const a of res.data.articles) {
      const imgUrl = getImageUrl(a.featuredImage);
      if (imgUrl) {
        images.push({
          url: imgUrl,
          title: a.title || "Article image",
        });
      }
    }

    offset += limit;
    if (offset >= res.data.total) break;
  }

  return images;
}
