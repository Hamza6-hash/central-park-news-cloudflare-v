'use client';

import Image, { StaticImageData } from 'next/image'
import React, { useState, useEffect } from 'react'

const ImageComp = ({ imageURL, imageName }: { imageURL: string | StaticImageData, imageName: string }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const mediaQuery = window.matchMedia('(max-width: 640px)');
        setIsMobile(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

  return (
    <div className="relative w-full md:w-[204px] aspect-[204/208] rounded-[16px]">
                        <Image
                            src={mounted && isMobile ? '/thumbnail.webp' : imageURL || '/thumbnail.webp'}
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