import React, { useEffect, useState } from 'react'
import { FaBalanceScale } from "react-icons/fa";
import { FaMoneyBill1Wave ,FaScaleUnbalanced } from "react-icons/fa6";
import { IoPieChart } from 'react-icons/io5';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function DashboardStatsGrid() {

    const[userData , setUserData] = useState(null);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {

            const response = await axios.get('http://127.0.0.1:8000/api/user-profile/' , {
                headers : {
                    Authorization : `Token ${token}`,
                    'X-CSRFToken' : Cookies.get('csrftoken'),
                },
            });

            if(Array.isArray(response.data) && response.data.length > 0) {
                setUserData(response.data[0])
            }else {
                console.eror('User yok')
            }
            
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchData();
        }
    },[token])

  return (
    <div >
        {userData && (
            <div className='flex gap-4 w-full m-4'> 
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
                    <FaBalanceScale className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Balance</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>${userData.balance}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-red-900'>
                    <IoPieChart className="text-2xl text-white" />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Expense</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>${userData.total_expense}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-900'>
                    <FaMoneyBill1Wave  className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Income</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>${userData.total_income}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-purple-500'>
                    <FaScaleUnbalanced  className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Unused Balance</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>${userData.unused_balance}</strong>
                    </div>
                </div>
        </BoxWrapper>
            </div>
        )}

    </div>
  )
}

function BoxWrapper({children}){
    return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
  }