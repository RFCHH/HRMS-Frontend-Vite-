import React, { useState, useEffect } from 'react';
import { FaLessThan, FaSearch, FaCheckSquare, FaWindowClose } from 'react-icons/fa';
import { NavLink, useParams, } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

function LeaveApproval() {
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [pendingPage, setPendingPage] = useState(0);
  const [allPage, setAllPage] = useState(0);
  const rowsPerPage = 3;
  const [showValidationError, setShowValidationError] = useState(false);
  const employeeId = localStorage.getItem('EmpId'); 
  const userRole = localStorage.getItem('UserRole');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/leave/approvals?employeeId=${employeeId}&page=0&size=40`);
        console.log(response.data);
        const {  approvals=[] } = response.data;
        setRequests(approvals);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/leave/updated?employeeId=${employeeId}&page=0&size=40`);
        const { updatedResponses = [] } = response.data; // Adjust if your response structure is different
        setResponses(response.data); // Ensure you're using the correct variable from your response
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
    fetchResponses();
  }, []);

  const [pendingFilters, setPendingFilters] = useState({ employeeId: '', employeeName: '', leaveName: '' });
  const [allFilters, setAllFilters] = useState({ employeeId: '', employeeName: '', leaveName: '' });
  const [pendingSearch, setPendingSearch] = useState('');
  const [allSearch, setAllSearch] = useState('');

  const uniqueTypes = [...new Set(requests.map(req => req.leaveName))];
  const uniqueNames = [...new Set(requests.map(req => req.employeeName))];
  const uniqueEmployeeIds = [...new Set(requests.map(req => req.employeeId))];


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
        if (userRole === 'ROLE_MANAGER') { 
            url = isApproved
                ? 'hrmsapplication/leave/manager/approve'
                : 'hrmsapplication/leave/manager/reject';
        } else if (userRole === 'ROLE_HR') { 
            url = isApproved
                ? 'hrmsapplication/leave/hr/approve'
                : 'hrmsapplication/leave/hr/reject';
        } else {
            console.error('User role not recognized');
            return;
        }

        await axiosInstance.patch(url, updatedRequest);

        setRequests(prev => prev.filter(req => req.id !== currentRequest.id));
        
        setShowPopup(false);
        setComment('');
    } catch (error) {
        console.error("Error updating request:", error);
    }
};


const filteredRequests = requests.filter(req => {
  const searchText = pendingSearch.toLowerCase();
  const idMatch = pendingFilters.employeeId ? req.employeeId === pendingFilters.employeeId : true;
  const nameMatch = pendingFilters.employeeName ? req.employeeName.includes(pendingFilters.employeeName) : true;
  const typeMatch = pendingFilters.leaveName ? req.leaveName === pendingFilters.leaveName : true;

  const searchMatch =
    req.employeeId.includes(searchText) ||
    req.employeeName.toLowerCase().includes(searchText) ||
    req.leaveName.toLowerCase().includes(searchText) ||
    req.startDate.includes(searchText) ||
    req.endDate.includes(searchText);

  return idMatch && nameMatch && typeMatch && (searchText ? searchMatch : true);
}).slice(pendingPage * rowsPerPage, (pendingPage + 1) * rowsPerPage);


const filteredResponses = responses.filter(req => {
  const searchText = allSearch.toLowerCase();
  const idMatch = allFilters.id ? req.employeeId === allFilters.id : true;
  const nameMatch = allFilters.name ? req.employeeName.includes(allFilters.name) : true;
  const typeMatch = allFilters.type ? req.leaveName === allFilters.type : true;

  const searchMatch =
    req.employeeId.includes(searchText) ||
    req.employeeName.toLowerCase().includes(searchText) ||
    req.leaveName.toLowerCase().includes(searchText) ||
    req.startDate.includes(searchText) ||
    req.endDate.includes(searchText) ||
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
        <NavLink to={`/LeaveStatus/${employeeId}`} 
  className="flex items-center justify-start lg:px-4 lg:py-2  px-3 py-2 lg:text-lg text-xs border rounded-md bg-blue-950 hover:bg-gray-300 transition"
>
  <span className="font-semibold text-white">My Status</span>
</NavLink>

        <button className="flex items-center justify-center lg:px-4 lg:py-2  px-3 py-2 lg:text-lg text-xs border rounded-md bg-blue-950 hover:bg-gray-300 transition" to='/App'>
          <span className="font-semibold text-white">Export</span>
        </button>
      </div>
  
      <div className='mt-5'>
      <div className='border rounded-lg shadow-md p-4 bg-white'>
  <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
    <h1 className="font-bold text-xl">Leaves Approvals/Pending</h1>
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
            <select
              onChange={(e) => setPendingFilters({ ...pendingFilters, employeeId: e.target.value })}
              className="bg-gray-300 p-1 rounded"
            >
              <option value="">Employee ID</option>
              {uniqueEmployeeIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select
              onChange={(e) => setPendingFilters({ ...pendingFilters, name: e.target.value })}
              className="bg-gray-300 p-1 rounded"
            >
              <option value="">Employee Name</option>
              {uniqueNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">
            <select
              onChange={(e) => setPendingFilters({ ...pendingFilters, type: e.target.value })}
              className="bg-gray-300 p-1 rounded"
            >
              <option value="">Leave Type</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">From Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">To Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Applied Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Actions</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>
        </tr>
      </thead>
      <tbody>
        {filteredRequests.map(req => (
          <tr key={req.id} className="text-center">
            <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
            <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
            <td className="border border-solid border-gray-400 p-1">{req.leaveName}</td>
            <td className="border border-solid border-gray-400 p-1">{req.startDate}</td>
            <td className="border border-solid border-gray-400 p-1">{req.endDate}</td>
            <td className="border border-solid border-gray-400 p-1">{req.appliedDate}</td>
            <td className="border border-solid border-gray-400 p-1">
              <button onClick={() => handleAction(req, true)} className="p-1">
                <FaCheckSquare className="text-green-600" size={22} />
              </button>
              <button onClick={() => handleAction(req, false)} className="p-1">
                <FaWindowClose className="text-red-600" size={22} />
              </button>
            </td>
            <td className="border border-solid border-gray-400 p-1">{req.comments}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination - Left & Right Buttons in Mobile */}
  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => {
        if (allPage > 0) setAllPage(allPage - 1);
      }}
      className={`p-2 rounded-lg text-lg font-bold ${allPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={allPage === 0}
    >
      &lt;
    </button>
    <span className="font-semibold text-sm">
      Page {allPage + 1} of {totalAllPages}
    </span>
    <button
      onClick={() => {
        if (allPage < totalAllPages - 1) setAllPage(allPage + 1);
      }}
      className={`p-2 rounded-lg text-lg font-bold ${allPage === totalAllPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={allPage === totalAllPages - 1}
    >
      &gt;
    </button>
  </div>
</div>

  
        <hr className="my-6 border-red-900 mt-5" />
  
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
              {[...new Set(responses.map(req => req.employeeId))].map(id => (
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
              <option value="">Leave Type</option>
              {[...new Set(responses.map(req => req.leaveName))].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </th>
          <th className="border border-solid border-gray-400 p-1 text-center">From Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">To Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Applied Date</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Status</th>
          <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>
        </tr>
      </thead>
      <tbody>
        {filteredResponses.map(req => (
          <tr key={req.id} className="text-center">
            <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
            <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
            <td className="border border-solid border-gray-400 p-1">{req.leaveName}</td>
            <td className="border border-solid border-gray-400 p-1">{req.startDate}</td>
            <td className="border border-solid border-gray-400 p-1">{req.endDate}</td>
            <td className="border border-solid border-gray-400 p-1">{req.appliedDate}</td>
            <td className="border border-solid border-gray-400 p-1">{req.status}</td>
            <td className="border border-solid border-gray-400 p-1">{req.comments}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => {
        if (allPage > 0) setAllPage(allPage - 1);
      }}
      className={`p-2 rounded-lg text-lg font-bold ${allPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={allPage === 0}
    >
      &lt;
    </button>
    <span className="font-semibold text-sm">
      Page {allPage + 1} of {totalAllPages}
    </span>
    <button
      onClick={() => {
        if (allPage < totalAllPages - 1) setAllPage(allPage + 1);
      }}
      className={`p-2 rounded-lg text-lg font-bold ${allPage === totalAllPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
      disabled={allPage === totalAllPages - 1}
    >
      &gt;
    </button>
  </div>
</div>


        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="font-bold mb-4">Add Comments for {currentRequest?.employeeName}</h2>
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

export default LeaveApproval;
