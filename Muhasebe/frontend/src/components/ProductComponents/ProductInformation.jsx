import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';



export default function ProductInformation() {

    const [productData , setProductData] = useState(null);
    const {id} = useParams();
    const [editProductData , setEditProductData] = useState({
        productName: '',
        stock: '',
        price: '',
      });
    
    const token = localStorage.getItem('token');

    const fetchProductData = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`,{
                headers : {
                    Authorization : `Token ${token}`,
                    'X-CSRFToken' : Cookies.get('csrftoken')
                }
            });
            if(response.data){
                console.log('prodct data' , response.data)
                setProductData(response.data)
            }else{
                console.log('Product datası bulunmadı')
            }
        } catch (error) {
            console.error('Error fetching customer data:' , error)
        }
    }

    useEffect(() =>{
        fetchProductData(id)
    },[id])

    const handleEditSubmit = async (e) =>{
        e.preventDefault();
    
        try {
          const response = await axios.patch(`http://127.0.0.1:8000/api/products/${productData.id}/`,editProductData,{
            headers : {
              Authorization : `Token ${token}`,
              'X-CSRFToken' : Cookies.get('csrftoken')
            }
          });
          console.log('Yenilenmiş data',response.data);
          setProductData(response.data)
          document.getElementById('my_modal_5').close();
        } catch (error) {
          console.error('Daha editlenirken hata oluştur' , error)
        }
      }

      const handleInputChange = (e) => {
        const { name , value} = e.target;
        setEditProductData({...editProductData , [name] : value});
      };

  return (
    <div>
           {productData && (
            <div className="mt-4">
            <h2 className="text-2xl font-bold mb-2">Product Information</h2>
            <table className="table-auto">
                <tbody>
                <tr>
                    <td className="font-semibold">Product Name:</td>
                    <td>{productData.productName}</td>
                </tr>
                <tr>
                    <td className="font-semibold">Product Stock:</td>
                    <td>{productData.stock}</td>
                </tr>
                <tr>
                    <td className="font-semibold">Product Price:</td>
                    <td>{productData.price}</td>
                </tr>
                </tbody>
            </table>
            <button
            className="btn bg-blue-500 mt-4"
            onClick={
                () => {
                document.getElementById('my_modal_5').showModal();
                setEditProductData({
                    productName : productData.productName,
                    stock : productData.stock,
                    price : productData.price,
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
                    name="productName"
                    value={editProductData.productName}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    className="input input-bordered w-full mt-5"
                    name="stock"
                    value={editProductData.stock}
                    onChange={handleInputChange}
                    min='0' // Sadece pozitif değerler için
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="input input-bordered w-full mt-5"
                    name="price"
                    value={editProductData.price}
                    onChange={handleInputChange}
                    min='0' // Sadece pozitif değerler için
                    required
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
              <Link to="/products">
                <button className="btn btn-warning">Go to Products Table</button>
              </Link>
        </div>
    </div>
  )
}
