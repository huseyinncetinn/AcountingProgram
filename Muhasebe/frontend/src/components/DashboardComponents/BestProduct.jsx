import axios from 'axios';
import classNames from 'classnames'
import React, { useState , useEffect} from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';



function PopularProducts() {
	const [productData , setProductData] = useState([]);
	const token = localStorage.getItem('token')

	const fetchData = async () =>{
		try {
			const response = await axios.get('http://127.0.0.1:8000/api/products/',{
				headers : {
					Authorization : `Token ${token}`,
					'X-CSFRToken' : Cookies.get('csrftoken')
				}
			});
			if(Array.isArray(response.data) && response.data.length > 0){
				setProductData(response.data);
			}else{
				setProductData([]);
			}
		} catch (error) {
			console.error('api hatası', error)
		}
	};

	useEffect(() =>{
        if(token){
            fetchData();
        }
    },[token]);


	return (
		<div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
			<strong className="text-gray-700 font-medium">Popular Products</strong> <br />
            <span className='text-xs'>(Only 4000 and above are listed.)</span>
			<div className="mt-4 flex flex-col gap-3">
			{productData
                    .filter(product => product.stock > 4000)
                    .map(product => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="flex items-start hover:no-underline"
                        >
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
                                        product.stock === 0
                                            ? 'text-red-500'
                                            : product.stock > 50
                                            ? 'text-green-500'
                                            : 'text-orange-500',
                                        'text-xs font-medium'
                                    )}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : product.stock + ' in Stock'}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 pl-1.5">{product.product_price}</div>
                        </Link>
                    ))}
			</div>
		</div>
	)
}

export default PopularProducts