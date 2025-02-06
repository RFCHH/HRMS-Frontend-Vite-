import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

function ProfileDetailsStatus() {
  const [responses, setResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5); // Adjust the number of rows per page as needed
  const { employeeId } = useParams();
  const userRole = localStorage.getItem('UserRole');

  // Fetch responses from API
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/profileApprovals/requests?employeeId=${employeeId}&page=0&size=40`);
        setResponses(response.data); // Adjust based on actual response structure
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
    fetchResponses();
  }, [employeeId]);

  // Reset page when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // Filter responses based on search term
  const filteredResponses = responses.filter(req => {
    const searchText = searchTerm.toLowerCase();
    return (
      req.employeeId?.toString().includes(searchText) ||
      req.employeeName?.toLowerCase().includes(searchText) ||
      req.fieldName?.toLowerCase().includes(searchText) ||
      req.oldValue?.toLowerCase().includes(searchText) ||
      req.newValue?.toLowerCase().includes(searchText) ||
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

  // Determine the link based on user role
  const previousPageLink = userRole === 'ROLE_EMPLOYEE' 
    ? '/ApprovalMaster' 
    : `/ProfileDetailsApproval/${employeeId}/${userRole}`;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <NavLink 
          to={previousPageLink} 
          className="flex items-center justify-start px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
          <span className="font-semibold text-orange-500">Previous Page</span>
        </NavLink>
        <button className="flex items-center justify-center px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition">
          <span className="font-semibold text-orange-500">Export</span>
        </button>
      </div>

      <div className='mt-5'>
        <div className='border rounded-lg shadow-md p-4 bg-white'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-xl">Profile Details Status</h1>
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

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-solid border-gray-400 p-1 text-center">Employee ID</th>
                <th className="border border-solid border-gray-400 p-1 text-center">Employee Name</th>
                <th className="border border-solid border-gray-400 p-1 text-center">Field Name</th>
                <th className="border border-solid border-black p-4 bg-gray-300">Old Value</th>
                <th className="border border-solid border-black p-4 bg-gray-300">New Value</th>
                <th className="border border-solid border-black p-4 bg-gray-300">Status</th>
                <th className="border border-solid border-black p-4 bg-gray-300">Comments</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResponses.map(req => (
                <tr key={req.id} className="text-center">
                  <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.fieldName}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.oldValue}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.newValue}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.status}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.comments}</td>
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
        </div>
      </div>
    </div>
  );
}

export default ProfileDetailsStatus;
