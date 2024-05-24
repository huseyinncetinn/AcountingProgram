import React, { useState , useEffect} from 'react'
import { Link } from 'react-router-dom'
import { getOrderStatus } from '../../lib/helpers/index'
import axios from 'axios';
import classNames from 'classnames'
import Cookies from 'js-cookie';


export default function TransactionTable() {

	const [transactionData , setTransactionData] = useState([]);
	const token = localStorage.getItem('token');

    const fetchData = async () => {
		try {
			const response = await axios.get('http://127.0.0.1:8000/api/transactions/',{
				headers:{
					Authorization : `Token ${token}`,
					'X-CSRFToken' : Cookies.get('csrftoken')
				}
			});
			if(Array.isArray(response.data) && response.data.length >0){
				const lastTenTransactions = response.data.slice(-10).reverse();
				setTransactionData(lastTenTransactions)
			}else{
				setTransactionData([]);
			}
		} catch (error) {
			
		}
	}

	useEffect(() =>{
		if(token){
			fetchData();
		}
	},[token]);
	
  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
        <strong className='text-gray-700 font-medium'>Transaction Table</strong> <br />
		<small>(Only the last 10 transactions are listed)</small>
				<div className='mt-3'>
					<table className='w-full text-gray-700'>
						<thead>
							<tr>
								<td> ID </td>
								<td> Product Name</td>
								<td> Transaction Company</td>
								<td> Transaction Date</td>
								<td> Transaction Amount</td>
								<td> Transaction Status</td>
							</tr>
						</thead>
						<tbody>
								{transactionData.map( (transaction) => ( 
								<tr key={transaction.id}>
									<td>
										{transaction.transaction_type == 'income' ? (
											<Link to={`/incometransaction/${transaction.id}`}>#{transaction.id}</Link>
										):(
											<Link to={`/expensetransaction/${transaction.id}`}>#{transaction.id}</Link>
										) }
									</td>
									<td>{transaction.product}</td>
									<td>
										{transaction.transaction_type == 'income' ? (
											<span>{transaction.customer}</span>
										):(
											<span>{transaction.supplier}</span>
										)}
									</td>
									<td>{new Date(transaction.date).toLocaleDateString()}</td>
									<td>{transaction.amount}</td>
									<td>{transaction.transaction_type == 'income' ? (
										<span className='p-2 bg-green-700 text-white rounded-md'>{transaction.transaction_type}</span>
									):(
										<span className='p-2 bg-red-700 text-white rounded-md'>{transaction.transaction_type}</span>

									)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

				</div>

    </div>
  )
}
