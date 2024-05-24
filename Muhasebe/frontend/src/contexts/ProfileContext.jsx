import React, { createContext, useContext, useState } from 'react';


const ProfileContext = createContext();



export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(() => {
    return localStorage.getItem('profilePhotoUrl') || null;
  });

  const [suppliers , setSuppliers] = useState([]);
  const [products , setProducts] = useState([]);


  const updateProfilePhotoUrl = (url) => {
    setProfilePhotoUrl(url);
    localStorage.setItem('profilePhotoUrl', url); // localStorage'a kaydet
  };

  return (
    <ProfileContext.Provider value={{ profilePhotoUrl, updateProfilePhotoUrl, suppliers ,setSuppliers , products , setProducts}}>
      {children}
    </ProfileContext.Provider>
  );
};