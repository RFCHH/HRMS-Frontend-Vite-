// src/components/Associate360.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams, NavLink } from "react-router-dom";
import { FaLessThan } from "react-icons/fa";
const Associate360 = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  const employeeId = localStorage.getItem("EmpId");

  return (
    <div> 
    <div className="min-h-screen bg-gray-100 p-1 flex flex-col items-center relative">
    {/* Previous Page Button */}
    <NavLink
      to="/userdashboard"
      className="absolute top-5 left-5 flex items-center px-2 py-2 bg-blue-950 border-2 border-gray-800 rounded-md w-40 mb-10"
    >
      <FaLessThan className="text-white mr-2" />
      <span className="text font-semibold text-white">Previous Page</span>
    </NavLink>
     
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-28">
        Associate 360 Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="MyPay"
          bgColor="bg-blue-500"
          onClick={() => handleNavigation(`/payrolluser/${employeeId}`)}
        />
        <Card
          title="Leave Balance"
          bgColor="bg-green-500"
          onClick={() => handleNavigation("/LeaveBalance")}
        />
        <Card
          title="Organization Chart"
          bgColor="bg-indigo-500"
          onClick={() => handleNavigation(`/Organization/${employeeId}`)}
        />
        <Card
          title="Employee Performance"
          bgColor="bg-purple-500"
          onClick={() => handleNavigation(`/Deliverables/${employeeId}`)}
        />
        <Card
          title="Employee Profile"
          bgColor="bg-yellow-500"
          onClick={() => handleNavigation(`/personalDetails/${employeeId}`)}
        />
      </div>
    </div>
    </div>);
};

const Card = ({ title, bgColor, onClick }) => {
  return (
    <>
      <div
        className={`p-6 rounded-lg shadow-lg ${bgColor} text-white hover:shadow-2xl cursor-pointer transform transition-transform hover:scale-105`}
        onClick={onClick}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </>
  );
};

export default Associate360;
