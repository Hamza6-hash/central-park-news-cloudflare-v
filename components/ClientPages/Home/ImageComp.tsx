'use client';

import React from 'react'
import Image, { StaticImageData } from 'next/image';

const ImageComp = ({ imageURL, title, mobileURL }: { imageURL: string | StaticImageData, mobileURL: string | StaticImageData, title: string }) => {
  // Get the desktop image source - handle both string URLs and StaticImageData
  const desktopSrc = typeof imageURL === 'string'
    ? imageURL
    : imageURL?.src || '/main.webp';
  const mobileSrc = mobileURL || '/Mobilethumbnail.webp';

  return (
    <div className="relative w-full z-10 overflow-hidden rounded-[16px] aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[1.6/1] max-w-full protected-image-container">
      <picture>
        <source
          media="(min-width: 756px)"
          srcSet={desktopSrc || '/main.webp'}
        />
        <Image
          src={mobileSrc}
          alt={`Featured image for news: ${title}`}
          title={`Featured image for news: ${title}`}
          fill
          quality={65}
          loading="eager"
          priority={true}
          className="object-cover protected-image relative z-10 rounded-[16px]"
          sizes="(max-width: 640px) 436px,  
                 (max-width: 1279px) 100vw,  
                 644px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,..."
          role='img'
        />
      </picture>
    </div>
  )
}

export default ImageComp