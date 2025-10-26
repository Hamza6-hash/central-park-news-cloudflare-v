import React from "react";
import { format } from "date-fns/format";
import Adbox from "../Ads/Adbox";
import HorizontalCard from "../common/HorizontalCard";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";

interface Newsletter {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  imageURL?: string;
  titleSlug?: string;
  status?: string;
  createdAt?: string;
  category?: string;
}

async function fetchTopStories(): Promise<Newsletter[]> {
  if (!db) {
    return [];
  }

  try {
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
      return [];
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
      createdAt: data.createdAt,
      category: data.category || '',
    }));

    return newsletters;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
}

const TopStories = async () => {
  const newsletters = await fetchTopStories();

  if (!newsletters || newsletters.length === 0) {
    return (
      <div className="">
        <h2 className="font-bold text-2xl mb-4 font-century-gothic">
          TOP <span className="text-primary-500">STORIES</span>
        </h2>
        <div>
          No top stories available.
        </div>
      </div>
    );
  }


  const displayedNewsletters = newsletters;

  return (
    <div className="">
      <h2 className="font-poppins font-bold text-[32px] mb-4 uppercase tracking-normal">
        TOP <span className="text-[#E4212B]">{7}</span> STORIES
      </h2>
      <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
        {displayedNewsletters?.map((newsletter: Newsletter) => {
          const formattedDate = newsletter.createdAt
            ? format(new Date(newsletter.createdAt), "MMM d, yyyy")
            : "";


          return (
            <React.Fragment key={newsletter.id}>
              <HorizontalCard
                title={newsletter.title || "-"}
                category={newsletter.category || "Local News"}
                imageURL={newsletter.imageURL || "/thumbnail.webp"}
                authorName={newsletter.authorName || "Docket Digest New Room"}
                publishDate={formattedDate}
                content={newsletter.content || "-"}
                titleSlug={newsletter.titleSlug}
                type="news"
              />
            </React.Fragment>
          );
        })}
      </div>

      <Adbox />
    </div>
  );
};

export default TopStories;

