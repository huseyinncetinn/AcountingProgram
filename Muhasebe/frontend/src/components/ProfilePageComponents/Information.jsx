import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserProfile = () => {
  const [userData, setUserData] = useState('');
  const [editData, setEditData] = useState({
    address: '',
    phone: '',
    email: '',
  });
  const [phone , setPhone] = useState('');


  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      console.log('User Data:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setUserData(response.data[0]);
        setEditData({
          address: response.data[0].address,
          phone: response.data[0].phone,
          email: response.data[0].email
        });
      } else {
        console.error('No user data found');
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/user-profile/${userData.id}/`, editData, {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      console.log('User data updated:', response.data);
      setUserData(response.data); // Güncellenmiş kullanıcı verilerini set et
      document.getElementById('my_modal_5').close(); // Modalı kapat
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    document.getElementById('my_modal_5').close();
  };

  const handlePhoneChange = (e) => {
    let inputPhone = e.target.value;
    inputPhone = inputPhone.replace(/\D/g, '');
    inputPhone = inputPhone.slice(0,10);
    setPhone(inputPhone);
    setEditData({...editData , phone : inputPhone});
  }

  return (
    <div>
{userData && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">User Information</h2>
          <table className="table-auto">
            <tbody>
              <tr>
                <td className="font-semibold">Name:</td>
                <td>{userData.user}</td>
              </tr>
              <tr>
                <td className="font-semibold">Address:</td>
                <td>{userData.address}</td>
              </tr>
              <tr>
                <td className="font-semibold">Phone:</td>
                <td>{userData.phone}</td>
              </tr>
              <tr>
                <td className="font-semibold">Email:</td>
                <td>{userData.email}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn bg-blue-500 mt-4" onClick={() => document.getElementById('my_modal_5').showModal()}>
            Change Information
          </button>
        </div>
      )}

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Edit Information</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              placeholder="Address"
              className="input input-bordered w-full mt-5"
              name="address"
              value={editData.address}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="input input-bordered w-full mt-5"
              name="phone"
              value={editData.phone}
              onChange={handlePhoneChange}
              maxLength={10}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mt-5"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
            />
            <div className="modal-action">
              <div className="flex gap-4 flex-wrap justify-center p-2">
                <button type="submit" className="btn btn-sm bg-green-700 text-white hover:bg-green-900">
                  Save
                </button>
                <button
                  className="btn btn-sm bg-red-700 text-white hover:bg-red-900"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('my_modal_5').close();
                  }}
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

export default UserProfile;
