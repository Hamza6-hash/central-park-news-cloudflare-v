"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";
import { defultImage, routes } from "@/constants";
import TruncateText from "./TruncateProps";
import SafeImage from "@/constants/SafeImage";
import { Calendar, Clock2, Zap } from "lucide-react";

interface BlogsCard {
  showDateTimeInRow?: boolean;
  title: string;
  content: string;
  imageURL?: string | StaticImageData;
  authorName?: string;
  publishDate?: string;
  titleSlug?: string;
  type?: "article" | "news";
  suggestedBlog?: boolean;
  createdAt?: string;
  category_name?: string,
  showTrending?: boolean,
}

const BlogsCard = ({
  showDateTimeInRow = false,
  title,
  content,
  imageURL,
  authorName = "Docket Digest New Room",
  titleSlug = "",
  type = "article",
  category_name,
  createdAt,
  showTrending = true
}: BlogsCard) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  const getLinkPath = () => {
    if (type === "news") {
      return `${routes.news}/${titleSlug}`;
    }
    return `${routes.articles}/${titleSlug}`;
  };

  return (
    <Link href={getLinkPath()}>
      <div className="w-full max-w-[381px] mx-auto cursor-pointer group">
        <div className="bg-[#67B6DF24] rounded-lg overflow-hidden shadow-sm  duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-[1.02]">

          <div className="relative w-full h-[200px] overflow-hidden">
            {showTrending && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-[#FFD910] text-[#7D6901] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Trending
                </span>
              </div>
            )}

            <SafeImage
              src={imageURL || defultImage}
              alt={title}
              fill
              loading="eager"
              priority
              className="object-cover pointer-events-none select-none "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-6 transition-colors duration-300 ease-in-out ">
            <div className="mb-3">
              <span className="bg-[#FFEB84] font-montserrat text-[#7D6901] text-xs font-medium px-3 py-1 rounded-full">
                {category_name}
              </span>
            </div>

            <h2 className="text-[#1a2332] font-century-schoolbook text-[24px] font-bold leading-7 mb-3 line-clamp-2 ">
              {title}
            </h2>

            <div className="text-black font-century-gothic text-[15px] mb-4 line-clamp-3">
              <TruncateText lines={3} content={content} />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <div className="flex gap-3 items-center">
                <Calendar size={12} color="#020617" />
                <span className="text-[#808080] transition-colors duration-300 ease-in-out ">{formattedDate}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Clock2 size={12} color="#020617" />
                <span className="text-[#808080] ">5 Min Read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
// <div className="w-full max-w-[381px] mx-auto">
//   {/* Main Card Container */}
//   <div className="bg-[#67B6DF24] rounded-lg overflow-hidden shadow-sm">

//     {/* Image Section */}
//     <div className="relative w-full h-[200px] overflow-hidden">
//       {/* Trending Badge */}
//       {showTrending && (
//         <div className="absolute top-4 left-4 z-10">
//           <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full">
//             Trending
//           </span>
//         </div>
//       )}

//       <SafeImage
//         src={imageURL || defultImage}
//         alt={title}
//         fill
//         loading="eager"
//         priority
//         className="object-cover pointer-events-none select-none"
//         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//       />
//     </div>

//     {/* Content Section */}
//     <div className="p-6">
//       {/* Category Badge */}
//       <div className="mb-3">
//         <span className="bg-[#FFD700] font-montserrat text-black text-xs font-medium px-3 py-1 rounded-full">
//           {category_name}
//         </span>
//       </div>

//       {/* Title */}
//       <h2 className="text-[#1a2332] font-century-schoolbook text-[24px] font-bold leading-7 mb-3 line-clamp-2">
//         {title}
//       </h2>

//       {/* Content Preview */}
//       <div className="text-black font-century-gothic text-[15px] mb-4 line-clamp-3">
//         <TruncateText lines={3} content={content} />
//       </div>

//       {/* Author and Date */}
//       <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
//         <div className="flex gap-3 items-center">
//           <Calendar size={12} color="#020617" />
//           <span className="text-[#808080]">{formattedDate}</span>
//         </div>
//         <div className="flex gap-3 items-center">
//           <Clock2 size={12} color="#020617" />
//           <span className="text-[#808080]">5 Min Read</span>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// --------------------------------------------------------------------
// <div
//   className="bg-[#67B6DF24] relative w-full sm:max-w-[337px] h-[465px] rounded-[6px] p-6 flex flex-col"
// >
//   {/* Image */}
//   <div className="relative w-full h-[189px] overflow-hidden">
//     <SafeImage
//       src={imageURL || defultImage}
//       alt={title}
//       fill
//       loading="eager"
//       priority
//       className="object-cover pointer-events-none select-none"
//       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//     />
//   </div>

//   {/* Title */}
//   <div className="mt-3 h-[52px]">
//     <h1 className="font-century-schoolbook font-bold text-[24px] leading-[29px] line-clamp-2">
//       {title}
//     </h1>
//   </div>

//   {/* Author and Date */}
//   <div className="mt-3 h-[14px]">
//     {showDateTimeInRow ? (
//       <div className="flex items-center gap-1.5">
//         <hr className="min-w-[16px] sm:min-w-[20px] h-1 shrink-0" />
//         <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
//           <h6 className="text-dark-400 capitalize font-font-century-725-cn font-normal text-[12px] leading-[14px]">
//             {authorName}
//           </h6>
//           <span className="shrink-0 text-[12px] leading-[14px]">|</span>
//           <h6 className="text-[12px] leading-[14px] text-dark-400 capitalize font-font-century-725-cn font-normal">
//             {formattedDate}
//           </h6>
//         </div>
//       </div>
//     ) : (
//       <div className="flex items-center gap-2">
//         <hr className="w-6 h-0.5 text-dark-900" />
//         <div>
//           <h6 className="text-dark-400 capitalize font-montserrat font-normal text-[16px] leading-[14px] mb-1">
//             {authorName}
//           </h6>
//           <h6 className="text-[14px] leading-[16px] text-dark-400 capitalize font-montserrat font-normal">
//             {formattedDate}
//           </h6>
//         </div>
//       </div>
//     )}
//   </div>

//   {/* Content */}
//   <div className="mt-4 h-[60px]">
//     <div className="text-[#000] text-ellipsis line-clamp-3 text-[15px] font-normal capitalize font-century-gothic">
//       <TruncateText lines={3} content={content} />
//     </div>
//   </div>

//   {/* View More */}
//   <div className="absolute bottom-[24px] right-0 w-full px-6">
//     <div className="flex justify-between items-center">
//       <h1 className="bg-[#FFEB84] text-black text-xs truncate w-fit max-w-[60%]  capitalize font-montserrat py-1 px-2 rounded-full">
//         {category_name}
//       </h1>

//       <Link href={getLinkPath()}>
//         <p className="text-[#2B4864] font-century-gothic text-[14px] font-bold leading-[100%] capitalize transition-colors duration-300 hover:text-white">
//           VIEW MORE
//         </p>
//       </Link>
//     </div>
//   </div>
// </div>

//   );
// };

export default BlogsCard;
