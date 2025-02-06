import React, { useState, useEffect } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import axiosInstance from "./axiosConfig";
import { useNavigate,NavLink } from "react-router-dom";
import { FaLessThan } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
       
        const employeeId = localStorage.getItem('EmpId');
        const UserRole = localStorage.getItem('UserRole');

       

        let url = '';
        if (UserRole === 'ROLE_HR') {
       
          url = `hrmsapplication/employee/getHrReportees/${employeeId}`;
        } else {
          
          url = `hrmsapplication/employee/getEmployeesListByManagerId/${employeeId}`;
        }

    
        const response = await axiosInstance.get(url, {
          params: {
            pageNumber,
            size: pageSize,
          },
        });


        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } 
      // catch (error) {
      //   console.error("Error fetching employees:", error);
      // }
      catch (error) {
        console.error("Error adding the job:", error);
  
        // Extract error details
        let errorMessage = "Failed to add the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
  
        toast.error(errorMessage); // Show extracted error in toast
      }
    };

    fetchEmployees();
  }, [pageNumber, pageSize]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = employees.filter(
      (employee) =>
        employee.employeeId.toLowerCase().includes(query) ||
        employee.employeeName.toLowerCase().includes(query) ||
        employee.designation.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
  };

  const handleViewClick = (employeeId) => {
    navigate(`/dashboard/${employeeId}`);
  };
  const handleBackNavigation = (event) => {
    event.preventDefault(); 
    navigate(-1); 
  };
  return (
    <div className="container mx-auto p-6">
       <NavLink
         to="#"
        onClick={handleBackNavigation}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>

      <div className="flex justify-center items-center mb-4 space-x-4">
        <div className="flex items-right border rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 px-3 focus:outline-none rounded-l-lg"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="bg-gray-200 text-gray-500 px-3 rounded-r-lg">
            <AiOutlineSearch />
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 border-b">Employee ID</th>
            <th className="py-2 px-4 border-b">Employee Name</th>
            <th className="py-2 px-4 border-b">Designation</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee.employeeId} className="hover:bg-gray-100 text-center">
                <td className="py-2 px-4 border-b">{employee.employeeId}</td>
                <td className="py-2 px-4 border-b">{employee.employeeName}</td>
                <td className="py-2 px-4 border-b">{employee.designation}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewClick(employee.employeeId)} 
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 border-b text-center">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-950 text-white px-4 py-2 rounded"
          onClick={() => setPageNumber((prev) => prev - 1)}
          disabled={pageNumber === 0}
        >
          Previous
        </button>
        <button
          className="bg-blue-950 text-white px-4 py-2 rounded"
          onClick={() => setPageNumber((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManagerEmployee;
