import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

import { useParams } from 'react-router-dom';

export default function ProductPhoto() {

    const [productPhoto , setProductPhoto] = useState(null);
    const {id} = useParams();
    const [isUploading , setIsUploading] = useState(false);

    const fetchProductPhoto = async (id) => {
        const token = localStorage.getItem('token');
        try {
           const response = await axios.get(`http://127.0.0.1:8000/api/product-photo/${id}/`,{
             headers : {
               Authorization : `Token ${token}`,
               'X-CSRFToken' : Cookies.get('csrftoken')
             }
           });
           if(response.data && response.data.productImage){
             const photoUrl = `http://127.0.0.1:8000${response.data.productImage}`;
             setProductPhoto(photoUrl);
           }
        } catch (error) {
         console.error('Error fetching customer photo:', error);
        }
     }
 
     useEffect(() => {
        fetchProductPhoto(id);
     },[id])

     const handleChangeFile = async (e) => {
        const file = e.target.files[0];
        setIsUploading(true);
  
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('productImage' , file);
  
        try {
          await axios.put(`http://127.0.0.1:8000/api/product-photo/${id}/`,formData , {
            headers : {
              Authorization : `Token ${token}`,
              'X-CSRFToken' : Cookies.get('csrftoken'),
            }
          });
          await fetchProductPhoto(id)
        } catch (error) {
          console.error('Profil fotoğrafı yüklenirken hata oluştu:', error);
        }finally {
          setIsUploading(false);
        }
      };
      const handleUploadButtonClick = () => {
        const fileInput = document.getElementById('photoInput2');
        fileInput.click(); }

  return (
    <div>
    <button
        onClick={handleUploadButtonClick}
        disabled={isUploading}
    >
    {productPhoto && (
        <img src={productPhoto} alt='Profile' className='rounded-full w-40 h-40' />
    )}
    <input
        id='photoInput2'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChangeFile}
    />
    </button>
            {isUploading && <p>Yükleniyor...</p>}
</div>
  )
}
