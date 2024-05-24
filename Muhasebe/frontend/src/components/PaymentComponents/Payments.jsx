import React from 'react'
import { Link } from 'react-router-dom'
import IncomePayment from './IncomePayment'
import ExpensePayment from './ExpensePayment'

export default function Payments() {
  return (
    <div>

      <div className='flex flex-row justify-evenly gap-4'>
            <IncomePayment></IncomePayment>
            <ExpensePayment></ExpensePayment>
      </div>


    <div className='flex flex-col items-center mt-5'>
      <Link to="/dashboard">
        <button className="btn btn-warning">Go to Dashboard</button>
      </Link>
    </div>
    </div>
  )
}
