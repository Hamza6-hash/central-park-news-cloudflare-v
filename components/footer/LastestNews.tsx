import React from 'react'
import VerticalCard from '../common/VerticalCard'
import { GoArrowRight } from "react-icons/go";

const LastestNews = () => {
    return (
        <section className='lastestNews py-12 px-generic'>
            <h1 className='uppercase text-xl font-bold text-white mb-4'>Lastest news</h1>
            <div className='flex gap-6 items-center justify-between'>
                <div className='w-full flex gap-3 overflow-hidden'>
                    {[1, 2, 3, 4, 5,].map((item) => (<React.Fragment key={item}>
                        <VerticalCard />
                    </React.Fragment>))}
                </div>
                <button className='bg-primary-300 p-2 rounded-full'>
                    <GoArrowRight color='white' size={25} />
                </button>
            </div>
        </section>
    )
}

export default LastestNews