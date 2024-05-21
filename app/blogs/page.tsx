import BlogsCard from '@/components/common/BlogsCard';
import Paginator from '@/components/common/Paginator';
import React from 'react';

const Blogs = () => {
    return (
        <section>
            <h1 className='heading'>Blogs</h1>

            <div className="grid grid-rows-3 grid-flow-col gap-4 mt-5">
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