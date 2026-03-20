/** Display type for featured/home article */
export interface FeaturedArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  imageURL?: string | null;
  authorId: string;
  authorName: string;
  mobileURL: string;
  titleSlug: string;
  type: "newsletter";
  createdAt: Date;
  isFeatured: boolean;
  publishDate?: { seconds: number; nanoseconds: number };
}

/** Single news article from CMS (detail page server data + NewsClient initialData) */
export interface NewsSingleArticle {
  id: string;
  title: string;
  titleSlug: string;
  content: string;
  excerpt?: string;
  imageURL?: string;
  authorName?: string;
  authorImage?: string;
  authorPosition?: string;
  category?: string;
  tags?: string[] | string;
  publishDate?: string;
  createdAt?: string;
  formattedDate?: string;
  socialImageUrls?: {
    mobile?: { url?: string };
    facebook?: { url?: string };
    twitter?: { url?: string };
    original?: { url?: string };
  };
  citation?: string;
  date?: string | { seconds: number; nanoseconds: number };
  /** Legacy / optional when data comes only from CMS */
  authorId?: string;
  updatedAt?: string;
  status?: string;
  position?: string;
}

/** Related article cards on the news single page (subset of CMS list fields) */
export interface RelatedNewsItem {
  id: string;
  title: string;
  content: string;
  titleSlug?: string;
  imageURL?: string;
  authorName?: string;
  publishDate?: string;
  createdAt?: string;
  category?: string;
  category_name?: string;
}

/** Search result item */
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  imageURL: string;
  authorName: string;
  createdAt: string;
  titleSlug: string;
  type: "news";
  category_name: string;
}
