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
    if (!db) {
      throw new Error('Database connection is not available');
    }

    const newsPath = 'blog/centralparkNews/newsletter';
    const newsRef = collection(db, newsPath);

    const newsQuery = query(
      newsRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const newsSnap = await getDocs(newsQuery);

    if (newsSnap.empty) {
      return NextResponse.json(null);
    }

    const docSnapshot = newsSnap.docs[0];
    const data = docSnapshot.data();
    let authorName = 'Docket Digest News Room';

    if (data.authorId) {
      try {
        const authorRef = doc(
          db,
          'blog/centralparkNews/authors',
          data.authorId
        );
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          const authorData = authorSnap.data();
          authorName = authorData.author_name;
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    }

    const result = {
      id: docSnapshot.id,
      title: data.title || '',
      content: data.content || '',
      category: data.category || 'N/A',
      imageURL: data.imageURL,
      authorId: data.authorId || '',
      authorName,
      titleSlug: data.titleSlug || '',
      type: 'newsletter',
      createdAt: data.createdAt,
      isFeatured: data.isFeatured || false,
      publishDate: {
        seconds: data.date?.seconds || new Date().getTime() / 1000,
        nanoseconds: data.date?.nanoseconds || 0,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching combined featured item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

