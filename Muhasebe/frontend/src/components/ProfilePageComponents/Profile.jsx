import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import Information from './Information';

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex justify-around items-center w-full max-w-screen-md mb-8">
        <ProfilePicture />
        <Information />
      </div>

      <Link to="/dashboard">
        <button className="btn btn-warning">Go to Dashboard</button>
      </Link>
    </div>
  );
}
