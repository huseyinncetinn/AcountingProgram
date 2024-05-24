import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function SupplierInformation() {
  const [supplierData, setSupplierData] = useState(null);
  const { id } = useParams();
  const [editSupplierData, setEditSupplierData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [phone, setPhone] = useState('');

  const token = localStorage.getItem('token');

  const fetchSupplierData = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/suppliers/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      if (response.data) {
        setSupplierData(response.data);

        // Mevcut tedarikçi bilgileriyle editSupplierData state'ini güncelle
        setEditSupplierData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        });
      } else {
        console.error('No supplier data found');
      }
    } catch (error) {
      console.error('Error fetching supplier data:', error);
    }
  };

  useEffect(() => {
    fetchSupplierData(id); // id değiştiğinde tedarikçi verilerini yeniden al
  }, [id]); // id değişkeni değiştiğinde useEffect çalışacak

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/suppliers/${supplierData.id}/`,
        editSupplierData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
        }
      );

      console.log('Supplier data updated:', response.data);

      // Supplier data'nın güncel haliyle state'i güncelle
      setSupplierData(response.data);

      // Modalı kapat
      document.getElementById('my_modal_5').close();
    } catch (error) {
      console.error('Error updating supplier data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSupplierData({ ...editSupplierData, [name]: value });
  };

  const handlePhoneChange = (e) => {
    let inputPhone = e.target.value;
    inputPhone = inputPhone.replace(/\D/g, ''); // Sadece rakam içeren değerleri al
    inputPhone = inputPhone.slice(0, 10); // En fazla 10 karaktere sınırla
    setPhone(inputPhone);
    setEditSupplierData({ ...editSupplierData, phone: inputPhone });
  };

  return (
    <div>
      {supplierData && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Supplier Information</h2>
          <table className="table-auto">
            <tbody>
              <tr>
                <td className="font-semibold">Supplier Name:</td>
                <td>{supplierData.name}</td>
              </tr>
              <tr>
                <td className="font-semibold">Supplier Address:</td>
                <td>{supplierData.address}</td>
              </tr>
              <tr>
                <td className="font-semibold">Supplier Phone:</td>
                <td>{supplierData.phone}</td>
              </tr>
              <tr>
                <td className="font-semibold">Supplier Email:</td>
                <td>{supplierData.email}</td>
              </tr>
              <tr>
                <td className="font-semibold">Supplier Debt:</td>
                <td>{supplierData.debt}</td>
              </tr>
            </tbody>
          </table>
          <button
            className="btn bg-blue-500 mt-4"
            onClick={() => {
              document.getElementById('my_modal_5').showModal();

              // Modal açıldığında mevcut bilgileri editSupplierData'ya yükle
              setEditSupplierData({
                name: supplierData.name,
                email: supplierData.email,
                phone: supplierData.phone,
                address: supplierData.address,
              });
            }}
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
              value={editSupplierData.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Address"
              className="input input-bordered w-full mt-5"
              name="address"
              value={editSupplierData.address}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="input input-bordered w-full mt-5"
              name="phone"
              value={editSupplierData.phone}
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
              value={editSupplierData.email}
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
              <Link to="/supliers">
                <button className="btn btn-warning">Go to Supplier Table</button>
              </Link>
        </div>
    </div>
  );
}
