import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import classNames from 'classnames'
import { useProfile } from '../../contexts/ProfileContext';




export default function ProductTable() {

    const [productData , setProductData] = useState([]);
    const token = localStorage.getItem('token');

    const { products , setProducts } = useProfile();

    useEffect(() => {
        setProductData( prevData => [...prevData,products])
      }, [products])




    const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/',{
                    headers : {
                        Authorization : `Token ${token}`,
                        'X-CSRFToken' : Cookies.get('csrftoken')
                    }
                });
                if(Array.isArray(response.data)&& response.data.length > 0){
                    setProductData(response.data)
                    console.log('ürün eklendi' , response.data)
                }else{
                    setProductData([]);
                }
            } catch (error) {
                console.error('Error hatasi' , error)
            }
    }

    useEffect(() =>{
        if(token){
            fetchData();
        }
    },[token]);

    const deleteSupplier = async (productId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/products/${productId}/`, {
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
        <div className='flex flex-col items-center mt-5'>
            	<div className="w-[70rem] bg-white p-4 rounded-sm border border-gray-200">
                    <div className='flex justify-between items-center'>
                            <strong className="text-gray-700 font-medium">All Products</strong>
                            <strong className="text-gray-700 font-medium">Price</strong>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                        {productData.length > 0 ? (
                            productData.map((product, id) => (
                            <div key={id} className="flex justify-between items-start border border-gray-200 rounded p-3">
                                <Link to={`/product/${product.id}`} className="flex items-center hover:no-underline w-full">
                                <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
                                    <img
                                    className="w-full h-full object-cover rounded-sm"
                                    src={product.productImage}
                                    alt={product.productName}
                                    />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-800">{product.productName}</p>
                                    <span
                                    className={classNames(
                                        product.stock === 0 ? 'text-red-500' : product.stock > 50 ? 'text-green-500' : 'text-orange-500',
                                        'text-xs font-medium'
                                    )}
                                    >
                                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} in Stock`}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 pl-1.5">{product.price}</div>
                                </Link>
                                <div>
                                <button className="btn btn-sm bg-red-700 text-white hover:bg-red-900 ml-3" onClick={()=>document.getElementById(`${product.id}`).showModal()}>X</button>
                                            <dialog id={product.id} className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Do you really want to delete this Product?</h3>
                                                <div className="modal-action">
                                                <form method="dialog">
                                                    <div>
                                                        <button className='btn btn-sm bg-green-700 text-white hover:bg-green-900'
                                                                onClick={() => deleteSupplier(product.id)}>
                                                                        Yes
                                                        </button>
                                                        <button className="btn btn-sm mt-2 bg-red-700 text-white hover:bg-red-900">No</button>
                                                    </div>

                                                </form>
                                                </div>
                                            </div>
                                            </dialog>
                                </div>
                            </div>
                            
                            ))
                        ) : (
                            <p>No product data available</p>
                        )}
                        </div>
		            </div>
        </div>

	)
}
