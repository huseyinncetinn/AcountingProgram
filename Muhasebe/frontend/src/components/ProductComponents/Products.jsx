import React from 'react'
import { Link } from 'react-router-dom'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'


export default function Products() {
  return (
    <div>
      <div>
      <ProductTable></ProductTable>
      <ProductForm></ProductForm>

      </div>
      <div className='flex flex-col items-center mt-5'>
      <Link to="/dashboard">
        <button className="btn btn-warning">Go to Dashboard</button>
      </Link>
    </div>
    </div>
  )
}
