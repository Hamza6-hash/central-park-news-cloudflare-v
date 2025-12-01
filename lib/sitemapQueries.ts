
// lib/sitemapQueries.ts
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit, startAfter, DocumentSnapshot } from 'firebase/firestore';

export interface SitemapArticle {
  titleSlug: string;
  createdAt: string;
}

export async function getArticlesForSitemap(
  page: number, 
  pageSize: number = 1000,
  lastDoc?: DocumentSnapshot
): Promise<{ articles: SitemapArticle[], lastDoc: DocumentSnapshot | null }> {
  try {
    if (!db) throw new Error('Database not available');

    const newsCollection = collection(db, 'blog/centralparkNews/newsletter');
    let q = query(
      newsCollection,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // Use cursor-based pagination for better performance
    if (lastDoc) {
      q = query(
        newsCollection,
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const articles: SitemapArticle[] = snapshot.docs.map(doc => ({
      titleSlug: doc.data().titleSlug,
      createdAt: doc.data().createdAt
    }));

    return {
      articles,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return { articles: [], lastDoc: null };
  }
}

export async function getTotalArticleCount(): Promise<number> {
  try {
    if (!db) return 0;

    const newsCollection = collection(db, 'blog/centralparkNews/newsletter');
    const q = query(newsCollection, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting total article count:', error);
    return 0;
  }
}
