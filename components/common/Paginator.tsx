import React from 'react'
import {

  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const Paginator = () => {
  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className='border border-gray-700 text-primary-700 font-bold' href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className='border border-gray-700 text-primary-800 font-bold' href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className='text-primary-800 font-bold' href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className='text-primary-800 font-bold' href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className='text-primary-800' />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className='border border-gray-700 text-primary-900 font-bold flex items-center justify-center' href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  )
}

export default Paginator