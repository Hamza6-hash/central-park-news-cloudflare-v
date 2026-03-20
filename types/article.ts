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
