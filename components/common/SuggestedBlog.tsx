// components/SuggestedBlogCard.tsx
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { defultImage, routes } from "@/constants";
import { getConciseAnchorText } from "@/lib/utils";

interface SuggestedBlogCardProps {
    showDateTimeInRow?: boolean;
    title: string;
    content: string;
    imageURL?: string | StaticImageData;
    authorName?: string;
    publishDate?: {
        seconds: number;
        nanoseconds: number;
    };
    titleSlug?: string;
    type?: "article" | "news";
    suggestedBlog?: boolean;
    createdAt?: string;
}

const SuggestedBlogCard: React.FC<SuggestedBlogCardProps> = ({
    showDateTimeInRow = false,
    title,
    content,
    imageURL = defultImage,
    authorName = "Docket Digest New Room",
    publishDate,
    titleSlug = "",
    type = "article",
    createdAt,
}) => {
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

    const conciseAnchorText = getConciseAnchorText(title);

    return (
        <Link href={getLinkPath()}>
            {/* Screen-reader-only concise anchor text for SEO */}
            <span className="sr-only">{conciseAnchorText}</span>
            <div className="bg-primary-300 w-full h-[320px] relative rounded text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageURL}
                        alt={title || "Article image"}
                        title={title || "Article image"}
                        fill
                        priority={true}
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        quality={85}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-[#1E3D5AEB] transition-all duration-300 ease-in-out hover:bg-[#193753] hover:pb-6">
                    <div className="mb-3">
                        <h4 className="font-century-schoolbook capitalize font-normal leading-5 line-clamp-3">
                            {title || "-"}
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <hr className="w-6 h-0.5 bg-white" />
                        <div className="flex flex-col">
                            <h6 className="text-sm capitalize font-montserrat font-wider font-normal tracking-sm">
                                {authorName || "-"}
                            </h6>
                            <p className="text-xs text-gray-300 italic">
                                {formattedDate || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SuggestedBlogCard;