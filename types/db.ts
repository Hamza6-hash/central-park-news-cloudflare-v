import { prisma } from "@/lib/db";

/** Prisma Article model (no relations) */
export type Article = Awaited<ReturnType<typeof prisma.article.findMany>>[number];

/** Article with author relation included */
export type ArticleWithAuthor = Awaited<
  ReturnType<typeof prisma.article.findMany<{ include: { author: true } }>>
>[number];

/** Social image URLs structure */
export interface SocialImageUrls {
  mobile?: { url: string };
  facebook?: { url: string };
  twitter?: { url: string };
  original?: { url: string };
}
