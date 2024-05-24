import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export default function IncomeTransaction() {
        // TABLE İLE ALAKALI
      const [incomeTransactionData , setIncomeTransacionData] = useState([]);
      const token = localStorage.getItem('token')

      // FORM İLE ALAKALI

      const [quantity , setQuantity] = useState('');
      const [description , setDescription] = useState('');
      const [customers, setCustomers] = useState([]);
      const [products, setProducts] = useState([]);
      const [selectedCustomer, setSelectedCustomer] = useState('');
      const [selectedProduct, setSelectedProduct] = useState('');

      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/incometransactions/',{
            headers : {
              Authorization : `Token ${token}`,
              'X-CSRFToken' : Cookies.get('csrftoken')
            }
          });
          if(Array.isArray(response.data) && response.data.length > 0){
            setIncomeTransacionData(response.data)
            console.log('expense listed' , response.data);
          }else{
            setIncomeTransacionData([]);
          }
        } catch (error) {
            console.error('not fetcing income data' , error)
        }
      }

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

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
            fetchCustomers();
            fetchProducts();
        }
    }, [token]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/incometransactions/',{
              quantity , description , customer: selectedCustomer, 
              product: selectedProduct,   
            },{
              headers : {
                Authorization : `Token ${token}`,
                'X-CSRFToken' : Cookies.get('csrftoken')
              }
            });
            fetchData();
            setQuantity('');
            setDescription('');
            setSelectedCustomer('');
            setSelectedProduct('');
            document.getElementById('my_modal_5').close();
        } catch (error) {
          if (error.response) {
            console.error('Server Error:', error.response.data);
            console.error('Status Code:', error.response.status);
        } else {
            console.error('Request Error:', error.message);
        }
        }
      }

      const deleteIncomeTransaction = async (incometransactionid) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/incometransactions/${incometransactionid}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
    
            // Müşteriyi başarıyla sildikten sonra tabloyu güncelle
            fetchData(); // Yeniden verileri çekerek tabloyu güncelle
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };


  return (
    <div>
          <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong className='text-gray-700 font-medium'>Income Transaction Table</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Customer</td>
                            <td>Product</td>
                            <td>Quantity</td>
                            <td>Amount</td>
                            <td>Date</td>
                            <td>Description</td>
                            <td>Transaction Type</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {incomeTransactionData !== null && incomeTransactionData.length > 0 ? (
                            incomeTransactionData.map((income) => (
                                <tr key={income.id}>
                                    <td>
                                        <Link to={`/incometransaction/${income.id}`}>#{income.id}</Link>
                                    </td>
                                    <td>
                                        <Link to={`/customer/${income.customer_id}`}>{income.customer}</Link>
                                    </td>
                                    <td>
                                      <Link to={`/product/${income.product_id}`}>{income.product}</Link>
                                    </td>
                                    <td>{income.quantity}</td>
                                    <td>{income.amount} </td>
                                    <td>{new Date(income.date).toLocaleDateString()}</td>
                                    <td>{income.description}</td>
                                    <td><span className='bg-green-700 text-white p-1 rounded-md'>{income.transaction_type}</span></td>
                                    <td>

                                        <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900" onClick={()=>document.getElementById(`${income.id}`).showModal()}>X</button>
                                            <dialog id={income.id} className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">Do you really want to delete this Transaction?</h3>
                                                    <div className="modal-action">
                                                    <form method="dialog">
                                                        <div>
                                                            <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                    onClick={() => deleteIncomeTransaction(income.id)}>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan='7'>No supplier data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

          <div className='text-center mt-2'>
              <button
                          className='btn bg-blue-700 text-white hover:bg-blue-500'
                          onClick={() => document.getElementById('my_modal_5').showModal()}
                      >
                          Add A New IncomeTransaction
              </button>
              <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
                <div className='modal-box'>
                <h3 className='font-bold text-lg'>IncomeTransaction Information</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type='number'
                        name='quantity'
                        className='input input-bordered w-full mt-5'
                        placeholder='Quantity'
                        value={quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value) && Number(value) >= 0) {
                                setQuantity(value);
                            }
                        }}
                        min='0' // Sadece pozitif değerler için
                        required
                    />
                    <textarea
                    type='text'
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
                    >
                        <option value=''>Select Customer</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name='product'
                        className='input input-bordered w-full mt-5'
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value=''>Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.productName}
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
  )
}
