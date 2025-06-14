"use client";
import Image, { ImageProps, StaticImageData } from "next/image";
import React, { useState } from "react";
import { defultImage } from "@/constants";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | StaticImageData | undefined;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src || defultImage);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(defultImage)}
    />
  );
};

export default SafeImage;
