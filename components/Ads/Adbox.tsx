import React from 'react'
import Image from 'next/image'

const Adbox = () => {
  return (
    <div className="flex justify-center items-center mt-3 xl:w-[510px] h-[300px] w-full relative overflow-hidden rounded-lg">
      <Image 
        src="/image (12).png" 
        alt="adbanner" 
        fill
        className="object-contain"
        sizes="(max-width: 1280px) 100vw, 520px"
      />
    </div>
  )
}


export default Adbox

