import BlogsCard from '@/components/common/BlogsCard';
import Paginator from '@/components/common/Paginator';
import React from 'react';
import DummyImg from "@/assets/Rectangle-4.png";

const dummyContent = "Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter.";

const Blogs = () => {
    return (
        <section>
            <h1 className='heading max-md:text-center'>Blogs</h1>

            <div className="grid grid-cols-3 gap-6 mt-[53px] max-lg:grid-cols-2 max-md:grid-cols-1 md:px-14 px-6">
                {[1, 2].map((item, index) => (
                    <React.Fragment key={index}>
                        <BlogsCard 
                            title="Three Guilty Verdicts For Derek Chauvin"
                            content={dummyContent}
                            imageURL={DummyImg}
                            authorName="Docket Digest News Room"
                            publishDate={{
                                seconds: new Date('2021-04-21').getTime() / 1000,
                                nanoseconds: 0
                            }}
                        />
                    </React.Fragment>
                ))}
            </div>
            <div className='mt-8'>
                <Paginator />
            </div>
        </section>
    )
}

export default Blogs;