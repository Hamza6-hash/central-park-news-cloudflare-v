import React from 'react';

const linkClass = 'text-xl max-lg:text-center font-Century-751-BT  cursor-pointer';

const linkOne = ['Three Guilty Verdicts for Derek Chauvin', 'Media Piracy Lawsuit', 'Update on Commission of SCOTUS', 'Nike v. MSCHF: Lil Nas X Satan Shoes', 'Broadway’s Appropriate Cancels Performance']

const PopularLinks = () => {
    return (
        <section className='px-generic py-12 w-full flex justify-center items-center'>
            <div className='w-[1200px]'>
                <h1 className='uppercase text-primary-900 font-bold text-3xl mb-5 max-lg:text-center'>Popular Links</h1>
                <div className='flex lg:gap-12 gap-3 border-0 lg:flex-row flex-col lg:border-l border-dark-500 lg:pl-16 lg:mx-6 h-full'>
                    <div className='flex flex-col gap-[26px]'>
                        {
                            linkOne.map((item) => (
                                <p className={linkClass} key={item}>
                                    {item}
                                </p>
                            ))
                        }
                    </div>
                    <div className='space-y-5'>
                        {
                            linkOne.map((item) => (
                                <p className={linkClass} key={item}>
                                    {item}
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