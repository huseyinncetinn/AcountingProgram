import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function ExpensePayment() {

  const [expensePaymentData , setExpensePaymentData] = useState([]);
  const token = localStorage.getItem('token');

  const [amount , setAmount] = useState('');
  const [description , setDescription] = useState('');
  const [suppliers , setSuppliers] = useState([]);
  const [selectedSupplier , setSelectedSupplier] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/expensepayment/',{
        headers:{
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken')
        }
      });
      if(Array.isArray(response.data) && response.data.length >0){
        setExpensePaymentData(response.data);
        console.log('expensepayment listelendi' , response.data)
      }else {
        setExpensePaymentData([]);
      }
    } catch (error) {
      console.error('apiden kaynaklı sorun' , error)
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/suppliers/',{
        headers :{
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken')
        }
      });
      if (response.data){
        setSuppliers(response.data);
      }
    } catch (error) {
      
    }
  }

  useEffect (() =>{
    if(token){
      fetchData();
      fetchSuppliers();
    }
  },[token]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/expensepayment/',{
          amount , description , supplier_payment : selectedSupplier
        },{
          headers : {
            Authorization : `Token ${token}`,
            'X-CSRFToken' : Cookies.get('csrftoken')
          }
        });
        fetchData();
        setAmount('');
        setDescription('');
        setSelectedSupplier('');
        document.getElementById('my_modal_8').close();
      } catch (error) {
        console.error('Database e veri yollanamadı:', error);

      }
  };

  const deleteExpensePayment = async (expensepaymentid) =>{
      try {
        await axios.delete(`http://127.0.0.1:8000/api/expensepayment/${expensepaymentid}/`,{
          headers : {
            Authorization : `Token ${token}`,
            'X-CSRFToken' : Cookies.get('csrftoken')
          }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting expense payment:', error);
      }
  }


  return (
    <div>
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
        <strong className='text-gray-700 font-medium'>Expense Payment Table</strong>
                <div className='mt-3'>
                    <table className='w-full text-gray-700'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Supplier</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expensePaymentData.map((expense) => (
                                <tr key={expense.id}>
                                    <td>
                                        <Link to={`/expensepayment/${expense.id}`}>#{expense.id}</Link>
                                    </td>
                                    <td>
                                        <Link to={`/supplier/${expense.supplier_id}`}>{expense.supplier_payment}</Link>
                                    </td>
                                    <td>{expense.amount}</td>
                                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                                    <td>{expense.description}</td>
                                    <td>
                                    <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900" onClick={()=>document.getElementById(`${expense.id}`).showModal()}>X</button>
                                            <dialog id={expense.id} className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">Do you really want to delete this Expense Payment?</h3>
                                                    <div className="modal-action">
                                                    <form method="dialog">
                                                        <div>
                                                            <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                    onClick={() => deleteExpensePayment(expense.id)}>
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
                    onClick={() => document.getElementById('my_modal_8').showModal()}
                >
                    Add A New Expense Transaction
                </button>
                <dialog id='my_modal_8' className='modal modal-bottom sm:modal-middle'>
                    <div className='modal-box'>
                        <h3 className='font-bold text-lg'>Income Transaction Information</h3>
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
                                name='supplier'
                                className='input input-bordered w-full mt-5'
                                value={selectedSupplier}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                required
                            >
                                <option value=''>Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
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
                                                onClick={() => document.getElementById('my_modal_8').close()}
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
  )
}
