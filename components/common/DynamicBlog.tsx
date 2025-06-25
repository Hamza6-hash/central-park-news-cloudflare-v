
import { StaticImageData } from "next/image";
import { formatedDate } from "@/lib/utils";

import { defultImage } from "@/constants";
import { News } from "../NewsSingle/NewsClient";
import SafeImage from "@/constants/SafeImage";
import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const BlogsCard = dynamic(() => import("../common/BlogsCard"), {
  loading: () => <div className="w-full h-36 bg-gray-100 rounded-md" />, // optional placeholder
  ssr: false, // optional: set to false if SEO isn't critical for related blogs
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
  relatedNews?: News[];
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
  mainHeading = "Blog",
  articleId,
  titleSlug,
  isArticlePage = false,
  authorPosition,
  authorImg,
  relatedNews,
  createdAt,
  category
}) => {
  const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");


  return (
    <section className="pt-0">
      <div className="mt-1 mb-4">
        <div className="space-y-3 mb-4">
          <div className="sm:x-sm-generic mt-4 ">
            {isArticlePage ? (
              <h1 className="font-century-schoolbook max-sm:text-[22px] text-3xl capitalize">
                {title}
              </h1>
            ) : (
              <h1 className="font-century-schoolbook max-sm:text-[22px] text-3xl capitalize">
                {title}
              </h1>
            )}
          </div>
          <div className="relative w-full max-w-[1200px] aspect-[1200/514]">
            <SafeImage
              src={imageURL || defultImage}
              alt={title}
              fill
              quality={80}
              loading="eager"
              priority
              className="pointer-events-none select-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>


          <div className="flex items-center sm:text-[12px] text-sm px-sm-generic gap-2 max-[400px]:flex-col max-[400px]:justify-start max-[400px]:items-start">
            <div className="flex items-center gap-2">
              <hr className="w-6 h-1 " />
              <h6 className="capitalize text-nowrap font-montserrat">
                {authorName}
              </h6>
              <span className="text-primary-500 ">|</span>
            </div>
            <p className="text-primary-500 text-nowrap ">
              {formatedPublishDate && formatedPublishDate}
            </p>
          </div>
        </div>

        <div className="markdown-content max-sm:text-[14px]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
         <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between">
          {showWritter === true && (
            <div className="flex gap-2 flex-col max-sm:justify-center ">
              <h4 className="text-lg">Written By:</h4>
              <div className="font-century-gothic text-lg">
                <p>
                  {authorName
                    ? authorName.charAt(0).toUpperCase() + authorName.slice(1)
                    : "Unknown Author"}
                </p>
                <p className="text-[#747474]">
                  {authorPosition
                    ? authorPosition?.charAt(0).toUpperCase() +
                    authorPosition?.slice(1)
                    : "Author"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* multiply by 5 */}
        <p className="text-2xl text-primary-900 font-bold">Related News</p>
        <div className="flex flex-wrap w-full gap-4 mt-3">
          {relatedNews &&
            relatedNews.map((item) => (
              <BlogsCard
                key={item.id}
                title={item.title}
                content={item.content}
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
      </div>
    </section>
  );
};

export default DynamicBlog;
