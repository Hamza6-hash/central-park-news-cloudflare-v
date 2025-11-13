'use client';

import React, { useState, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image';

const ImageComp = ({ imageURL, title }: { imageURL: string | StaticImageData, title: string }) => {
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
    <div className="relative w-full z-10 overflow-hidden rounded-[16px] aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[1.6/1] max-w-full protected-image-container">
            <Image
              src={mounted && isMobile ? '/main.webp' : (imageURL || '/main.webp')}
              alt={title}
              fill
              quality={75}
              loading="eager"
              priority={true}
              className="object-cover protected-image relative z-10 rounded-[16px]"
              sizes="(max-width: 640px) 436px,  
       (max-width: 1279px) 100vw,  
       644px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,..."
            />
          </div>
  )
}

export default ImageComp