import { prisma } from "@/lib/db";

export async function getAuthorById(authorId: string | null) {
  if (!authorId) return null;
  return prisma.author.findUnique({
    where: { id: authorId },
  });
}

export async function getAuthorName(authorId: string): Promise<string> {
  try {
    if (!authorId) return "Unknown Author";
    const author = await getAuthorById(authorId);
    return author?.author_name || author?.name || "Unknown Author";
  } catch (error) {
    console.error("Error fetching author:", error);
    return "Unknown Author";
  }
}

export async function getAllAuthors() {
  return prisma.author.findMany();
}
