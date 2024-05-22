import React from 'react';
import DynamicBlog from '@/components/common/DynamicBlog';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const page = () => {
    return (
        <section>
            <div className='flex items-center gap-2'>
                <h1 className='heading'>Blogs</h1>
                <MdOutlineKeyboardArrowRight color='#A3A0A0' size={35} />
                <h6 className='font-century-schoolbook capitalize'>Oligarch Son Told to Pay Mom</h6>
            </div>

            <DynamicBlog showWritter={false} />
        </section>
    )
}

export default page