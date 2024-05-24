import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function SupplierTableandForm() {

    const [supplierData, setSupplierData] = useState(null);
    const token = localStorage.getItem('token');

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/suppliers/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });

            if (Array.isArray(response.data) && response.data.length > 0) {
                setSupplierData(response.data);
            } else {
                console.error('No supplier data found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handlePhoneChange = (e) => {
        let inputPhone = e.target.value;
    
        // Sadece rakam içeren değerleri al
        inputPhone = inputPhone.replace(/\D/g, ''); // \D, rakam olmayan karakterleri seçer
    
        // En fazla 10 karaktere sınırla
        inputPhone = inputPhone.slice(0, 10);
    
        // Telefon numarasını state'e kaydet
        setPhone(inputPhone);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const csrfToken = Cookies.get('csrftoken');
    
        try {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/suppliers/',
            {
              name,
              address,
              phone,
              email,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
                'X-CSRFToken': csrfToken,
              },
            }
          );
          fetchData();
          setName('');
          setAddress('');
          setPhone('');
          setEmail('');
          document.getElementById('my_modal_5').close();
        } catch (error) {
          console.error('Error adding supplier:', error);
        }
      };

      const deleteSupplier = async (supplierId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/suppliers/${supplierId}/`, {
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
                            <td>Supplier Name</td>
                            <td>Supplier Address</td>
                            <td>Supplier Phone</td>
                            <td>Supplier Photo</td>
                            <td>Supplier Email</td>
                            <td>Debt</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {supplierData !== null && supplierData.length > 0 ? (
                            supplierData.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>
                                        <Link to={`/supplier/${supplier.id}`}>#{supplier.id}</Link>
                                    </td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.address}</td>
                                    <td>{supplier.phone}</td>
                                    <td>
                                        <img src={supplier.photo} alt='' className='rounded-full w-10 h-10' />
                                    </td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.debt}</td>
                                    <td>
                                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                                            <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900" onClick={()=>document.getElementById('my_modal_1').showModal()}>X</button>
                                            <dialog id="my_modal_1" className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Do you want to delete the information?</h3>
                                                <div className="modal-action">
                                                <form method="dialog">
                                                    <div>
                                                        <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                onClick={() => deleteSupplier(supplier.id)}>
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
                Add A New Supplier
            </button>
            <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
                <div className='modal-box'>
                <h3 className='font-bold text-lg'>Supplier Information</h3>
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
