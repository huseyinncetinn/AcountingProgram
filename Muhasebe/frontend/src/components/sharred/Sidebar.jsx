import classNames from 'classnames';
import React from 'react'
import { FcBearish } from "react-icons/fc";
import { DASHBOARD_SIDEBAR_LINKS , DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/consts/navigations'
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const LinkClasses = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-blue-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profilePhotoUrl');
        
        navigate('/');
      };

  return (
    <div className='bg-blue-900 w-60 p-3 flex flex-col text-white'>
        <div className='flex items-center gap-2 px-2 py-1'>
            <FcBearish fontSize={38} />
            <span className='text-lg'>Accounting</span>
        </div>
        <div className='flex-1 py-8 flex flex-col gap-0.5'>
            { DASHBOARD_SIDEBAR_LINKS.map((item) => (
                <SidebarLink key={item.key} item={item}></SidebarLink>
            )) }
        </div> 
        <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-700'>
            { DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                <SidebarLink key={item.key} item={item}></SidebarLink>
            ))}

            <div className={ classNames('text-red-500 cursor-pointer',LinkClasses)}
            onClick={handleLogoutClick}
            >
                    <span className='text-xl '><HiOutlineLogout></HiOutlineLogout></span>
                    Logout
            </div>
            
        </div>
    </div>
  )
}

function SidebarLink({item}){
    const {pathname} = useLocation()
    
    return(
        <Link to={item.path} className={ classNames(pathname == item.path ? 'bg-blue-700 text-white' :'text-neutral-400',LinkClasses) }>
            <span className='text-xl '>{item.icon}</span>
            {item.label}
        </Link>
    )
}
