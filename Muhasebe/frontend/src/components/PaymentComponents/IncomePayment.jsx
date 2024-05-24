import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export default function IncomePayment() {
    const [incomePaymentData, setIncomePaymentData] = useState([]);
    const token = localStorage.getItem('token');

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/incomepayment/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
            if (Array.isArray(response.data) && response.data.length > 0) {
                setIncomePaymentData(response.data);
            }else{
                setIncomePaymentData([]);
            }
        } catch (error) {
            console.error('Apiden kaynaklı sorun', error);
        }
    };

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

    useEffect(() => {
        if (token) {
            fetchData();
            fetchCustomers();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/incomepayment/',
                {
                    amount,
                    description,
                    customer_payment: selectedCustomer,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                }
            );
            fetchData();
            setAmount('');
            setDescription('');
            setSelectedCustomer('');
            document.getElementById('my_modal_5').close();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteIncomePayment = async (incomepaymentid) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/incomepayment/${incomepaymentid}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting income payment:', error);
        }
    };

    return (
        <div>
            <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
                <strong className='text-gray-700 font-medium'>Income Payment Table</strong>
                <div className='mt-3'>
                    <table className='w-full text-gray-700'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomePaymentData.map((income) => (
                                <tr key={income.id}>
                                    <td>
                                        <Link to={`/incomepayment/${income.id}`}>#{income.id}</Link>
                                    </td>
                                    <td>
                                        <Link to={`/customer/${income.customer_id}`}>{income.customer_payment}</Link>
                                    </td>
                                    <td>{income.amount}</td>
                                    <td>{new Date(income.date).toLocaleDateString()}</td>
                                    <td>{income.description}</td>
                                    <td>
                                    <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900" onClick={()=>document.getElementById(`${income.id}`).showModal()}>X</button>
                                            <dialog id={income.id} className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">Do you really want to delete this Income Payment?</h3>
                                                    <div className="modal-action">
                                                    <form method="dialog">
                                                        <div>
                                                            <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                    onClick={() => deleteIncomePayment(income.id)}>
                                                                            Yes
                                                            </button>
                                                            <button className="btn btn-sm mt-2 bg-red-700 text-white hover:bg-red-900">No</button>
                                                        </div>
                                                    </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='text-center mt-2'>
                <button
                    className='btn bg-blue-700 text-white hover:bg-blue-500'
                    onClick={() => document.getElementById('my_modal_5').showModal()}
                >
                    Add A New Income Transaction
                </button>
                <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
                    <div className='modal-box'>
                        <h3 className='font-bold text-lg'>IncomeTransaction Information</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type='number'
                                name='amount'
                                className='input input-bordered w-full mt-5'
                                placeholder='Amount'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min='0'
                                required
                            />
                            <textarea
                                name='description'
                                className='input input-bordered w-full mt-5'
                                placeholder='Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <select
                                name='customer'
                                className='input input-bordered w-full mt-5'
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                required
                            >
                                <option value=''>Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                            <div className='modal-action'>
                                    <div>
                                            <button type='submit' className='btn btn-sm bg-green-700 text-white hover:bg-green-900'>
                                                Add
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-sm mt-4 bg-red-700 text-white hover:bg-red-900'
                                                onClick={() => document.getElementById('my_modal_5').close()}
                                            >
                                                Close
                                            </button>
                                    </div>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    );
}
