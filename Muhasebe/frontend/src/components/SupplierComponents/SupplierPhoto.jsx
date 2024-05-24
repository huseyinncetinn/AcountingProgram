import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

export default function SupplierPhoto() {
    const [supplierPhotoUrl, setSupplierPhotoUrl] = useState(null);
    const { id } = useParams();
    const [isUploading, setIsUploading] = useState(false);

    const fetchSupplierPhoto = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/supplier-photo/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            });
            if (response.data && response.data.photo) {
                const photoUrl = `http://127.0.0.1:8000${response.data.photo}`;
                setSupplierPhotoUrl(photoUrl);
            }
        } catch (error) {
            console.error('Error fetching supplier photo:', error);
        }
    };

    useEffect(() => {
        fetchSupplierPhoto(id);
    }, [id]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setIsUploading(true);

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('photo', file);

        try {
            await axios.put(`http://127.0.0.1:8000/api/supplier-photo/${id}/`, formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            });
            
            // Resim başarıyla yüklendikten sonra yeniden resmi getir
            await fetchSupplierPhoto(id);
        } catch (error) {
            console.error('Profil fotoğrafı yüklenirken hata oluştu:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadButtonClick = () => {
        const fileInput = document.getElementById('photoInput');
        fileInput.click();
    };

    return (
        <div>
            <button
                onClick={handleUploadButtonClick}
                disabled={isUploading}
            >
            {supplierPhotoUrl && (
                <img src={supplierPhotoUrl} alt='Profile' className='rounded-full w-40 h-40' />
            )}
            <input
                id='photoInput'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
            />
            </button>
                    {isUploading && <p>Yükleniyor...</p>}
        </div>
    );
}
