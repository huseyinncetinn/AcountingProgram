import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ExpenseTransactionDetail() {
    const [transactionData , setTransactionData] = useState(null);
    const {id} = useParams();
    const token = localStorage.getItem('token');

    const [editData, setEditData] = useState({
        quantity: '',
        description: '',
        supplier: '',
        product: ''
    });
    const [suppliers , setSuppliers] = useState([]);
    const [products , setProducts] =useState([]);
    const [errorMessage , setErrorMessage] = useState('');

    const fetchData = async (id) =>{
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/expensetransactions/${id}`,{
                headers : {
                    Authorization : `Token ${token}`,
                    'X-CSRFToken' : Cookies.get('csrftoken')
                }
            });
            if(response.data){
                setTransactionData(response.data)
                setEditData({
                    quantity: response.data.quantity,
                    description: response.data.description,
                    supplier: response.data.supplier,
                    product: response.data.product
                });
                console.log('data listelendi',response.data);

            }else{
                console.log('data listelenmedi');
            }
        } catch (error) {
            console.error('Api isteğinde sorun var',error)
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
            if(response.data){
                setSuppliers(response.data)
            }
        } catch (error) {
            console.error('Error fetching suppliers', error);
            
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products/',{
                headers :{
                    Authorization : `Token ${token}`,
                    'X-CSRFToken' : Cookies.get('csrftoken')
                }
            });
            if (response.data){
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products',error)
        }
    }

    useEffect(()=>{
        fetchData(id);
        fetchSuppliers();
        fetchProducts();
    },[id]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/expensetransactions/${transactionData.id}/`,editData,{
                headers : {
                    Authorization : `Token ${token}`,
                    'X-CSRFToken' : Cookies.get('csrftoken')
                }
            });
            console.log('Updated transaction data:', response.data);
            setTransactionData(response.data);
            document.getElementById('my_modal_5').close();
        } catch (error) {
            console.error('Error updating transaction data:', error);
            setErrorMessage('Please fill in the select fields.');
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

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
        {transactionData && (
            <div className="mt-4">
                <h2 className='text-2xl font-bold mb-2'>Transaction Information</h2>
                <table className="table-auto">
                        <tbody>
                            <tr>
                                <td className="font-semibold">Supplier Name:</td>
                                <td>{transactionData.supplier}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Product Name:</td>
                                <td>{transactionData.product}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Quantity:</td>
                                <td>{transactionData.quantity}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Amount:</td>
                                <td>{transactionData.amount}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Date:</td>
                                <td>{new Date(transactionData.date).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Description:</td>
                                <td>{transactionData.description}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Transaction Type:</td>
                                <td><span className='bg-red-700 p-2 rounded-md text-white'>{transactionData.transaction_type}</span></td>
                            </tr>
                        </tbody>
                </table>
                <div className="text-center mt-2">
                        <button
                            className='btn bg-blue-700 text-white hover:bg-blue-500'
                            onClick={() => document.getElementById('my_modal_5').showModal()}
                        >
                            Edit Expense Transaction
                        </button>
                        <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
                            <div className='modal-box'>
                                <h3 className='font-bold text-lg'>Edit IncomeTransaction Information</h3>
                                <p className='text-red-700'>{errorMessage}</p>
                                <form onSubmit={handleEditSubmit}>
                                    <input
                                        type='number'
                                        name='quantity'
                                        className='input input-bordered w-full mt-5'
                                        placeholder='Quantity'
                                        value={editData.quantity}
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
                                        name='supplier'
                                        className='input input-bordered w-full mt-5'
                                        value={editData.supplier}
                                        onChange={handleInputChange}
                                    >
                                        <option value=''>Select Supplier</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        name='product'
                                        className='input input-bordered w-full mt-5'
                                        value={editData.product}
                                        onChange={handleInputChange}
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
