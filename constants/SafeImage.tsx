"use client";
import Image, { ImageProps, StaticImageData } from "next/image";
import React, { useState } from "react";
import { defultImage } from "@/constants";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | StaticImageData | undefined;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src || defultImage);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(defultImage);
        }
      }}
      onLoad={() => setHasError(false)}
      draggable={false}
      className="select-none pointer-events-none object-cover"
    />
  );
};

export default SafeImage; 