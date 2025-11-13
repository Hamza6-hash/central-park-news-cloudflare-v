'use client';

import { useMediaQuery } from '@uidotdev/usehooks';
import Image, { StaticImageData } from 'next/image'
import React from 'react'

const ImageComp = ({ imageURL, imageName }: { imageURL: string | StaticImageData, imageName: string }) => {
    const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <div className="relative w-full md:w-[204px] aspect-[204/208] rounded-[16px]">
                        <Image
                            src={isMobile ? '/thumbnail.webp' : imageURL || '/thumbnail.webp'}
                            priority={true}
                            loading="eager"
                            fill
                            alt={imageName || 'No Name'}
                            quality={75}
                            className="pointer-events-none select-none rounded-[16px]"
                            sizes="(max-width: 768px) 100vw, (min-width: 769px) 204px"
                        />
                    </div>
  )
}

export default ImageComp