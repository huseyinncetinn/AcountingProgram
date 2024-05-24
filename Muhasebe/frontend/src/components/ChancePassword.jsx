import React, { useState , useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const navigateTo = useNavigate();

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrorMessage2('');
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/dj-rest-auth/password/change/',
                {
                    old_password: oldPassword,
                    new_password1: newPassword1,
                    new_password2: newPassword2
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'X-CSRFToken': Cookies.get('csrftoken')
                    }
                }
            );
            if(response.status == 200){
                console.log('şifre başarılı değişti')
                setOldPassword('');
                setNewPassword1('');
                setNewPassword2('');
                localStorage.removeItem('token');
                navigateTo('/');
            }

        } catch (error) {
            console.error('Apiden kaynaklı sorun' , error)
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.old_password) {
                    setErrorMessage('Old Password is Incorrect');
                }
                if (errorData.new_password2) {
                    setErrorMessage2('New passwords do not match.');
                }
                if (errorData.non_field_errors) {
                    setErrorMessage(errorData.non_field_errors.join(' '));
                }
            } else {
                setErrorMessage('Şifre değiştirme işlemi başarısız. Lütfen tekrar deneyin.');
            }
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setErrorMessage('');
            setErrorMessage2('');
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [errorMessage, errorMessage2]);
    return (
        <div className='flex justify-center m-10 h-screen'>
            <div className='text-center'>
                <h2 className='mt-5 text-3xl font-semibold'>Change Password</h2>
                <form className='flex flex-col w-full' onSubmit={handleSubmit}>
                    <input
                        type='password'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className='input input-bordered w-full mt-5 text-center'
                        placeholder='Old Password'
                    />
                    <input
                        type='password'
                        value={newPassword1}
                        onChange={(e) => setNewPassword1(e.target.value)}
                        className='input input-bordered w-full mt-5 text-center'
                        placeholder='New Password'
                    />
                    <input
                        type='password'
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                        className='input input-bordered w-full mt-5 text-center'
                        placeholder='New Password Again'
                    />
                    
                    {errorMessage && <div className='text-red-700'>{errorMessage}</div>}
                    {errorMessage2 && <div className='text-red-700'>{errorMessage2}</div>}

                    <button type='submit' className='btn btn-sm mt-5 bg-blue-700 text-white hover:bg-green-900'>
                        Change Password
                    </button>
                </form>

            </div>
        </div>
    )
}
