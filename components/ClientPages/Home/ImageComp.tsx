'use client';

import React, { useState, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image';

const ImageComp = ({ imageURL, title }: { imageURL: string | StaticImageData, title: string }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let mediaQuery: MediaQueryList | null = null;
        let handleChange: ((e: MediaQueryListEvent) => void) | null = null;

        // Use requestAnimationFrame to defer media query check and prevent forced reflow
        const rafId = requestAnimationFrame(() => {
            setMounted(true);
            mediaQuery = window.matchMedia('(max-width: 640px)');
            setIsMobile(mediaQuery.matches);

            handleChange = (e: MediaQueryListEvent) => {
                // Batch state updates to prevent multiple reflows
                requestAnimationFrame(() => {
                    setIsMobile(e.matches);
                });
            };

            mediaQuery.addEventListener('change', handleChange);
        });

        return () => {
            cancelAnimationFrame(rafId);
            if (mediaQuery && handleChange) {
                mediaQuery.removeEventListener('change', handleChange);
            }
        };
    }, []);

  return (
    <div className="relative w-full z-10 overflow-hidden rounded-[16px] aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[1.6/1] max-w-full protected-image-container">
            <Image
              src={mounted && isMobile ? '/Mobilethumbnail.webp' : (imageURL || '/main.webp')}
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