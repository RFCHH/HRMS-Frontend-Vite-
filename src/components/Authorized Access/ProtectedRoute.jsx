// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const accessToken = localStorage.getItem('Token'); 

//   // If there is no access token, navigate to the login page
//   if (!accessToken) {
//     return <Navigate to="/" replace />;
//   }

//   // If access token exists, render the children components
//   return children; 
// };

// export default ProtectedRoute;

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = () => {
//   const accessToken = localStorage.getItem('Token');


//   if (!accessToken) {
//     return <Navigate to="/" replace />;
//   }


//   return <Outlet />;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const accessToken = localStorage.getItem("Token");
  const userRole = localStorage.getItem("UserRole"); 
  const location = useLocation();


  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
