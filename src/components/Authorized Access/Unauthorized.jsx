import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div  className="text-center text-2xl mt-60">
      <h1>Unauthorized Access</h1>
      <p className="mb-5">You do not have permission to view this page.</p>
      <Link to="/" className="border-solid bg-green-500 rounded-lg  ">Go to Login</Link>
    </div>
  );
};

export default Unauthorized;
