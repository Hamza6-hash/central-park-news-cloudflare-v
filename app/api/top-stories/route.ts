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
  Timestamp,
} from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      throw new Error('Database connection is not available');
    }

    const newslettersRef = collection(db, 'blog/centralparkNews/newsletter');

    const q = query(
      newslettersRef,
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(7)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json([]);
    }

    // Batch author lookups to minimize database calls
    const authorIds = new Set<string>();
    const docs = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.authorId) {
        authorIds.add(data.authorId);
      }
      return { id: doc.id, data };
    });

    // Fetch all unique authors in parallel
    const authorPromises = Array.from(authorIds).map(async (authorId) => {
      try {
        const authorRef = doc(db, 'blog/centralparkNews/authors', authorId);
        const authorDoc = await getDoc(authorRef);
        return {
          id: authorId,
          name: authorDoc.exists()
            ? authorDoc.data().author_name || 'Docket Digest New Room'
            : 'Docket Digest New Room',
        };
      } catch (error) {
        console.error(`Error fetching author ${authorId}:`, error);
        return { id: authorId, name: 'Docket Digest New Room' };
      }
    });

    const authors = await Promise.all(authorPromises);
    const authorMap = new Map(
      authors.map((author) => [author.id, author.name])
    );

    // Map documents with author names
    const newsletters = docs.map(({ id, data }) => ({
      ...data,
      id,
      authorName: data.authorId
        ? authorMap.get(data.authorId) || 'Docket Digest New Room'
        : 'Docket Digest New Room',
      titleSlug: data.titleSlug || '',
      date: data.date as Timestamp,
      createdAt: data.createdAt,
      status: data.status,
      type: data.type || 'newsletter',
      isFeatured: data.isFeatured || false,
      updatedAt: data.updatedAt,
    }));

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

