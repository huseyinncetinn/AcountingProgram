import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function IncomePaymentDetail() {
  const [paymentData , setPaymentData] = useState([]);
  const [editData, setEditData] = useState({
      amount: '',
      description: '',
      customer_payment: '',
  });
  const [customers , setCustomers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const {id} = useParams();
  const token = localStorage.getItem('token');

  const fetchData = async (id) =>{
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/incomepayment/${id}/`,{
        headers : {
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken')
        }
      });
      if(response.data){
        setPaymentData(response.data);
        setEditData({
          amount: response.data.amount,
          description: response.data.description,
          customer_payment: response.data.customer_payment,
      });
        console.log('income payment listelendi' , response.data)
      }
    } catch (error) {
      console.error('data listenmedi apiden kaynaklı sorun' , error)
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

  useEffect(()=>{
    fetchData(id);
    fetchCustomers();
  },[id])

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/incomepayment/${paymentData.id}/`, editData, {
            headers: {
                Authorization: `Token ${token}`,
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        });
        setPaymentData(response.data);
        console.log('Updated peyment data:', response.data);
        document.getElementById('my_modal_5').close();
    } catch (error) {
        console.error('Error updating payment data:', error);
        setErrorMessage('Please fill in the select fields.');
    }
};

  const handleInputChange = (e) =>{
    const {name , value} = e.target;
    setEditData({...editData , [name]:value});
  }

  useEffect(() => {
    // errorMessage state'ini temizler
    const timer = setTimeout(() => {
        setErrorMessage('');
    }, 5000); // 5 saniye sonra errorMessage kaybolur

    return () => {
        clearTimeout(timer); // useEffect temizlendiğinde timer silinir
    };
}, [errorMessage]);

  return (
    <div className='flex flex-row justify-center'>
        {paymentData &&(
          <div className='mt-4'>
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="font-semibold">Customer Name:</td>
                                    <td>{paymentData.customer_payment}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Amount:</td>
                                    <td>{paymentData.amount}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Date:</td>
                                    <td>{new Date(paymentData.date).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Description:</td>
                                    <td>{paymentData.description}</td>
                                </tr>
                            </tbody>
              </table>
              <div className='text-center mt-2'>
                        <button
                            className='btn bg-blue-700 text-white hover:bg-blue-500'
                            onClick={() => document.getElementById('my_modal_5').showModal()}
                        >
                            Edit Income Payment
                        </button>
                        <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
                            <div className='modal-box'>
                                <h3 className='font-bold text-lg'>Edit IncomeTransaction Information</h3>
                                <p className='text-red-700'>{errorMessage}</p>
                                <form onSubmit={handleEditSubmit}>
                                <input
                                        type='number'
                                        name='amount'
                                        className='input input-bordered w-full mt-5'
                                        placeholder='Amount'
                                        value={editData.amount}
                                        onChange={handleInputChange}
                                        min='0' // Sadece pozitif değerler için
                                        required
                                    />
                                    <textarea
                                        type='text'
                                        name='description'
                                        className='input input-bordered w-full mt-5'
                                        placeholder='Description'
                                        value={editData.description}
                                        onChange={handleInputChange}
                                    />
                                    <select
                                        name='customer_payment'
                                        className='input input-bordered w-full mt-5'
                                        value={editData.customer_payment}
                                        onChange={handleInputChange}
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
                                                  Edit
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
        )}
    </div>
  )
}
