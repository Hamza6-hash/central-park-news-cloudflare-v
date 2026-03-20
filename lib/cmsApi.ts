import { CMS_BASE_URL } from "./utils";


const RAW_KEY = process.env.CMS_API_KEY || "";
const CMS_API_KEY = RAW_KEY.includes(":") ? RAW_KEY.split(":")[1]?.trim() || RAW_KEY : RAW_KEY;

function getHeaders() {
  return {
    "x-api-key": CMS_API_KEY,
    "Content-Type": "application/json",
  };
}

export interface CmsArticleList {
  id: string;
  title: string;
  titleSlug: string;
  excerpt?: string;
  featuredImage?: string | { url?: string };
  category?: string;
  content?: string;
  tags?: string[] | string;
  publishDate?: string;
  author?: { authorName?: string; position?: string };
}

export interface CmsArticleSingle extends CmsArticleList {
  content?: string;
}

export interface CmsListResponse {
  success: boolean;
  data: {
    articles: CmsArticleList[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CmsSingleResponse {
  success: boolean;
  data: CmsArticleSingle;
}

function getImageUrl(img: string | { url?: string } | undefined): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  return (img as { url?: string }).url || "";
}

export function mapCmsArticleToList(item: CmsArticleList) {
  return {
    id: item.id,
    title: item.title,
    titleSlug: item.titleSlug,
    content: item?.content || "",
    excerpt: item.excerpt,
    imageURL: getImageUrl(item.featuredImage),
    authorName: item.author?.authorName || "Unknown Author",
    category: item.category,
    category_name: item.category,
    tags: item.tags,
    publishDate: item.publishDate,
    createdAt: item.publishDate,
    formattedDate: item.publishDate
      ? new Date(item.publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    type: "news" as const,
    mobileURL: getImageUrl(item.featuredImage),
  };
}

export function mapCmsArticleToSingle(item: CmsArticleSingle) {
  return {
    id: item.id,
    title: item.title,
    titleSlug: item.titleSlug,
    content: item.content || "",
    excerpt: item.excerpt,
    imageURL: getImageUrl(item.featuredImage),
    authorName: item.author?.authorName || "Unknown Author",
    authorImage: "/default-avatar.png",
    authorPosition: item.author?.position || "Central Park News",
    category: item.category,
    tags: item.tags,
    publishDate: item.publishDate,
    createdAt: item.publishDate,
    formattedDate: item.publishDate
      ? new Date(item.publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown Date",
    socialImageUrls: item.featuredImage
      ? { mobile: { url: getImageUrl(item.featuredImage) }, facebook: { url: getImageUrl(item.featuredImage) } }
      : undefined,
  };
}

const emptyListResponse: CmsListResponse = {
  success: false,
  data: { articles: [], total: 0, limit: 0, offset: 0 },
};

export async function fetchCmsArticles(params: {
  limit?: number;
  offset?: number;
  isFeatured?: boolean;
  search?: string;
}): Promise<CmsListResponse> {
  try {
    const sp = new URLSearchParams();
    sp.set("status", "published");
    sp.set("type", "newsletter");
    if (params.limit != null) sp.set("limit", String(params.limit));
    if (params.offset != null) sp.set("offset", String(params.offset));
    if (params.isFeatured === true) sp.set("isFeatured", "true");
    if (params.search) sp.set("search", params.search);
    sp.set("source", "centralparkNews");

    const res = await fetch(`${CMS_BASE_URL}/api/v1/articles?${sp}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return emptyListResponse;
    }
    return res.json();
  } catch {
    return emptyListResponse;
  }
}

export async function fetchCmsArticleBySlug(slug: string): Promise<CmsSingleResponse | null> {
  try {
    const res = await fetch(
      `${CMS_BASE_URL}/api/v1/articles/slug/${encodeURIComponent(slug)}?source=centralparkNews`,
      {
        headers: getHeaders(),
        next: { revalidate: 300 },
      }
    );

    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
