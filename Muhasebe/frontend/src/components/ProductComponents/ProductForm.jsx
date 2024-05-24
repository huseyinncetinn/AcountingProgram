import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useProfile } from '../../contexts/ProfileContext';


export default function ProductForm() {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  const { products ,setProducts } = useProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const csrfToken = Cookies.get('csrftoken');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/products/',
        {
          productName: name,
          stock: parseInt(stock),
          price: parseFloat(price),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'X-CSRFToken': csrfToken,
          },
        }
      );

      // Ürün eklendikten sonra yapılabilecek işlemler
      console.log('Ürün eklendi:', response.data);

      const defaultPhotoUrl = 'http://127.0.0.1:8000/media/profile_photos/2024/default.jpg';

      setProducts({
        id: response.data.id,
        productName: name,
        productImage: defaultPhotoUrl,
        stock: stock,
        price: parseFloat(response.data.price),
      });

      document.getElementById('my_modal_5').close(); // Modalı kapat
    } catch (error) {
      console.error('Ürün eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className='text-center mt-2'>
      <button
        className='btn bg-blue-700 text-white hover:bg-blue-500'
        onClick={() => document.getElementById('my_modal_5').showModal()}
      >
        Add a New Product
      </button>
      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Product Information</h3>
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
              type='number'
              name='stock'
              className='input input-bordered w-full mt-5'
              placeholder='Stock'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min='0' // Sadece pozitif değerler için
              required
            />
            <input
              type='number'
              name='price'
              className='input input-bordered w-full mt-5'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min='0' // Sadece pozitif değerler için
              required
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
}
