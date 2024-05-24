import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';



export default function CustomerTableandForm() {

    // Table ile alakalı states
    const [customerData , setCustomerData] = useState(null);
    const token = localStorage.getItem('token');

    // Form ile alakalı states

    const [name , setName] = useState('');
    const [address , setAddress] = useState('');
    const [phone , setPhone] = useState('');
    const [email , setEmail] = useState('');


    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/customers/',{
                headers : {
                    Authorization : `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
            if (Array.isArray(response.data) && response.data.length >0) {
                setCustomerData(response.data)
            }else{
                setCustomerData([]);
            }
        } catch (error) {
            console.error('not fetcing cus data' , error)
        }
    }

    useEffect(()=>{
        if(token){
            fetchData();
        }
    },[token])
 

    const handlePhoneChange = (e) => {
        let inputPhone = e.target.value;

        inputPhone = inputPhone.replace(/\D/g, '');

        inputPhone = inputPhone.slice(0 ,10);

        setPhone(inputPhone);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/customers/',{
                name , address , phone , email
            },{
                headers : {
                    Authorization : `Token ${token}`,
                    'X-CSRFToken' : Cookies.get('csrftoken'),
                },
            });
            
            fetchData();
            setName('');
            setAddress('');
            setPhone('');
            setEmail('');
            document.getElementById('my_modal_5').close();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    }

    const deleteCustomer = async (customerId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/customers/${customerId}/`, {
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
            <strong className='text-gray-700 font-medium'>Supplier Table</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Customer Name</td>
                            <td>Customer Address</td>
                            <td>Customer Phone</td>
                            <td>Customer Photo</td>
                            <td>Customer Email</td>
                            <td>Debt</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData !== null && customerData.length > 0 ? (
                            customerData.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <Link to={`/customer/${customer.id}`}>#{customer.id}</Link>
                                    </td>
                                    <td>{customer.name}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.phone}</td>
                                    <td>
                                        <img src={customer.photo} alt='' className='rounded-full w-10 h-10' />
                                    </td>
                                    <td>{customer.email}</td>
                                    <td>{customer.debt}</td>
                                    <td>

                                        <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900" onClick={()=>document.getElementById(`${customer.id}`).showModal()}>X</button>
                                            <dialog id={customer.id} className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">Do you really want to delete this customer?</h3>
                                                    <div className="modal-action">
                                                    <form method="dialog">
                                                        <div>
                                                            <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                    onClick={() => deleteCustomer(customer.id)}>
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
                Add A New Customer
            </button>
            <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
                <div className='modal-box'>
                <h3 className='font-bold text-lg'>Customer Information</h3>
                <form onSubmit={handleSubmit}>
                    <input
                    type='text'
                    name='name'
                    className='input input-bordered w-full mt-5'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                    <input
                    type='text'
                    name='address'
                    className='input input-bordered w-full mt-5'
                    placeholder='Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                    type='tel' // type="tel" olarak değiştirin
                    name='phone'
                    className='input input-bordered w-full mt-5'
                    placeholder='Phone'
                    value={phone}
                    onChange={handlePhoneChange} // Phone alanı için özel onChange işlevi
                    maxLength={10} // Maksimum 10 karakter sınırlaması (HTML5 maxLength özelliği)
                    pattern="[0-9]*" // Sadece rakamları kabul etmek için
                    inputMode="numeric" // Sadece sayısal giriş modu
                    />
                    <input
                    type='email'
                    name='email'
                    className='input input-bordered w-full mt-5'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
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
