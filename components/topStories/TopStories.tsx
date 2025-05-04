import React from "react";
import HorizontalCard from "../common/HorizontalCard";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";
import { Button } from "../button/Button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import DummyImg from "@/assets/Rectangle-4.png";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  DocumentData,
  Timestamp,
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
        const newslettersRef = collection(
          db,
          "blog/blockchainBriefing/newsletter"
        );
        const snapshot = await getDocs(newslettersRef);

        if (snapshot.empty) {
          console.log("No newsletters found");
          return [];
        }

        // Process newsletters and fetch author names
        const newslettersWithData = await Promise.all(
          snapshot.docs.map(async (newsletterDoc) => {
            const data = newsletterDoc.data();

            try {
              // Get author name from authors collection if authorId exists
              let authorName = "Docket Digest New Room";
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

              // Use the titleSlug directly from the backend
              return {
                ...data,
                id: newsletterDoc.id,
                authorName,
                titleSlug: data.titleSlug || "", // Directly from backend
                date: data.date as Timestamp,
              } as Newsletter;
            } catch (error) {
              console.error(
                "Error processing newsletter:",
                newsletterDoc.id,
                error
              );
              return {
                ...data,
                id: newsletterDoc.id,
                authorName: "Docket Digest New Room",
                titleSlug: data.titleSlug || "", // Directly from backend
              } as Newsletter;
            }
          })
        );

        // Sort by publish date (newest first)
        const sortedNewsletters = newslettersWithData.sort((a, b) => {
          const dateA = a.date?.seconds || 0;
          const dateB = b.date?.seconds || 0;
          return dateB - dateA;
        });

        return sortedNewsletters;
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        throw new Error("Failed to fetch newsletters. Please try again later.");
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
          const formattedDate = newsletter.date
            ? format(new Date(newsletter.date.toDate()), "MMM d, yyyy")
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
                type="news"
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
