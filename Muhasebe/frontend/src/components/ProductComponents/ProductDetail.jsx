import React from 'react'
import ProductPhoto from './ProductPhoto'
import ProductInformation from './ProductInformation'

export default function ProductDetail() {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <h2 className='text-4xl mt-5 mb-5 italic font-bold'>Product Detail Page</h2>
      <div className='flex justify-around items-center w-full max-w-screen-md mb-8'>
          <ProductPhoto></ProductPhoto>
          <ProductInformation></ProductInformation>
      </div>
    </div>
  )
}
