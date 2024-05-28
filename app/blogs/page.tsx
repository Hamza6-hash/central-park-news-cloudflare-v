import BlogsCard from '@/components/common/BlogsCard';
import Paginator from '@/components/common/Paginator';
import React from 'react';

const Blogs = () => {
    return (
        <section>
            <h1 className='heading max-md:text-center'>Blogs</h1>

            <div className="grid grid-cols-3 gap-6 mt-[53px] max-lg:grid-cols-2 max-md:grid-cols-1 md:px-14 px-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (<React.Fragment key={item}>
                    <BlogsCard />
                </React.Fragment>))}
            </div>
            <div className='mt-8'>
                <Paginator />
            </div>
        </section>
    )
}

export default Blogs;