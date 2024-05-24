import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

export default function CustomerPhoto() {

    const [customerPhoto , setCustomerPhoto] = useState(null);
    const {id} = useParams();
    const [isUploading , setIsUploading] = useState(false);

    const fetchCustomerPhoto = async (id) => {
       const token = localStorage.getItem('token');
       try {
          const response = await axios.get(`http://127.0.0.1:8000/api/customer-photo/${id}/`,{
            headers : {
              Authorization : `Token ${token}`,
              'X-CSRFToken' : Cookies.get('csrftoken')
            }
          });
          if(response.data && response.data.photo){
            const photoUrl = `http://127.0.0.1:8000${response.data.photo}`;
            setCustomerPhoto(photoUrl);
          }
       } catch (error) {
        console.error('Error fetching customer photo:', error);
       }
    }

    useEffect(() => {
      fetchCustomerPhoto(id);
    },[id])
    
    const handleChangeFile = async (e) => {
      const file = e.target.files[0];
      setIsUploading(true);

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo' , file);

      try {
        await axios.put(`http://127.0.0.1:8000/api/customer-photo/${id}/`,formData , {
          headers : {
            Authorization : `Token ${token}`,
            'X-CSRFToken' : Cookies.get('csrftoken'),
          }
        });
        await fetchCustomerPhoto(id)
      } catch (error) {
        console.error('Profil fotoğrafı yüklenirken hata oluştu:', error);
      }finally {
        setIsUploading(false);
      }

    };

    const handleUploadButtonClick = () => {
      const fileInput = document.getElementById('photoInput1');
      fileInput.click();
  };

    

  return (
    <div>
    <button
        onClick={handleUploadButtonClick}
        disabled={isUploading}
    >
    {customerPhoto && (
        <img src={customerPhoto} alt='Profile' className='rounded-full w-40 h-40' />
    )}
    <input
        id='photoInput1'
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
