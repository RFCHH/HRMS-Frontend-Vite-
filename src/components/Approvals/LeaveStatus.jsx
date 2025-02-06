import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa'; // Import the trash icon
import { NavLink } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

function LeaveStatus() {
  const [responses, setResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5); // Adjust this value as needed
  const employeeId = localStorage.getItem('EmpId');
  const userRole = localStorage.getItem('UserRole');

  // Fetch responses from API
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/leave/requests?employeeId=${employeeId}&page=${page}&size=40`);
        setResponses(response.data);
      }
      //  catch (error) {
      //   console.error("Error fetching responses:", error);
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
    fetchResponses();
  }, []);

  

  // Determine the link based on user role
  const previousPageLink = userRole === 'ROLE_EMPLOYEE' 
    ? '/ApprovalMaster' 
    : `/LeaveApproval/${employeeId}/${userRole}`;

  // Search and filter logic applied to all responses
  const filteredResponses = responses.filter(req => {
    const searchText = searchTerm.toLowerCase();
    return (
      req.employeeId?.toString().includes(searchText) ||
      req.employeeName?.toLowerCase().includes(searchText) ||
      req.leaveName?.toLowerCase().includes(searchText) ||
      req.startDate?.includes(searchText) ||
      req.endDate?.includes(searchText) ||
      req.appliedDate?.includes(searchText) ||
      req.status?.toLowerCase().includes(searchText) ||
      req.comments?.toLowerCase().includes(searchText)
    );
  });

  // Calculate total pages based on filtered responses
  const totalPages = Math.ceil(filteredResponses.length / rowsPerPage);
  const paginatedResponses = filteredResponses.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
    }
  };

  // Handle Delete functionality
  const handleDelete = async (leaveRequestId) => {
    try {
      const response = await axiosInstance.delete(`hrmsapplication/leave/cancel?leaveRequestId=${leaveRequestId}`);
      if (response.status === 200) {
        // Remove the deleted leave request from the responses array
        setResponses(prevResponses => prevResponses.filter(req => req.id !== leaveRequestId));
        alert('Leave request deleted successfully');
      }
    }
    //  catch (error) {
    //   console.error('Error deleting leave request:', error);
    //   alert('Failed to delete leave request');
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <NavLink 
          to={previousPageLink} 
          className="flex items-center justify-start px-4 py-2 border rounded-md bg-blue-950 hover:bg-gray-300 transition"
        >
          <span className="font-semibold text-white">Previous Page</span>
        </NavLink>
        <button className="flex items-center justify-center px-4 py-2 border rounded-md bg-blue-950 hover:bg-gray-300 transition">
          <span className="font-semibold text-white">Export</span>
        </button>
      </div>

      <div className='mt-5'>
        <div className='border rounded-lg shadow-md p-4 bg-white'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-xl">Leaves Status</h1>
            <div className="relative">
              <FaSearch className="absolute right-2 top-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-600 p-1 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-40"
              />
            </div>
          </div>

          {paginatedResponses.length > 0 ? (
            <>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-solid border-gray-400 p-1 text-center">Employee ID</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Employee Name</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Leave Type</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Start Date</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">End Date</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Applied Date</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Duration</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Status</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>
                    <th className="border border-solid border-gray-400 p-1 text-center">Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {paginatedResponses.map(req => (
                    <tr key={req.id} className="text-center">
                      <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.leaveName}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.startDate}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.endDate}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.appliedDate}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.duration}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.status}</td>
                      <td className="border border-solid border-gray-400 p-1">{req.comments}</td>
                      <td className="border border-solid border-gray-400 p-1">
                  
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-center mt-4">
                <span
                  onClick={handlePreviousPage}
                  className={`cursor-pointer ${page === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold mr-2`}
                >
                  &lt;
                </span>
                <span className="font-semibold text-sm">
                  Page {page + 1} of {totalPages}
                </span>
                <span
                  onClick={handleNextPage}
                  className={`cursor-pointer ${page === totalPages - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold ml-2`}
                >
                  &gt;
                </span>
              </div>
            </>
          ) : (
            <p className="text-center mt-4">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaveStatus;
