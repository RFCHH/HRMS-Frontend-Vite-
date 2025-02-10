import React, { useState, useEffect } from "react";
import { AiTwotoneHome, AiOutlineDownload } from "react-icons/ai";
import { FaLessThan } from "react-icons/fa";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const employeeId = localStorage.getItem('EmpId');
  const userRole = localStorage.getItem('UserRole');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const url = userRole === "ROLE_HR"
          ? `hrmsapplication/employee/getHrReportees/${employeeId}`
          : `hrmsapplication/employee/getEmployeesListByManagerId/${employeeId}`;

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
      //   toast.error("No reportees found");
      // }
      catch (error) {
        console.error("Error adding the job:", error);

        let errorMessage = "Failed to add the job. Please try again.";
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
    fetchEmployees();
  }, [employeeId, userRole, pageNumber, pageSize]);

  const handleViewClick = (employeeId) => {
    navigate(`/Deliverables/${employeeId}`, { state: { fromReportees: true } });
  };

  return (
    <div className="container mx-auto p-6">

      <NavLink
        to={`/Deliverables/${employeeId}`}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5"
      >
        <FaLessThan className="text-orange-500 mr-2" />
        <button>
          <span className="font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>

      <div className="w-full lg:w-10/12 xl:w-9/12 mx-auto mt-2 bg-white rounded-md border border-black/90 shadow-md p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AiTwotoneHome size={20} className="mr-2" />
          </div>
          <div className="flex gap-3 items-center">
            <button className="flex items-center px-5 py-2 bg-blue-950 text-white rounded-lg hover:bg-orange-500 transition duration-300">
              <AiOutlineDownload className="mr-2 text-orange-500" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-200">
    <thead>
      <tr className="bg-gray-200 text-xs sm:text-sm">
        <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Employee ID</th>
        <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Employee Name</th>
        <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Designation</th>
        <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredEmployees.length > 0 ? (
        filteredEmployees.map((employee) => (
          <tr key={employee.employeeId} className="hover:bg-gray-100 text-center text-xs sm:text-sm">
            <td className="py-2 px-2 sm:px-4 border-b">{employee.employeeId}</td>
            <td className="py-2 px-2 sm:px-4 border-b">{employee.employeeName}</td>
            <td className="py-2 px-2 sm:px-4 border-b">{employee.designation}</td>
            <td className="py-2 px-2 sm:px-4 border-b">
              <button
                className="text-blue-500 hover:underline text-xs sm:text-sm"
                onClick={() => handleViewClick(employee.employeeId)}
              >
                View
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="py-2 px-4 border-b text-center text-xs sm:text-sm">
            No employees found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-950 text-white px-4 py-2 rounded"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))} // Ensure page number doesn't go below 0
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

export default EmployeeTable;
