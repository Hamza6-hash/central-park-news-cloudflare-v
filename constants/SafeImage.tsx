"use client";
import Image, { ImageProps, StaticImageData } from "next/image";
import React, { useState } from "react";
import { defultImage } from "@/constants";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | StaticImageData | undefined;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, title, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src || defultImage);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      title={title}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(defultImage);
        }
      }}
      onLoad={() => setHasError(false)}
      draggable={false}
      loading="lazy"
      className="select-none pointer-events-none object-cover"
    />
  );
};

export default SafeImage; 