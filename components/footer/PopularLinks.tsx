import React from 'react'

const PopularLinks = () => {
    return (
        <section className='px-generic py-12'>
            <h1 className='capitalize text-primary-900 font-bold text-2xl mb-5'>Popular Links</h1>
            <div className='flex gap-12 border-l border-dark-500 pl-12 mx-6 h-full'>
                <div className=''>
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <p className='text-xl font-Century-751-BT' key={item}>
                                Broadway’s Appropriate Cancels Performance
                            </p>
                        ))
                    }
                </div>
                <div className=''>
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <p className='text-xl font-Century-751-BT' key={item}>
                                Broadway’s Appropriate Cancels Performance
                            </p>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default PopularLinks