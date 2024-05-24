import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FcBearish } from "react-icons/fc";

const LoginRegister = () => {
  const [action, setAction] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigateTo = useNavigate()

  const registerLink = () => {
    setAction(' active');
  }

  const loginLink = () => {
    setAction('');
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 =e.target.password2.value;

    if (password !== password2) {
      setErrorMsg('Passwords do not match');
      setSuccessMsg('');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/registration/', {
        username,
        email,
        password1: password,
        password2: password2
      });
      console.log('Registration response:', response.data);
      // Kayıt başarılı ise login sayfasında kalınsnı ve kullanıcı tekrar giriş yapsın
      if(response.data){
        setSuccessMsg('Registration successful!');
        setErrorMsg('');
        navigateTo('/')
      }
    } catch (error) {
      setErrorMsg('There is already such a user');
      setSuccessMsg('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value; // Backend kısmında kullanıcının email ile girmesini istediğim için e mail alıyorum
    const password = e.target.password.value;
    try {
      const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', {
        email, // email olarak gönderiliyor
        password
      });
      console.log('Login response:', response.data);
      // Başarılı giriş yönetimi: token'i localStorage'a kaydetme, sayfayı yönlendirme
      if (response.data && response.data.key) {
        // Token'ı localStorage'a ekleyin
        localStorage.setItem('token', response.data.key);
        
        // Kullanıcı eğer doğru şekilde girdiyse bilgileri dashboard sayfasına yönlensin
        navigateTo('/dashboard');
        const token = localStorage.getItem('token')
        try {
          const profileResponse = await axios.get('http://127.0.0.1:8000/api/profile-photo/',{
            headers : {
               Authorization : `Token ${token}`
            }
          });
          if(profileResponse.data){
            localStorage.setItem('profilePhotoUrl',`http://127.0.0.1:8000${profileResponse.data.photo}`)
            console.log(profileResponse)

          }
        } catch (error) {
          
        }


      }
  
    } catch (error) {
      setErrorMsg('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='w-full md:w-1/2 p-4 main-page-left'>
          <div className='grid place-items-center h-full text-center'>
                <h1 className='flex items-center gap-2 px-2 py-1'><FcBearish></FcBearish> Accounting Program</h1>
                <h2>This is a Preliminary Accounting Program</h2>
                <p>You can keep all your accounting data in this program.</p>
          </div>
      </div>
        <div className='LoginRegisterPage w-full md:w-1/2 p-4'>
          <div className={`wrapper${action}`}>
            <div className='form-box login'>
              <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <span className={`LoginRegisterMessages ${errorMsg ? 'visible' : ''}`}>
              {errorMsg}
            </span>


                <div className="input-box">
                  <input type="text" name="email" placeholder='E-Mail' required />
                  <FaUser className='icon' />
                </div>
                <div className="input-box">
                  <input type="password" name="password" placeholder='Password' required />
                  <FaLock className='icon' />
                </div>
                <button type='submit'>Login</button>
                <div className="register-link">
                  <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                </div>
              </form>
            </div>

            <div className='form-box register'>
              <form onSubmit={handleRegister}>
                <h1>Registration</h1>
                <span className={`LoginRegisterMessages${errorMsg ? ' visible' : ''}`}>{errorMsg}</span>
                <span className={`LoginRegisterMessages2 ${successMsg ? 'visible' : ''}`}>{successMsg}</span>
                <div className="input-box">
                  <input type="text" name="username" placeholder='Username' required />
                  <FaUser className='icon' />
                </div>
                <div className="input-box">
                  <input type="email" name="email" placeholder='E-Mail' required />
                  <FaEnvelope className='icon' />
                </div>
                <div className="input-box">
                  <input type="password" name="password" placeholder='Password' required />
                  <FaLock className='icon' />
                </div>
                <div className="input-box">
                  <input type="password" name="password2" placeholder='Password again' required />
                  <FaLock className='icon' />
                </div>
                <div className="remember-forgot">
                  <label><input type="checkbox" />I agree to the terms conditions&</label>
                </div>
                <button type='submit'>Register</button>
                <div className="register-link">
                  <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>

  );
};

export default LoginRegister;
