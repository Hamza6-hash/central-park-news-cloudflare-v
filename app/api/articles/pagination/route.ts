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
  startAfter,
  limit,
  getCountFromServer,
} from 'firebase/firestore';
import { defultImage } from '@/constants';

interface FetchArticlesParams {
  page: string;
  itemsPerPage: string;
  type?: string;
}

interface FetchArticlesResult {
  items: any[];
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '9', 10);
    const type = searchParams.get('type') || 'news';

    if (page < 1 || itemsPerPage < 1) {
      return NextResponse.json(
        { error: 'Invalid page or itemsPerPage parameters' },
        { status: 400 }
      );
    }

    const collectionPath = type === 'article' 
      ? 'blog/centralparkNews/articles' 
      : 'blog/centralparkNews/newsletter';

    const itemsRef = collection(db, collectionPath);
    const baseQuery = query(
      itemsRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    // Get total count
    let totalItems = 0;
    try {
      const countSnapshot = await getCountFromServer(baseQuery);
      totalItems = countSnapshot.data().count;
    } catch (error) {
      // Fallback to getDocs if getCountFromServer fails
      const totalSnapshot = await getDocs(baseQuery);
      totalItems = totalSnapshot.docs.length;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Validate page bounds
    if (page > totalPages && totalPages > 0) {
      return NextResponse.json(
        { error: 'Page number exceeds total pages' },
        { status: 400 }
      );
    }

    // Create efficient paginated query
    let paginatedQuery = query(baseQuery, limit(itemsPerPage));

    // For pages beyond the first, use startAfter for better performance
    if (page > 1) {
      const skipCount = (page - 1) * itemsPerPage;
      
      // Get the document to start after
      const skipQuery = query(baseQuery, limit(skipCount));
      const skipSnapshot = await getDocs(skipQuery);

      if (!skipSnapshot.empty && skipSnapshot.docs.length === skipCount) {
        const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
        paginatedQuery = query(
          baseQuery,
          startAfter(lastDoc),
          limit(itemsPerPage)
        );
      }
    }

    const snapshot = await getDocs(paginatedQuery);

    if (snapshot.empty) {
      return NextResponse.json({
        items: [],
        totalPages,
        totalItems,
        hasNextPage: false,
        hasPrevPage: page > 1,
        currentPage: page,
      });
    }

    // Batch fetch authors to reduce database calls
    const authorIds = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.authorId) authorIds.add(data.authorId);
    });

    // Fetch all authors in batch
    const authorsMap = new Map<string, any>();
    if (authorIds.size > 0) {
      try {
        const authorsRef = collection(db, 'blog/centralparkNews/authors');
        const authorQuery = query(
          authorsRef,
          where('__name__', 'in', Array.from(authorIds))
        );
        const authorSnapshot = await getDocs(authorQuery);

        authorSnapshot.docs.forEach((doc) => {
          authorsMap.set(doc.id, doc.data());
        });
      } catch (error) {
        console.error('Error fetching authors in batch:', error);
      }
    }

    // Process items with batched data
    const itemsData = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();

      const authorName = data.authorId && authorsMap.has(data.authorId)
        ? authorsMap.get(data.authorId).author_name
        : 'Docket Digest News Room';

      return {
        id: docSnapshot.id,
        title: data.title || '',
        content: data.content || '',
        imageURL: data.imageURL || defultImage,
        isFeatured: data.isFeatured || false,
        authorId: data.authorId || '',
        authorName: authorName,
        categoryId: data.categoryId || '',
        category_name: data.category,
        titleSlug: data.titleSlug || '',
        type: type,
        createdAt: data.createdAt || '',
        publishDate: {
          seconds: data.date?.seconds || Math.floor(new Date().getTime() / 1000),
          nanoseconds: data.date?.nanoseconds || 0,
        },
        date: data.date || '',
        status: data.status || 'published',
        Position: data.Position || '',
        authorImg: data.authorImg || defultImage,
        position: data.position || '',
        authorImage: data.authorImage || defultImage,
      };
    });

    const result: FetchArticlesResult = {
      items: itemsData,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      currentPage: page,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in pagination API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
