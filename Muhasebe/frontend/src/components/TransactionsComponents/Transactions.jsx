import React from 'react'
import { Link } from 'react-router-dom'
import IncomeTransaction from './IncomeTransaction'
import ExpenseTransaction from './ExpenseTransaction'


export default function Transactions() {
  return (
    <div>

    <div className='flex flex-row justify-between gap-4'>
      <IncomeTransaction></IncomeTransaction>
      <ExpenseTransaction></ExpenseTransaction>
    </div>


    <div className='flex flex-col items-center mt-5'>
      <Link to="/dashboard">
        <button className="btn btn-warning">Go to Dashboard</button>
      </Link>
    </div>

    </div>
  )
}
