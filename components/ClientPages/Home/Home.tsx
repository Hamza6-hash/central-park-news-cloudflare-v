
import TopStories from "@/components/topStories/TopStories";
import { StaticImageData } from "next/image";
import { formatedDate, getConciseAnchorText } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { ToastHandler } from "./ToastHandler";
import ImageComp from "./ImageComp";
import SafeMarkdown from "../SafeMarkdown/SafeMarkdown";


interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string | StaticImageData;
  authorId?: string;
  authorName?: string;
  publishDate?: {
    seconds: number;
    nanoseconds: number;
  };
  date?: string;
  titleSlug?: string;
  createdAt?: string;
  type: string;
  mobileURL: string;
  category?: string;
}

interface HomeProps {
  article: Article | null;
  topStories?: Array<Partial<Article> & { id: string; mobileURL?: string; createdAt?: Date | string }>;
}

export default function Home({ article, topStories = [] }: HomeProps) {
  if (!article && topStories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-gray-500 text-lg">No article Available.</p>
      </div>
    );
  }

  const heroArticle = article ?? topStories[0]!;

  return (
    <section className="flex gap-9 max-xl:flex-col w-full max-w-[1200px] mx-auto text-[12px] sm:text-base">
      <Suspense>
        <ToastHandler />
      </Suspense>
      <div className="xl:w-[644px] w-full max-w-full overflow-hidden">

        <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />

        <div className="space-y-3 mb-4">
          <div className="">
            <Link
              href={`/${heroArticle.type === "newsletter" ? "news" : "articles"}/${heroArticle.titleSlug}`}
            >
              {/* Screen-reader-only concise anchor text for SEO */}
              <span className="sr-only">{getConciseAnchorText(heroArticle.title || "")}</span>
              <h1
                className="
                text-[30px]
                leading-normal
                font-century-schoolbook 
                capitalize
               hover:text-primary-500
                transition-colors
                break-words
                max-w-full
                min-h-[calc(1.5_*_30px_*_3)]     
                sm:line-clamp-3                 
                sm:max-h-[calc(1.5_*_30px_*_3)]  
                sm:overflow-hidden"
              >
                {heroArticle.title}
              </h1>
            </Link>
          </div>
          <ImageComp
            imageURL={heroArticle.imageURL || "/main.webp"}
            mobileURL={heroArticle.mobileURL ?? "/Mobilethumbnail.webp"}
            title={heroArticle.title ?? ""}
          />

          <div className="min-h-[24px] flex items-center text-[12px] sm:text-xs md:text-sm lg:text-base gap-2 flex-wrap">
            <hr className="w-4 text-[#34148E] sm:w-6 h-1" />
            <span className="bg-[#E4212B] text-white text-[12px] capitalize font-poppins truncate w-fit max-w-[60%] px-[12px] rounded-xl inline-block">{heroArticle.category || "Local News"}</span>
            <h6 className="capitalize font-poppins text-[12px] sm:text-xs md:text-sm lg:text-base">
              {heroArticle.authorName}
            </h6>
            <span className="text-primary-500">|</span>
            <p className="text-[#E4212B] italic font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {heroArticle.createdAt ? formatedDate(heroArticle.createdAt) : "N/A"}
            </p>
          </div>
        </div>

        {/* Content with reserved space */}
        <div className="markdown-content min-h-[200px] text-[#000000] font-poppins leading-relaxed">
          <SafeMarkdown content={heroArticle.content ?? ""} />
        </div>
      </div>

      <div className="xl:w-[520px] w-full">
        <TopStories topStories={topStories} />
      </div>
    </section>
  );


}
