import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function CustomerInformation() {

  const [customerData , setCustumerData] = useState(null);
  const {id} = useParams();
  const [editCustomerData , setEditCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const token = localStorage.getItem('token');
  const [phone , setPhone] = useState('');

  const fetchCustomerData = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/customers/${id}`,{
        headers : {
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken'),
        }
      });
      if(response.data){
        console.log('Customer Data',response.data)
        setCustumerData(response.data)
      }else{
        console.error('Not found customer data');
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
    }
  }

  useEffect(() => {
    fetchCustomerData(id)
  },[id])
 
  const handleEditSubmit = async (e) =>{
    e.preventDefault();

    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/customers/${customerData.id}/`,editCustomerData,{
        headers : {
          Authorization : `Token ${token}`,
          'X-CSRFToken' : Cookies.get('csrftoken')
        }
      });
      console.log('Yenilenmiş data',response.data);
      setCustumerData(response.data)
      document.getElementById('my_modal_5').close();
    } catch (error) {
      console.error('Daha editlenirken hata oluştur' , error)
    }
  }

  const handleInputChange = (e) => {
    const { name , value} = e.target;
    setEditCustomerData({...editCustomerData , [name] : value});
  };

  const handlePhoneChange = (e) => {
    let inputPhone = e.target.value;
    inputPhone = inputPhone.replace(/\D/g, '');
    inputPhone = inputPhone.slice(0,10);
    setPhone(inputPhone);
    setEditCustomerData({...editCustomerData , phone : inputPhone});
  }

  return (
    <div>
    {customerData && (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Customer Information</h2>
      <table className="table-auto">
        <tbody>
          <tr>
            <td className="font-semibold">Supplier Name:</td>
            <td>{customerData.name}</td>
          </tr>
          <tr>
            <td className="font-semibold">Supplier Address:</td>
            <td>{customerData.address}</td>
          </tr>
          <tr>
            <td className="font-semibold">Supplier Phone:</td>
            <td>{customerData.phone}</td>
          </tr>
          <tr>
            <td className="font-semibold">Supplier Email:</td>
            <td>{customerData.email}</td>
          </tr>
          <tr>
            <td className="font-semibold">Supplier Debt:</td>
            <td>{customerData.debt}</td>
          </tr>
        </tbody>
      </table>
      <button
      className="btn bg-blue-500 mt-4"
      onClick={
        () => {
          document.getElementById('my_modal_5').showModal();
          setEditCustomerData({
            name : customerData.name,
            email : customerData.email,
            address : customerData.address,
            phone : customerData.phone
          })
        }
      }
      >
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
                    placeholder="Name"
                    className="input input-bordered w-full mt-5"
                    name="name"
                    value={editCustomerData.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="input input-bordered w-full mt-5"
                    name="address"
                    value={editCustomerData.address}
                    onChange={handleInputChange}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="input input-bordered w-full mt-5"
                    name="phone"
                    value={editCustomerData.phone}
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
                    value={editCustomerData.email}
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
      <div className='flex flex-col items-center mt-5'>
              <Link to="/customers">
                <button className="btn btn-warning">Go to Cuostomer Table</button>
              </Link>
        </div>
</div>
  )
}
