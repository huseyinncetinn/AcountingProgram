import React , {useEffect, useState} from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function CustomerChartsProfile() {


    
    const COLORS = ['#0088FE', '#FFBB28'];

    const [customers , setCustomers] = useState([]);
    const [suppliers , setSuppliers] = useState([]);
    const token = localStorage.getItem('token')

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/customers/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers', error);
        }
    };

    const fetchSuppliers = async () =>{
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/suppliers/',{
            headers : {
              Authorization : `Token ${token}`,
              'X-CSRFToken' : Cookies.get('csrftoken')
            }
          });
          setSuppliers(response.data)
        } catch (error) {
          console.error('Supplier dataabseden getirilmedi response sorunu' , error)
        }
    }

    useEffect(()=>{
        fetchCustomers();
        fetchSuppliers()
    },[])
    

    const data = [
        { name: 'Customers', value: customers.length },
        { name: 'Suppliers', value: suppliers.length },
    ];

    return (
        <div className="w-[20rem] h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
            <strong className="text-gray-700 font-medium">Number of Customers and Suppliers</strong>
            <div className="mt-3 w-full flex-1 text-xs">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))
                            }
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
