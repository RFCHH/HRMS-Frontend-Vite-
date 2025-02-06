import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa'; // Import trash icon for delete
import { NavLink, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

function AttendanceStatus() {
  const [responses, setResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const { employeeId } = useParams();
  const userRole = localStorage.getItem('UserRole');

  // Fetch responses from API
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/attendance/requests?employeeId=${employeeId}&page=${page}&size=40`);
        setResponses(response.data);
      } 
      // catch (error) {
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
  }, [employeeId, page]);

  // Filter responses based on search term
  const filteredResponses = responses.filter(req => {
    const searchText = searchTerm.toLowerCase();
    return (
      req.employeeId?.toString().includes(searchText) ||
      req.employeeName?.toLowerCase().includes(searchText) ||
      req.type?.toLowerCase().includes(searchText) ||
      req.inTime?.includes(searchText) ||
      req.outTime?.includes(searchText) ||
      req.attendanceDate?.includes(searchText) ||
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

  // Handle delete action
  const handleDelete = async (attendanceId) => {
    try {
      const response = await axiosInstance.delete(`hrmsapplication/attendance/cancel/${attendanceId}`);
      if (response.status === 200) {
        // Remove the deleted attendance record from the state
        setResponses(prevResponses => prevResponses.filter(req => req.id !== attendanceId));
        alert('Attendance record deleted successfully');
      }
    } 
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
          to={userRole === 'ROLE_EMPLOYEE' ? '/ApprovalMaster' : `/AttendanceApproval/${employeeId}/${userRole}`} 
          className="flex items-center justify-start lg:text-lg text-sm lg:px-4 lg:py-2 py-1 px-2 md:px-4 md:py-2 border rounded-md bg-blue-950 hover:bg-gray-300 transition"
        >
          <span className="font-semibold text-white">Previous Page</span>
        </NavLink>
        <button className="flex items-center justify-center lg:text-lg text-sm lg:px-4 lg:py-2 py-1 px-2 md:px-4 md:py-2 border rounded-md bg-blue-950 hover:bg-gray-300 transition">
          <span className="font-semibold text-white">Export</span>
        </button>
      </div>

      <div className="mt-5">
  <div className="border rounded-lg shadow-md p-3 sm:p-4 bg-white">
    <div className="flex flex-row sm:flex-row justify-between items-center mb-3 sm:mb-4">
      <h1 className="font-bold text-sm md:text-xl lg:text-xl">Attendance Status</h1>
      <div className="relative ml-auto">
        <FaSearch className="absolute right-2 top-2 text-gray-500 text-xs sm:text-sm" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-600 p-1 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-32 sm:w-40 text-xs sm:text-sm"
        />
      </div>
    </div>

    {paginatedResponses.length > 0 ? (
      <>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse lg:text-lg sm:text-sm">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-gray-400 p-1">Emp ID</th>
                <th className="border border-gray-400 p-1">Name</th>
                <th className="border border-gray-400 p-1">Type</th>
                <th className="border border-gray-400 p-1">In Time</th>
                <th className="border border-gray-400 p-1">Out Time</th>
                <th className="border border-gray-400 p-1">Date</th>
                <th className="border border-gray-400 p-1">Status</th>
                <th className="border border-gray-400 p-1">Comments</th>
                <th className="border border-gray-400 p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResponses.map((req) => (
                <tr key={req.id} className="text-center">
                  <td className="border border-gray-400 p-1">{req.employeeId}</td>
                  <td className="border border-gray-400 p-1">{req.employeeName}</td>
                  <td className="border border-gray-400 p-1">{req.type}</td>
                  <td className="border border-gray-400 p-1">{req.inTime}</td>
                  <td className="border border-gray-400 p-1">{req.outTime}</td>
                  <td className="border border-gray-400 p-1">{req.attendanceDate}</td>
                  <td className="border border-gray-400 p-1">{req.status}</td>
                  <td className="border border-gray-400 p-1">{req.comments}</td>
                  <td className="border border-gray-400 p-1">
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                      aria-label="Delete"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center mt-3 sm:mt-4">
          <span
            onClick={handlePreviousPage}
            className={`cursor-pointer ${
              page === 0 ? "text-gray-400" : "text-gray-600 hover:text-gray-700"
            } text-sm sm:text-lg font-bold mr-2`}
          >
            &lt;
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <span
            onClick={handleNextPage}
            className={`cursor-pointer ${
              page === totalPages - 1 ? "text-gray-400" : "text-gray-600 hover:text-gray-700"
            } text-sm sm:text-lg font-bold ml-2`}
          >
            &gt;
          </span>
        </div>
      </>
    ) : (
      <p className="text-center mt-3 sm:mt-4 text-xs sm:text-sm">No results found.</p>
    )}
  </div>
</div>

    </div>
  );
}

export default AttendanceStatus;
