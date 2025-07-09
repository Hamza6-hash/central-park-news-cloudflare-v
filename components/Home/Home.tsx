"use client";
import TopStories from "@/components/topStories/TopStories";
import { StaticImageData } from "next/image";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { defultImage } from "@/constants";
import SafeImage from "@/constants/SafeImage";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";


interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string | StaticImageData;
  authorId: string;
  authorName?: string;
  publishDate: {
    seconds: number;
    nanoseconds: number;
  };
  date?: string;
  titleSlug?: string;
  createdAt: string,
  type: string,
  category: string,
}

interface HomeProps {
  article: Article | null;
}

export default function Home({ article }: HomeProps) {
  const searchParams = useSearchParams()
  const toastParams = searchParams.get('toast')
  const router = useRouter()
  const { showToast } = useToast()


  useEffect(() => {
    if (!toastParams) return;

    const toastMap: Record<string, { title: string; description: string }> = {
      "expired": {
        title: "Expired",
        description: "This unsubscribe link has expired.",
      },
      "token-already-used": {
        title: "Error",
        description: "This link was already used. You’re already unsubscribed.",
      },
      // "no-user-found": {
      //     title: "User Not Found",
      //     description: "We couldn’t find a user for this link.",
      // },
      "user-check-failed": {
        title: "Error",
        description: "Something went wrong. Please try again later.",
      },
    };

    const toastData = toastMap[toastParams];

    if (toastData) {
      showToast({
        title: toastData.title,
        description: toastData.description,
        type: "error",
      });

      router.replace("/");
    }
  }, [toastParams, router, showToast]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-gray-500 text-lg">No article Available.</p>
      </div>
    );
  }

  return (
    <section className="flex gap-9 max-xl:flex-col w-full max-w-[1200px] mx-auto text-[12px] sm:text-base">
      <div className="xl:w-[644px] w-full max-w-full overflow-hidden">

        <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />

        <div className="space-y-3 mb-4">
          <div className="min-h-[48px] flex items-start">
            <Link
              href={`/${article.type === 'newsletter' ? 'news' : 'articles'}/${article.titleSlug}`}
            >
              <h1 className="text-[30px] leading-normal font-century-schoolbook capitalize hover:text-primary-500 transition-colors break-words max-w-full ">
                {article.title}
              </h1>

            </Link>
          </div>

          <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[1.6/1] max-w-full protected-image-container">
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg"></div>
            <SafeImage
              src={article.imageURL || defultImage}
              alt={article.title}
              fill
              quality={75}
              loading="eager"
              priority={true}
              className="object-cover protected-image relative z-10 rounded-lg"
              sizes="(max-width: 1279px) 100vw, 644px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,..."
            />
          </div>

          <div className="min-h-[24px] flex items-center text-[12px] sm:text-xs md:text-sm lg:text-base gap-2 flex-wrap">
            <hr className="w-4 sm:w-6 h-1" />
            <h1 className="bg-[#FFEB84] text-black text-[12px] capitalize font-poppins truncate w-fit max-w-[60%] px-[12px] rounded-xl">{article?.category}</h1>
            <h6 className="capitalize font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {article.authorName}
            </h6>
            <span className="text-primary-500">|</span>
            <p className="text-primary-500 italic font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {article.createdAt ? formatedDate(article.createdAt) : "N/A"}
            </p>
          </div>
        </div>

        {/* Content with reserved space */}
        <div className="markdown-content min-h-[200px]">
          <ReactMarkdown>{article?.content}</ReactMarkdown>
        </div>


      </div>

      <div className="xl:w-[520px] w-full">
        <TopStories />
      </div>
    </section>
  );


}
