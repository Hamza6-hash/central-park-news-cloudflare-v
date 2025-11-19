import React from 'react'
import { Skeleton } from '@/components/ui/skeleton' 


const CardSkeleton = ({ ITEMS_PER_PAGE }: { ITEMS_PER_PAGE: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-[53px] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12">
            {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
                <div key={index} className="w-full flex justify-center">
                    <div className="bg-white transition-shadow w-full max-w-[350px]">
                        <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-md bg-gray-100" />
                        <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                            <Skeleton className="h-4 sm:h-5 md:h-6 w-3/4 bg-gray-100" />
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 md:w-52 bg-gray-100" />
                                <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 bg-gray-100" />
                                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 md:w-24 bg-gray-100" />
                            </div>
                            <Skeleton className="h-12 sm:h-16 md:h-20 w-full bg-gray-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CardSkeleton