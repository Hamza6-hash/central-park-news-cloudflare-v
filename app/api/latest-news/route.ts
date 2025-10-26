import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    if (!db) throw new Error('Database connection is not available');

    const limitCount = parseInt(request.nextUrl.searchParams.get('limit') || '12', 10);

    const collectionPath = 'blog/centralparkNews/newsletter';
    const articlesRef = collection(db, collectionPath);
    const articlesQuery = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const articlesSnapshot = await getDocs(articlesQuery);

    if (articlesSnapshot.empty) {
      return NextResponse.json([]);
    }

    const articlesData = await Promise.all(
      articlesSnapshot.docs.map(async (articleDoc) => {
        const articleData = articleDoc.data();

        let authorName = 'Unknown Author';
        if (articleData.authorId) {
          try {
            const authorDocRef = doc(
              db,
              'blog/centralparkNews/authors',
              articleData.authorId
            );
            const authorDoc = await getDoc(authorDocRef);
            if (authorDoc.exists()) {
              const authorData = authorDoc.data();
              authorName = authorData.author_name || 'Unknown Author';
            }
          } catch (error) {
            console.error('Error fetching author:', error);
          }
        }

        let formattedDate = 'Unknown Date';
        if (articleData.createdAt) {
          try {
            const date = new Date(articleData.createdAt);
            formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          } catch (error) {
            console.error('Error formatting date:', error);
          }
        }

        return {
          ...articleData,
          id: articleDoc.id,
          authorName,
          formattedDate,
          createdAt: articleData?.createdAt || formattedDate,
          publishDate: formattedDate,
          titleSlug: articleData.titleSlug,
          type: 'news' as const,
        };
      })
    );

    articlesData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(articlesData);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

