import React, { useState, useEffect } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import axiosInstance from "./axiosConfig";
import { useNavigate,NavLink,Link } from "react-router-dom";
import EditPersonalDetails from "./createEmply";
import { FaLessThan } from 'react-icons/fa';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]); 
  const [filteredEmployees, setFilteredEmployees] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [pageNumber, setPageNumber] = useState(0); 
  const [pageSize, setPageSize] = useState(10); 
  const [showPopup,   setShowPopup] = useState(false); 
  const [showEditForm, setShowEditForm] = useState(false); 
  const [userRole, setUserRole] = useState(""); 
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(""); 
  const [employeeIdError, setEmployeeIdError] = useState("");
const [userRoleError, setUserRoleError] = useState("");

  const navigate = useNavigate();
  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/hrmsapplication/employee/getAll", {
        params: {
          pageNumber: 0,  
          size: 100000000, 
        },
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data); 
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(); 
  }, []);
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = employees.filter(
      (employee) =>
        employee.employeeId.toString().toLowerCase().includes(query.toLowerCase()) ||
        employee.firstname.toLowerCase().includes(query.toLowerCase()) ||
        employee.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredEmployees(filtered); 
    setPageNumber(0);
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleCreateEmployeeClick = () => {
    setShowEditForm(true);
  };

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleViewClick = (employeeId) => {
    navigate(`/dashboard/${employeeId}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const handleSave = (formValues) => {
    console.log("Saved data:", formValues);
    setShowEditForm(false);
    fetchEmployees(); 
  };

  const handleConfirmRoleUpdate = async () => {
    setEmployeeIdError("");
  setUserRoleError("");

  if (!selectedEmployeeId) {
    setEmployeeIdError("Employee ID is required.");
    return;
  }
  if (!userRole) {
    setUserRoleError("Please select a role.");
    return;
  }

    const requestBody = {
      employeeId: selectedEmployeeId,
      userRole,
    };

    try {
      const response = await axiosInstance.patch(
        `hrmsapplication/authentication/updateAuthenticationRole`,
        requestBody
      );
      console.log("Role updated successfully:", response.data);
      setShowPopup(false);
      fetchEmployees(); 
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const sortEmployees = (employeesList) => {
    return employeesList.sort((a, b) => {
      const aId = parseInt(a.employeeId.replace(/\D/g, '')); 
      const bId = parseInt(b.employeeId.replace(/\D/g, ''));
      return aId - bId;
    });
  };

  const sortedEmployees = sortEmployees([...filteredEmployees]);

  const startIndex = pageNumber * pageSize;
  const endIndex = startIndex + pageSize;
  const currentEmployees = sortedEmployees.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-4 sm:p-6">
    <NavLink
      to="/admindashboard"
      className="flex items-center justify-start px-2 py-2 border-2 border-gray-800 bg-blue-950 rounded-md w-fit sm:w-40 ml-2 sm:ml-5 mb-3 sm:mb-5 mt-3 sm:mt-5"
    >
      <FaLessThan className="text-white mr-1 sm:mr-2 text-sm sm:text-base" />
      <button>
        <span className="text-md sm:text-base font-semibold text-white">Previous Page</span>
      </button>
    </NavLink>
  
    {/* Navigation */}
    <nav className="flex items-center mb-4 p-2 border rounded-lg shadow-md w-full sm:w-30">
      <div className="flex items-center space-x-1">
        <AiOutlineHome className="text-base sm:text-xl" />
        <Link to="/admindashboard">
          <span className="text-sm sm:text-lg font-bold">Home</span>
        </Link>
      </div>
    </nav>
  
    {/* Search and Buttons */}
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-4 space-y-3 sm:space-y-0 sm:space-x-4">
      {/* Search Bar */}
      <div className="flex items-center border rounded-lg w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search..."
          className="py-1 px-2 sm:py-2 sm:px-3 focus:outline-none rounded-l-lg text-xs sm:text-base w-full sm:w-auto"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="bg-gray-200 text-gray-500 px-2 lg:py-3 py-2 md:py-3 sm:px-3 rounded-r-lg">
          <AiOutlineSearch />
        </button>
      </div>
  
      {/* Buttons */}
      <div className="flex space-x-2">
        <button
          className="text-white bg-blue-950 font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-base"
          onClick={handleCreateEmployeeClick}
        >
          Create Employee
        </button>
        <button
          className="text-white bg-blue-950 font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-base"
          onClick={handleButtonClick}
        >
          Role Based
        </button>
      </div>
    </div>
  
    {/* Employee Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 text-xs sm:text-base">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-2 sm:py-3 sm:px-4 border-b">Employee ID</th>
            <th className="py-2 px-2 sm:py-2 sm:px-4 border-b">Employee Name</th>
            <th className="py-2 px-2 sm:py-2 sm:px-4 border-b">Email ID</th>
            <th className="py-2 px-2 sm:py-2 sm:px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? (
            currentEmployees.map((employee) => (
              <tr key={employee.employeeId} className="hover:bg-gray-100 text-center">
                <td className="py-1 px-2 sm:py-2 sm:px-4 border-b">{employee.employeeId}</td>
                <td className="py-1 px-2 sm:py-2 sm:px-4 border-b">{employee.firstname}</td>
                <td className="py-1 px-2 sm:py-2 sm:px-4 border-b">{employee.email}</td>
                <td className="py-1 px-2 sm:py-2 sm:px-4 border-b">
                  <button
                    className="text-blue-500 hover:underline text-xs sm:text-base"
                    onClick={() => handleViewClick(employee.employeeId)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-xs sm:text-base">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  
    {/* Pagination */}
    <div className="flex justify-between mt-4">
      <button
        className="text-white bg-blue-950 px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
        onClick={() => handlePageChange(pageNumber - 1)}
        disabled={pageNumber === 0}
      >
        Previous
      </button>
      <button
        className="text-white bg-blue-950 px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
        onClick={() => handlePageChange(pageNumber + 1)}
        disabled={endIndex >= filteredEmployees.length}
      >
        Next
      </button>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Assign Role</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Employee ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded"
                placeholder="Enter Employee ID"
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              />
              {employeeIdError && (
          <p className="text-red-500 text-sm mt-1">{employeeIdError}</p>
        )}
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Role
              </label>
              <div>
                <label className="inline-flex items-center mr-2">
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_MANAGER"
                    className="form-radio"
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  <span className="ml-2">Manager</span>
                </label>
                <label className="inline-flex items-center mr-2">
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_HR"
                    className="form-radio"
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  <span className="ml-2">HR</span>
                </label>
                <label className="inline-flex items-center mr-2">
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_EMPLOYEE"
                    className="form-radio"
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  <span className="ml-2">Employee</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_ADMIN"
                    className="form-radio"
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  <span className="ml-2">Admin</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_ROOT"
                    className="form-radio"
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  <span className="ml-2">Root</span>
                </label>
              </div>
              {userRoleError && (
          <p className="text-red-500 text-sm mt-1">{userRoleError}</p>
        )}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleClosePopup}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmRoleUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <EditPersonalDetails onCancel={handleCancel} onSave={handleSave} />
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default EmployeeTable;
