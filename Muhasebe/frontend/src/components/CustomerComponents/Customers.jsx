import React from 'react'
import { Link } from 'react-router-dom'

import CustomerTableandForm from './CustomerTableandForm'


export default function Customers() {
  return (
    <div>

      <div>
        <CustomerTableandForm></CustomerTableandForm>
      </div>
    
    <div className='flex flex-col items-center mt-5'>
      <Link to="/dashboard">
        <button className="btn btn-warning">Go to Dashboard</button>
      </Link>
    </div>


    </div>
  )
}
