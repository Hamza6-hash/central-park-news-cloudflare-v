import {
  fetchCmsArticles,
  mapCmsArticleToList,
} from "@/lib/cmsApi";

export async function searchArticles(
  searchTerm: string,
  limitCount = 10
) {
  const normalized = searchTerm.trim();
  if (!normalized) return [];

  const res = await fetchCmsArticles({
    search: normalized,
    limit: limitCount,
  });

  if (!res?.success || !res.data?.articles) return [];

  return res.data.articles.map((a) => {
    const mapped = mapCmsArticleToList(a);
    return {
      id: mapped.id,
      title: mapped.title,
      content: mapped.content,
      imageURL: mapped.imageURL || "",
      authorName: mapped.authorName,
      createdAt: mapped.createdAt || "",
      titleSlug: mapped.titleSlug,
      type: "news" as const,
      category_name: mapped.category_name || "Local News",
    };
  });
}
