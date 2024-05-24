import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useProfile } from '../../contexts/ProfileContext';

export default function SuplierTable() {
    const [supplierData, setSupplierData] = useState([]);
    const token = localStorage.getItem('token');
    
    const { suppliers, setSuppliers } = useProfile();

    console.log("table çalıştı =>=>=>=>=",suppliers);

  useEffect(() => {
    setSupplierData( prevData => [...prevData,suppliers])
  }, [suppliers])


  useEffect(() => {
    console.log("genel data bu şekılde =>=>= ",supplierData)
  },[supplierData])



    const fetchData = async () => {
        
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/suppliers/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });

            if (Array.isArray(response.data) && response.data.length > 0) {
                setSupplierData(response.data);
            } else {
                setSupplierData([]);
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

    


    const deleteSupplier = async (supplierId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/suppliers/${supplierId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            });
    
            // Müşteriyi başarıyla sildikten sonra tabloyu güncelle
            fetchData(); // Yeniden verileri çekerek tabloyu güncelle
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong className='text-gray-700 font-medium'>Supplier Table</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Supplier Name</td>
                            <td>Supplier Address</td>
                            <td>Supplier Phone</td>
                            <td>Supplier Photo</td>
                            <td>Supplier Email</td>
                            <td>Debt</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {supplierData.length > 0 ? (
                            supplierData.map((supplier , id) => (
                                <tr key={id}>
                                    <td>
                                        <Link to={`/supplier/${supplier.id}`}>#{supplier.id}</Link>
                                    </td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.address}</td>
                                    <td>{supplier.phone}</td>
                                    <td>
                                        <img src={supplier.photo} alt='' className='rounded-full w-10 h-10' />
                                    </td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.debt}</td>
                                    <td>
                                            <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900" onClick={()=>document.getElementById(`${supplier.id}`).showModal()}>X</button>
                                            <dialog id={supplier.id} className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Do you really want to delete this supplier?</h3>
                                                <div className="modal-action">
                                                <form method="dialog">
                                                    <div>
                                                        <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                onClick={() => deleteSupplier(supplier.id)}>
                                                                        Yes
                                                        </button>
                                                        <button className="btn btn-sm mt-2 bg-red-700 text-white hover:bg-red-900">No</button>
                                                    </div>

                                                </form>
                                                </div>
                                            </div>
                                            </dialog>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='7'>No supplier data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
