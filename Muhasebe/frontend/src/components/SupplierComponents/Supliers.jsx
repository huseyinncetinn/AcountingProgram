import React from 'react';
import { Link } from 'react-router-dom';
import SuplierTable from './SuplierTable';
import SupplierForm from './SupplierForm';
import SupplierTableandForm from './SupplierTableandForm'


export default function Supliers() {
  return (

      <div>

        {/* <div>
          <SupplierTableandForm></SupplierTableandForm>
        </div> */}
        <div>
          <SuplierTable />
        </div>
        <div>
          <SupplierForm />
        </div>


        <div className='flex flex-col items-center mt-5'>
              <Link to="/dashboard">
                <button className="btn btn-warning">Go to Dashboard</button>
              </Link>
        </div>
      </div>

  );
}
