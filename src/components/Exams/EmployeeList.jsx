import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { FaLessThan } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Examgetdata() {
    const [attendanceData, setAttendanceData] = useState([]);
    const userRole = localStorage.getItem("UserRole");
    const organizationId = localStorage.getItem("organizationId");
    const employeeId=localStorage.getItem('EmpId')
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (userRole === 'ROLE_HR') {
                    url = `hrmsapplication/employee/getHrReportees/${employeeId}`;
                } else if (userRole === 'ROLE_MANAGER') {

                    url = `hrmsapplication/employee/getEmployeesListByManagerId/${employeeId}`;
                } else {
                    throw new Error('Invalid UserRole');
                }
                const response = await axiosInstance.get(url);
                setAttendanceData(response.data);
            } 
            catch (error) {
                console.error("Error in fetching data", error);
          
                let errorMessage = "Error in fetching data. Please try again.";
                if (error.response?.data) {
                  if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                  } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                  }
                }
          
                toast.error(errorMessage); 
              }
        };
        fetchData();
    }, [userRole, employeeId, organizationId]);
    const handleViewClick = (employeeId) => {
        navigate(`/examdetails/${employeeId}`);
    };

    return (
        <>
            <div className="flex items-center bg-blue-950 justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
                <FaLessThan className="text-white mr-2" />
                <Link to={`/selfexam/${employeeId}`}>
                    <button><span className="font-semibold text-white">Previous Page</span></button>
                </Link>
            </div>
            <div className="container mx-auto p-4">
  <div className='mt-5'>
    <div className='border rounded-lg shadow-md p-4 bg-white'>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-300 text-lg ">
              <th className="border border-solid border-gray-400 p-1 text-center">Employee ID</th>
              <th className="border border-solid border-gray-400 p-1 text-center">Employee Name</th>
              <th className="border border-solid border-gray-400 p-1 text-center">Designation</th>
              <th className="border border-solid border-gray-400 p-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map(req => (
                <tr key={req.id} className="text-center hover:bg-gray-100 text-xs sm:text-sm">
                  <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.designation}</td>
                  <td className="border border-solid border-gray-400 p-1">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleViewClick(req.employeeId)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-xs sm:text-sm">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

        </>
    );
}

export default Examgetdata;
