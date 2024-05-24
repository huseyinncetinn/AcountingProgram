import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
        <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
            <Sidebar></Sidebar>
            <div className='flex flex-col flex-1'>
                <Header></Header>
                <div className=''>{<Outlet></Outlet>}</div>
            </div>
        </div>
  )
}
