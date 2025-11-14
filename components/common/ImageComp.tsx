'use client';

import Image, { StaticImageData } from 'next/image'
import React from 'react'

const ImageComp = ({ imageURL, imageName, mobileURL }: { imageURL: string | StaticImageData,  mobileURL: string | StaticImageData, imageName: string }) => {
  // Get the desktop image source - handle both string URLs and StaticImageData
  const desktopSrc = typeof imageURL === 'string' 
    ? imageURL 
    : imageURL?.src || '/thumbnail.webp';
  const mobileSrc =  mobileURL || '/Mobilethumbnail.webp';

  return (
    <div className="relative w-full md:w-[204px] aspect-[204/208] rounded-[16px]">
      <picture>
        {/* 
          BROWSER LOGIC: 
          If the screen is >= 756px wide, only this source is used and downloaded. 
        */}
        <source 
          media="(min-width: 756px)" 
          srcSet={desktopSrc || '/thumbnail.webp'} 
        />
        
        {/* 
          BROWSER LOGIC: 
          If the screen is < 756px wide, this is the fallback, and only this image is used. 
        */}
        <Image
          src={mobileSrc}
          priority={true}
          loading="eager"
          fill
          alt={imageName || 'No Name'}
          quality={75}
          className="pointer-events-none select-none rounded-[16px]"
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 204px"
        />
      </picture>
    </div>
  )
}

export default ImageComp