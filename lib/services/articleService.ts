import {
  fetchCmsArticles,
  fetchCmsArticleBySlug,
  mapCmsArticleToList,
  mapCmsArticleToSingle,
} from "@/lib/cmsApi";

/** Normalize date to legacy format for backward compatibility (Firebase-style) */
function toLegacyDate(date: Date | string | null | undefined) {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;
  return { seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
}

export async function getArticleBySlug(
  slug: string,
  _type: "news" | "article" = "news"
) {
  const res = await fetchCmsArticleBySlug(slug);
  if (!res?.success || !res.data) return null;

  const mapped = mapCmsArticleToSingle(res.data);
  return {
    ...mapped,
    citation: undefined,
    publishDate: mapped.publishDate || mapped.createdAt,
    date: mapped.publishDate || mapped.createdAt,
  };
}

export async function getRelatedArticles(
  category: string,
  slug: string,
  limit = 6
) {
  if (!category) return [];

  const res = await fetchCmsArticles({ limit: 60, offset: 0 });
  if (!res?.success || !res.data?.articles) return [];

  const filtered = res.data.articles
    .filter((a) => a.category === category && a.titleSlug !== slug)
    .slice(0, limit);

  return filtered.map((a) => ({
    ...mapCmsArticleToList(a),
    citation: undefined,
  }));
}

export async function getLatestArticles(
  limitCount: number,
  _type: "news" | "article" = "news"
) {
  const res = await fetchCmsArticles({ limit: limitCount });
  if (!res?.success || !res.data?.articles) return [];

  return res.data.articles.map((a) => ({
    ...mapCmsArticleToList(a),
    type: "news" as const,
  }));
}

export async function getTopStories(limitCount = 7) {
  const res = await fetchCmsArticles({
    isFeatured: true,
    limit: limitCount,
  });
  if (!res?.success || !res.data?.articles) return [];

  return res.data.articles.map((a) => ({
    ...mapCmsArticleToList(a),
    type: "newsletter" as const,
    publishDate: toLegacyDate(a.publishDate),
    mobileURL: mapCmsArticleToList(a).imageURL,
  }));
}

export async function getArticlesPaginated(
  page: number,
  itemsPerPage: number,
  type: "news" | "article" = "news"
) {
  const offset = (page - 1) * itemsPerPage;
  const res = await fetchCmsArticles({
    limit: itemsPerPage,
    offset,
  });
  if (!res?.success || !res.data) {
    return {
      items: [],
      totalPages: 0,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
      currentPage: page,
    };
  }

  const { articles, total } = res.data;
  const totalPages = Math.ceil(total / itemsPerPage);

  const items = articles.map((a) => ({
    ...mapCmsArticleToList(a),
    type,
    publishDate: toLegacyDate(a.publishDate),
    date: a.publishDate,
  }));

  return {
    items,
    totalPages,
    totalItems: total,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    currentPage: page,
  };
}
