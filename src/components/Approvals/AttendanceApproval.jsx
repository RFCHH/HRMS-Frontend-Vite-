import React, { useState, useEffect } from 'react';
import { FaLessThan, FaSearch, FaCheckSquare, FaWindowClose } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

function AttendanceApproval() {
  const [requests, setrequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [pendingPage, setPendingPage] = useState(0);
  const [allPage, setAllPage] = useState(0);
  const rowsPerPage = 3;
  const [showValidationError, setShowValidationError] = useState(false);
  const { employeeId } = useParams();
  const userRole = localStorage.getItem('UserRole'); // Retrieve user role from local storage
  const uniqueEmployeeIds = [...new Set(requests.map(req => req.employeeId))];
  const uniqueResponseEmployeeIds = [...new Set(responses.map(req => req.employeeId))];




  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/attendance/approvals?employeeId=${employeeId}&page=0&size=40`);
        const { approvals = [] } = response.data;
        setrequests(approvals);

      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();

  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/attendance/updated?employeeId=${employeeId}&page=0&size=40`);
        const { updatedResponses = [] } = response.data; // Adjust if your response structure is different
        setResponses(response.data); // Ensure you're using the correct variable from your response
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
    fetchResponses();

  }, []);

  // Filter and search states
  const [pendingFilters, setPendingFilters] = useState({ employeeId: '', employeeName: '', type: '' });
  const [allFilters, setAllFilters] = useState({ employeeId: '', employeeName: '', type: '' });
  const [pendingSearch, setPendingSearch] = useState('');
  const [allSearch, setAllSearch] = useState('');

  // Unique values for dropdowns
  const uniqueTypes = [...new Set(requests.map(req => req.type))];
  const uniqueNames = [...new Set(requests.map(req => req.employeeName))];

  const handleAction = (request, isApprove) => {
    setCurrentRequest(request);
    setShowPopup(true);
    setComment('');
    setIsApproved(isApprove);
    setShowValidationError(false);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setShowValidationError(true);
      return;
    }

    const updatedRequest = { ...currentRequest, comments: comment };

    try {
      let url;
      if (userRole === 'ROLE_MANAGER') { // Change this condition based on your role logic
        url = isApproved
          ? 'hrmsapplication/attendance/manager/approval'
          : 'hrmsapplication/attendance/manager/rejection';
      } else if (userRole === 'ROLE_HR') { // Example for another role
        url = isApproved
          ? 'hrmsapplication/attendance/hr/approval'
          : 'hrmsapplication/attendance/hr/rejection';
      } else {
        // Handle other roles or default case
        console.error('User role not recognized');
        return;
      }

      await axiosInstance.patch(url, updatedRequest);

      setrequests(prev => prev.filter(req => req.id !== currentRequest.id));

      setShowPopup(false);
      setComment('');
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };


  const filteredrequests = requests.filter(req => {
    const searchText = pendingSearch.toLowerCase();
    const idMatch = pendingFilters.id ? req.employeeId === pendingFilters.id : true;
    const nameMatch = pendingFilters.name ? req.employeeName.includes(pendingFilters.name) : true;
    const typeMatch = pendingFilters.type ? req.type.includes(pendingFilters.type) : true;

    const searchMatch =
      req.employeeId.includes(searchText) ||
      req.employeeName.toLowerCase().includes(searchText) ||
      req.type.toLowerCase().includes(searchText) ||
      req.inTime.toLowerCase().includes(searchText) ||
      req.outTime.toLowerCase().includes(searchText);

    return idMatch && nameMatch && typeMatch && (searchText ? searchMatch : true);
  }).slice(pendingPage * rowsPerPage, (pendingPage + 1) * rowsPerPage);


  const filteredresponses = responses.filter(req => {
    const searchText = allSearch.toLowerCase();
    const idMatch = allFilters.id ? req.employeeId === allFilters.id : true;
    const nameMatch = allFilters.name ? req.employeeName.includes(allFilters.name) : true;
    const typeMatch = allFilters.type ? req.type.includes(allFilters.type) : true;

    const searchMatch =
      req.employeeId.includes(searchText) ||
      req.employeeName.toLowerCase().includes(searchText) ||
      req.type.toLowerCase().includes(searchText) ||
      req.inTime.toLowerCase().includes(searchText) ||
      req.outTime.toLowerCase().includes(searchText) ||
      req.comments.toLowerCase().includes(searchText);

    return idMatch && nameMatch && typeMatch && (searchText ? searchMatch : true);
  }).slice(allPage * rowsPerPage, (allPage + 1) * rowsPerPage);

  const totalPendingPages = Math.ceil(requests.length / rowsPerPage);
  const totalAllPages = Math.ceil(responses.length / rowsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <NavLink className="flex items-center justify-start lg:px-4 lg:py-2 px-3 py-2 lg:text-lg text-xs border rounded-md bg-blue-950 hover:bg-gray-300 transition" to='/ApprovalMaster'>
          <FaLessThan className="text-white mr-2" />
          <span className="font-semibold text-white">Previous Page</span>
        </NavLink>
        <NavLink to={`/AttendanceStatus/${employeeId}`}
          className="flex items-center justify-startlg:px-4 lg:py-2 px-3 py-2 lg:text-lg text-xs border rounded-md bg-blue-950 hover:bg-gray-300 transition"
        >
          <span className="font-semibold text-white">My Status</span>
        </NavLink>
        <button className="flex items-center justify-center lg:px-4 lg:py-2 px-3 py-2 lg:text-lg text-xs border rounded-md bg-blue-950 hover:bg-gray-300 transition">
          <span className="font-semibold text-white">Export</span>
        </button>
      </div>

      <div className='mt-5'>
      <div className='border rounded-lg shadow-md p-4 bg-white'>
  <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
    <h1 className="font-bold text-lg sm:text-xl">Attendance Approvals/Pending</h1>
    <div className="relative w-full sm:w-40 mt-2 sm:mt-0">
      <FaSearch className="absolute right-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search all fields..."
        value={pendingSearch}
        onChange={(e) => setPendingSearch(e.target.value)}
        className="border border-gray-600 p-2 rounded-lg shadow w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
      />
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select onChange={(e) => setPendingFilters({ ...pendingFilters, id: e.target.value })} className="bg-gray-300 p-1 rounded">
              <option value="">Employee ID</option>
              {uniqueEmployeeIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select onChange={(e) => setPendingFilters({ ...pendingFilters, name: e.target.value })} className="bg-gray-300 p-1 rounded">
              <option value="">Employee Name</option>
              {uniqueNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select onChange={(e) => setPendingFilters({ ...pendingFilters, type: e.target.value })} className="bg-gray-300 p-1 rounded">
              <option value="">Attendance Type</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">In Time</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Out Time</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Attendance Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredrequests.map(req => (
          <tr key={req.id} className="text-center">
            <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
            <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
            <td className="border border-solid border-gray-400 p-1">{req.type}</td>
            <td className="border border-solid border-gray-400 p-1">{req.inTime}</td>
            <td className="border border-solid border-gray-400 p-1">{req.outTime}</td>
            <td className="border border-solid border-gray-400 p-1">{req.attendanceDate}</td>
            <td className="border border-solid border-gray-400 p-1 flex justify-center">
              <button onClick={() => handleAction(req, true)} className="p-1">
                <FaCheckSquare className="text-green-600" size={22} />
              </button>
              <button onClick={() => handleAction(req, false)} className="p-1">
                <FaWindowClose className="text-red-600" size={22} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => setPendingPage(prev => Math.max(prev - 1, 0))}
      className={`p-2 rounded-lg text-lg font-bold ${pendingPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={pendingPage === 0}
    >
      &lt;
    </button>
    <span className="font-semibold text-sm">
      Page {pendingPage + 1} of {totalPendingPages}
    </span>
    <button
      onClick={() => setPendingPage(prev => Math.min(prev + 1, totalPendingPages - 1))}
      className={`p-2 rounded-lg text-lg font-bold ${pendingPage === totalPendingPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={pendingPage === totalPendingPages - 1}
    >
      &gt;
    </button>
  </div>
</div>


        <hr className="my-6 border-red-900 mt-5" />

        {/* Approved/Rejected Requests Table */}
        <div className='border rounded-lg shadow-md p-4 bg-white'>
  <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
    <h1 className="font-bold text-lg sm:text-xl">Approved/Rejected Requests</h1>
    <div className="relative w-full sm:w-40 mt-2 sm:mt-0">
      <input
        type="text"
        placeholder="Search all fields..."
        value={allSearch}
        onChange={(e) => setAllSearch(e.target.value)}
        className="border border-gray-600 p-2 rounded-lg shadow w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
      />
      <FaSearch className="absolute right-3 top-3 text-gray-500" />
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select onChange={(e) => setAllFilters({ ...allFilters, id: e.target.value })} className="bg-gray-300 p-1 rounded">
              <option value="">Employee ID</option>
              {uniqueResponseEmployeeIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select onChange={(e) => setAllFilters({ ...allFilters, name: e.target.value })} className="bg-gray-300 p-1 rounded">
              <option value="">Employee Name</option>
              {[...new Set(responses.map(req => req.employeeName))].map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select onChange={(e) => setAllFilters({ ...allFilters, type: e.target.value })} className="bg-gray-300 p-1 rounded">
              <option value="">Attendance Type</option>
              {[...new Set(responses.map(req => req.type))].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">In Time</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Out Time</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Attendance Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Status</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>
        </tr>
      </thead>
      <tbody>
        {filteredresponses.map(req => (
          <tr key={req.id} className="text-center">
            <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
            <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
            <td className="border border-solid border-gray-400 p-1">{req.type}</td>
            <td className="border border-solid border-gray-400 p-1">{req.inTime}</td>
            <td className="border border-solid border-gray-400 p-1">{req.outTime}</td>
            <td className="border border-solid border-gray-400 p-1">{req.attendanceDate}</td>
            <td className="border border-solid border-gray-400 p-1">{req.status}</td>
            <td className="border border-solid border-gray-400 p-1">{req.comments}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => setAllPage(prev => Math.max(prev - 1, 0))}
      className={`p-2 rounded-lg text-lg font-bold ${allPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={allPage === 0}
    >
      &lt;
    </button>
    <span className="font-semibold text-sm">
      Page {allPage + 1} of {totalAllPages}
    </span>
    <button
      onClick={() => setAllPage(prev => Math.min(prev + 1, totalAllPages - 1))}
      className={`p-2 rounded-lg text-lg font-bold ${allPage === totalAllPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={allPage === totalAllPages - 1}
    >
      &gt;
    </button>
  </div>
</div>


        {/* Popup for Comments */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="font-bold mb-4">Add Comments for {currentRequest?.name}</h2>
              <textarea
                className="border border-gray-400 p-2 w-full rounded"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {showValidationError && <p className="text-red-600">Comments are mandatory.</p>}
              <div className="flex justify-end mt-4">
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Submit</button>
                <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default AttendanceApproval;
