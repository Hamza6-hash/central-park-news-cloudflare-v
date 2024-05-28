import React, { useRef } from 'react'
import VerticalCard from '../common/VerticalCard'
import { GoArrowRight } from "react-icons/go";

const LastestNews = () => {
    const productContainerRef = useRef<HTMLDivElement>(null);

    const slideLeft = () => {
        if (productContainerRef.current) {
            productContainerRef.current.scrollLeft -= 230;
        }
    };

    const slideRight = () => {
        if (productContainerRef.current) {
            productContainerRef.current.scrollLeft += 230;
        }
    };

    return (
        <section className='lastestNews py-[58px] px-generic'>
            <div className="max-width w-full">
                <h1 className='uppercase text-3xl font-bold text-white mb-4'>Latest news</h1>
                <div className='flex gap-6 items-center justify-between relative w-full mx-auto'>
                    <div ref={productContainerRef} className='w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1'>
                        {[1, 2, 3, 4, 5, 6, 7].map((item) => (<React.Fragment key={item}>
                            <VerticalCard />
                        </React.Fragment>))}
                    </div>
                    <button className='bg-primary-300 p-2 rounded-full' onClick={slideRight}>
                        <GoArrowRight color='white' size={25} />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default LastestNews