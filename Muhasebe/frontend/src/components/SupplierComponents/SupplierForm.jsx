import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useProfile } from '../../contexts/ProfileContext';

const SupplierForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { suppliers, setSuppliers } = useProfile();


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

      const defaultPhotoUrl = 'http://127.0.0.1:8000/media/profile_photos/2024/default.jpg';

      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setSuppliers(
        {
          id : response.data.id,
          name:name,
          address:address,
          phone:phone,
          email:email ,
          photo: defaultPhotoUrl,
          debt: response.data.debt,
        }
      )
      document.getElementById('my_modal_5').close();
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div className='text-center mt-2'>
      <button
        className='btn bg-blue-700 text-white hover:bg-blue-500'
        onClick={() => document.getElementById('my_modal_5').showModal()}
      >
        Add a New Supplier
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
  );
};

export default SupplierForm;
