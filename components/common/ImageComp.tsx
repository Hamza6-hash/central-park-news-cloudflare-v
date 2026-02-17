'use client';

import Image, { StaticImageData } from 'next/image'
import React from 'react'

const ImageComp = ({ imageURL, imageName, mobileURL }: { imageURL: string | StaticImageData, mobileURL: string | StaticImageData, imageName: string }) => {
  const desktopSrc = typeof imageURL === 'string'
    ? imageURL
    : imageURL?.src || '/thumbnail.webp';
  const mobileSrc = mobileURL || '/Mobilethumbnail.webp';

  return (
    <div className="relative w-full md:w-[204px] aspect-[204/208] rounded-[16px] max-sm:aspect-[204/140]">
      <picture>
        <source
          media="(min-width: 756px)"
          srcSet={desktopSrc || '/thumbnail.webp'}
        />
        <Image
          src={mobileSrc}
          priority={true}
          loading="eager"
          fill
          alt={imageName ? `${imageName} – Article or story image` : "Central Park News story image"}
          title="Article or story illustration"
          quality={75}
          className="pointer-events-none object-cover select-none rounded-[16px]"
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 204px"
        />
      </picture>
    </div>
  )
}

export default ImageComp