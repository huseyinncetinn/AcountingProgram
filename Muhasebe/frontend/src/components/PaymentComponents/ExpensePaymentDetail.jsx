import React, { useEffect, useState } from 'react'
import axios, { Axios } from 'axios'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';


export default function ExpensePaymentDetail() {
  const [paymentData , setPaymentData] = useState([]);
  const [suppliers , setSuppliers] = useState([]);
  const [editData , setEditData] = useState({
    amount : '' , 
    description : '' , 
    supplier_payment : '',
  })

  const {id} = useParams();
  const token = localStorage.getItem('token');
  const [errorMessage, setErrorMessage] = useState('');



  const fetchData = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/expensepayment/${id}/`,{
        headers : {
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken')
        }
      });
      if(response.data) {
      setPaymentData(response.data)
      setEditData({
        amount: response.data.amount,
        description: response.data.description,
        supplier_payment: response.data.supplier_payment,
    });
      }

      console.log('data listelendi' , response.data)
    } catch (error) {
      console.error('data dbden getirilmedi bile' ,error)
    }
  }

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
    fetchData(id)
    fetchSuppliers()
  },[id])

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/expensepayment/${paymentData.id}/`,editData,{
        headers : {
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken')
        }
      });
      setPaymentData(response.data)
      console.log('data updated' , response.data);
      document.getElementById('my_modal_5').close();
    } catch (error) {
      console.error('api kaynaklı güncelleme sorunu');
      setErrorMessage('Please fill in the select fields.');

    }
  }

  const handleInputChange = (e) => {
    const {name , value} = e.target;
    setEditData({...editData , [name] : value});
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
          {paymentData && (
            <div className='mt-4'>
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="font-semibold">Customer Name:</td>
                                    <td>{paymentData.supplier_payment}</td>
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
                                        name='supplier_payment'
                                        className='input input-bordered w-full mt-5'
                                        value={editData.supplier_payment}
                                        onChange={handleInputChange}
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
