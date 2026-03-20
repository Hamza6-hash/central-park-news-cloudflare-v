
import Image, { StaticImageData } from "next/image";
import { formatedDate } from "@/lib/utils";

import { defultImage } from "@/constants";
import type { RelatedNewsItem } from "@/types/article";
import dynamic from "next/dynamic";
import Link from "next/link";
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm';
import SafeMarkdown from "../ClientPages/SafeMarkdown/SafeMarkdown";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const BlogsCard = dynamic(() => import("../common/BlogsCard"), {
  loading: () => <div className="w-full h-36 bg-gray-100 rounded-md" />,
  ssr: false,
});

export interface DynamicBlogProps {
  title: string;
  imageURL: string | StaticImageData;
  authorName: string;
  publishDate: any;
  content: string;
  showWritter?: boolean;
  mainHeading?: string;
  articleId?: string;
  titleSlug?: string;
  isArticlePage?: boolean;
  authorPosition?: string;
  // @ts-ignore
  authorImg?: string | StaticImageData;
  relatedNews?: RelatedNewsItem[];
  createdAt?: string,
  category?: string,
}


const DynamicBlog: React.FC<DynamicBlogProps> = ({
  title,
  imageURL,
  authorName,
  publishDate,
  content,
  showWritter = true,
  authorPosition,
  relatedNews,
  category
}) => {
  const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");
  return (
    <section className="pt-0">
      <div className="mt-1 mb-4">
        <div className="space-y-3 mb-4">
          <div className="sm:x-sm-generic mt-4">
            <h1 className="font-century-schoolbook text-[22px] leading-tight sm:text-3xl capitalize">
              {title}
            </h1>
          </div>
          <div className="relative w-full xl:min-w-[1200px] max-w-[1200px] aspect-[1200/514]">
            <Image
              src={imageURL || defultImage}
              alt={title ? `${title} – Article featured image` : "Central Park News article featured image"}
              title="Main image for this article"
              fill
              quality={80}
              loading="lazy"
              className="pointer-events-none object-cover object-center rounded-[16px] select-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2  max-sm:text-[12px] sm:text-lg text-[12px]">
            <hr className="w-6 h-1" />
            <span className="bg-[#E4212B] text-[12px]  text-white capitalize font-poppins truncate px-[12px] rounded-xl max-w-[50%] sm:max-w-full w-fit">
              {category || "Local News"}
            </span>
            <Link href={`/author/sarah-lee`}>
              <h6 className="capitalize text-nowrap font-montserrat">
                {authorName}
              </h6>
            </Link>

            <span className="text-primary-500 ">|</span>
            <p className="text-primary-500 text-nowrap ">
              {formatedPublishDate && formatedPublishDate}
            </p>
          </div>

        </div>

        <div className="markdown-content max-sm:text-[14px] text-base leading-relaxed">
          <SafeMarkdown content={content} />
        </div>
        <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between">
          {showWritter === true && (
            <div className="flex gap-2 flex-col max-sm:justify-center ">
              <h4 className="text-lg">Written By:</h4>
              <div className="font-century-gothic text-[12px] sm:text-lg">
                <Link href={`/author/sarah-lee`}>
                  <p className="capitalize">
                    {authorName || "Sarah Lee"}
                  </p>
                </Link>
                <p className="text-[#747474] capitalize">
                  {authorPosition || "Central Park News"}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-2xl text-primary-900 font-bold">Related News</p>
        {!relatedNews || relatedNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-10 text-center">
            <Image
              src="/related.webp"
              alt="Placeholder graphic when no related articles are available"
              title="Shown when there are no related articles"
              height={220}
              width={170}
              className="object-contain"
            />
            <p className="text-[#696969] font-montserrat text-[16px] max-sm:text-sm ">
              NO RELATED NEWS YET
            </p>
          </div>

        ) : (
          <div className="flex flex-wrap w-full gap-4 mt-3">
            {relatedNews.map((item) => (
              <BlogsCard
                key={item.id}
                title={item.title}
                content={item.content ?? ""}
                imageURL={item.imageURL || defultImage}
                authorName={item.authorName}
                publishDate={item.publishDate}
                createdAt={item.createdAt}
                showDateTimeInRow={true}
                titleSlug={item.titleSlug}
                type={"news"}
                category_name={item.category}
              />
            ))}
          </div>
        )}
      </div>
    </section >
  );
};

export default DynamicBlog;
