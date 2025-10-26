import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const type = request.nextUrl.searchParams.get('type') || 'news';

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Determine collection path based on type
    const collectionPath = type === 'article' 
      ? 'blog/centralparkNews/articles' 
      : 'blog/centralparkNews/newsletter';

    const itemsRef = collection(db, collectionPath);
    const q = query(itemsRef, where('titleSlug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(null, { status: 404 });
    }

    const itemDoc = querySnapshot.docs[0];
    const itemData = itemDoc.data();

    if (!itemData || itemData.status !== 'published') {
      return NextResponse.json(null, { status: 404 });
    }

    // Fetch author information
    let authorName = 'Unknown Author';
    let authorPosition = 'Unknown Position';
    let authorImage = '/default-avatar.png';

    if (itemData.authorId) {
      try {
        const authorRef = doc(db, 'blog/centralparkNews/authors', itemData.authorId);
        const authorDoc = await getDoc(authorRef);

        if (authorDoc.exists()) {
          const authorData = authorDoc.data();
          authorName = authorData.author_name || 'Unknown Author';
          authorPosition = authorData.position || 'Unknown Position';
          authorImage = authorData.imageURL || '/default-avatar.png';
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    }

    // Format date
    let formattedDate = 'Unknown Date';
    if (itemData.createdAt) {
      try {
        const date = new Date(itemData.createdAt);
        formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (err) {
        console.error('Error formatting date:', err);
      }
    }

    const result = {
      ...itemData,
      id: itemDoc.id,
      authorName,
      position: authorPosition,
      authorImage,
      formattedDate,
      createdAt: formattedDate,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

