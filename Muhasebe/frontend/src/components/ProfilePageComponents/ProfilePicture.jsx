import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useProfile } from '../../contexts/ProfileContext';

const ProfilePicture = () => {
  const { profilePhotoUrl, updateProfilePhotoUrl } = useProfile();
  const [isUploading, setIsUploading] = useState(false);

  const fetchProfilePhoto = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/profile-photo/', {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      });
      
      if (response.data && response.data.photo) {
        const photoUrl = `http://127.0.0.1:8000${response.data.photo}`;
        updateProfilePhotoUrl(photoUrl); // Profil fotoğrafını güncelle
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

  useEffect(() => {
    fetchProfilePhoto(); // Component yüklendiğinde profil fotoğrafını al
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Seçilen dosyayı al

    setIsUploading(true);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Dosyayı sunucuya yükle
      await axios.put('http://127.0.0.1:8000/api/profile-photo/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      });

      // Yükleme tamamlandıktan sonra profil fotoğrafını yeniden getir
      await fetchProfilePhoto();
    } catch (error) {
      console.error('Profil fotoğrafı yüklenirken hata oluştu:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.getElementById('photoInput');
    fileInput.click(); // Dosya seçim penceresini aç
  };

  return (
    <div>
      <button onClick={handleUploadButtonClick} disabled={isUploading}>
        {profilePhotoUrl && (
          <img src={profilePhotoUrl} alt='Profile' className='rounded-full w-40 h-40' />
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
};

export default ProfilePicture;
