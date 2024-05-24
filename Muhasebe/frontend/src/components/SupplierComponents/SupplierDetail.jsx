import React from 'react';
import SupplierPhoto from './SupplierPhoto';
import SupplierInformation from './SupplierInformation';

export default function SupplierDetail() {


    return (
        <div className='flex flex-col items-center justify-center h-full'>
      <h2 className='text-4xl mt-5 mb-5 italic font-bold'>Supplier Detail Page</h2>

            <div className="flex justify-around items-center w-full max-w-screen-md mb-8">
                <SupplierPhoto />
                <SupplierInformation></SupplierInformation>
            </div>
        </div>

    );
}