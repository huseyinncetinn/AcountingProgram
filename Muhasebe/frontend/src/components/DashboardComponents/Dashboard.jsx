import React from 'react' 
import DashboardStatsGrid from './DashboardStatsGrid'
import TransactionChart from './TransactionChart'
import CustomerChartsProfile from './CustomerChartsProfile'
import TransactionTable from './TransactionTable'
import BestProduct from './BestProduct'

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-4'>
      <DashboardStatsGrid></DashboardStatsGrid>
      <div className='flex flex-row gap-4 w-full'>
        <TransactionChart></TransactionChart>
        <CustomerChartsProfile></CustomerChartsProfile>
      </div>
      <div className='flex flex-row gap-4 w-full'>
         <TransactionTable></TransactionTable>
         <BestProduct></BestProduct>
      </div>
    </div>
  )
}


