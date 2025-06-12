import React from "react";
import HorizontalCard from "../common/HorizontalCard";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";
import { Button } from "../button/Button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import DummyImg from "@/assets/Rectangle-4.png";
import DummyImg from "@/assets/Blockchain-Default.jpg";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  DocumentData,
  Timestamp,
  where,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";

interface Newsletter {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  date?: Timestamp;
  imageURL?: string;
  titleSlug?: string;
  status: string,
  createdAt?: string,
  isFeatured: boolean,
  updatedAt: string,
  type?: string;
  category_name?: string,
}

interface Category {
  full_name: string;
}


const TopStories = () => {
  const pathName = usePathname();
  const isContactPage = pathName === routes.contact;

  const {
    data: newsletters,
    error,
    isLoading,
  } = useQuery<Newsletter[]>({
    queryKey: ["getAllNewsletters"],
    queryFn: async (): Promise<Newsletter[]> => {
      if (!db) {
        throw new Error("Database connection is not available");
      }

      try {
        const fetchItems = async (collectionPath: string, type: string) => {
          const ref = collection(db, collectionPath);
          const snapshot = await getDocs(ref);

          if (snapshot.empty) {
            console.log(`No ${type}s found`);
            return [];
          }

          return await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();

              try {
                let authorName = "Docket Digest New Room";
                let category_name = 'CryptoCurrency';
                if (data.authorId) {
                  const authorRef = doc(
                    db,
                    "blog/blockchainBriefing/authors",
                    data.authorId
                  );
                  const authorDoc = await getDoc(authorRef);
                  if (authorDoc.exists()) {
                    const authorData = authorDoc.data() as DocumentData;
                    authorName =
                      authorData.author_name || "Docket Digest New Room";
                  }
                }
                if (data.categoryId) {
                  try {
                    const categoriesRef = collection(db, "blog/blockchainBriefing/categories");
                    const categoryQuery = query(categoriesRef, where("id", "==", data.categoryId));
                    const categorySnapshot = await getDocs(categoryQuery);

                    if (!categorySnapshot.empty) {
                      const categoryDoc = categorySnapshot.docs[0];
                      const categoryData = categoryDoc.data() as Category;
                      category_name = categoryData.full_name;
                    } else {
                      console.log("No category found with id:", data.categoryId);
                    }
                  } catch (error) {
                    console.error("Error fetching category:", error);
                  }
                }


                return {
                  ...data,
                  id: docSnap.id,
                  authorName,
                  titleSlug: data.titleSlug || "",
                  date: data.date as Timestamp,
                  createdAt: data.createdAt,
                  status: data.status, // ✅ make sure this is included
                  type: data.type,
                  isFeatured: data.isFeatured || false,
                  updatedAt: data.updatedAt,
                  categoryId: data.categoryId,
                  category_name: category_name,
                } as Newsletter;
              } catch (error) {
                // console.error(`Error processing ${type}:`, docSnap.id, error);
                return {
                  ...data,
                  id: docSnap.id,
                  authorName: "Docket Digest New Room",
                  titleSlug: data.titleSlug || "",
                  status: data.status,
                  type: data.type,
                  isFeatured: data.isFeatured || false,
                  updatedAt: data.updatedAt,
                } as Newsletter;
              }
            })
          );
        };

        // Fetch both newsletters and articles
        const [newslettersData, articlesData] = await Promise.all([
          fetchItems("blog/blockchainBriefing/newsletter", "newsletter"),
          fetchItems("blog/blockchainBriefing/articles", "article"),
        ]);

        const combined = [...newslettersData, ...articlesData];

        const publishedItems = combined.filter(
          (item) => item?.status === "published"
        );

        const sortedItems = publishedItems.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        const latestItems = sortedItems.filter(
          (item) => item.isFeatured === true
        );

        return latestItems.slice(0, 7);
      } catch (error) {
        console.error("Error fetching newsletters and articles:", error);
        throw new Error("Failed to fetch content. Please try again later.");
      }
    },
    placeholderData: keepPreviousData,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });


  if (error) {
    return (
      <div className="px-sm-generic">
        <h2 className="font-bold text-2xl mb-4 font-century-gothic">
          TOP <span className="text-primary-500">STORIES</span>
        </h2>
        <div className="text-red-500">
          Error loading newsletters. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-sm-generic">
        <h2 className="font-bold text-2xl mb-4 font-century-gothic">
          TOP <span className="text-primary-500">STORIES</span>
        </h2>
        <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex gap-4 w-full">
              <Skeleton className="h-[100px] w-[100px] rounded-lg bg-gray-100" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4 bg-gray-100" />
                <Skeleton className="h-4 w-1/2 bg-gray-100" />
                <Skeleton className="h-4 w-1/4 bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayedNewsletters =
    isContactPage && newsletters ? newsletters.slice(0, 2) : newsletters;


  const showViewMoreButton =
    isContactPage && newsletters && newsletters.length > 1;

  return (
    <div className="px-sm-generic">
      <h2 className="font-bold text-2xl mb-4 font-century-gothic">
        TOP <span className="text-primary-500">STORIES</span>
      </h2>
      <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
        {displayedNewsletters?.map((newsletter: Newsletter) => {
          // Format the date here
          const formattedDate = newsletter.createdAt
            ? format(new Date(newsletter.createdAt), "MMM d, yyyy")
            : "";

          return (
            <React.Fragment key={newsletter.id}>
              <HorizontalCard
                title={newsletter.title || "-"}
                imageURL={newsletter.imageURL || DummyImg}
                authorName={newsletter.authorName || "Docket Digest New Room"}
                publishDate={formattedDate}
                content={newsletter.content || "-"}
                titleSlug={newsletter.titleSlug}
                type={newsletter.type}
                category_name={newsletter.category_name}
              />
            </React.Fragment>
          );
        })}
      </div>

      {showViewMoreButton && (
        <div className="flex justify-end items-end mt-6">
          <button className="uppercase text-primary-900 transition-colors duration-300 hover:text-yellow-500 font-bold text-sm xl:block hidden font-century-gothic">
            VIEW MORE
          </button>
          <Button
            variant="primary"
            className="transition-colors duration-300 hover:text-yellow-500 font-century-gothic xl:hidden block"
          >
            <Link href={"/news"}>VIEW MORE</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopStories;
