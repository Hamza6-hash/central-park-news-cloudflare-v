import React from 'react';
import DynamicBlog from '@/components/common/DynamicBlog';

const page = () => {
    return (
        <>
            <DynamicBlog showWritter={false} mainHeading='Blog' />
        </>
    )
}

export default page;