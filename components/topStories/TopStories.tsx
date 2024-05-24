import React from 'react'
import HorizontalCard from '../common/HorizontalCard'

const TopStories = ({ showViewMore = false }: TopStories) => {
    let delLater = showViewMore ? [1, 2,] : [1, 2, 3, 4, 5, 6,];

    return (
        <div className='px-sm-generic'>
            <h2 className='font-bold text-2xl mb-4 font-century-schoolbook'>TOP <span className='text-primary-500'>10</span> STORIES</h2>
            <div className='flex flex-col xl:gap-5 sm:gap-7 gap-8'>
                {delLater.map((item) => (<React.Fragment key={item}>
                    <HorizontalCard />
                </React.Fragment>))}
            </div>

            {showViewMore && <div className="flex justify-end items-end mt-6">
                <button className="uppercase text-primary-900 font-bold text-xs">
                    VIEW MORE
                </button>
            </div>}
        </div>
    )
}

export default TopStories