import React from 'react';

const linkClass = 'xl:text-xl lg:text-lg md:text-base text-center sm:text-sm text-xs font-Century-751-BT';

const PopularLinks = () => {
    return (
        <section className='px-generic py-12 w-full flex justify-center items-center'>
            <div className='w-[1200px]'>
                <h1 className='capitalize text-primary-900 font-bold text-2xl mb-5 max-md:text-center'>Popular Links</h1>
                <div className='flex lg:gap-12 gap-3 border-0 lg:flex-row flex-col lg:border-l border-dark-500 lg:pl-16 lg:mx-6 h-full'>
                    <div className='space-y-1'>
                        {
                            [0, 1, 2, 3, 4].map((item) => (
                                <p className={linkClass} key={item}>
                                    Broadway’s Appropriate Cancels Performance
                                </p>
                            ))
                        }
                    </div>
                    <div className='space-y-1'>
                        {
                            [0, 1, 2, 3, 4].map((item) => (
                                <p className={linkClass} key={item}>
                                    Broadway’s Appropriate Cancels Performance
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularLinks