import React, { useState, useEffect } from 'react';
import { FaLessThan, FaSearch, FaCheckSquare, FaWindowClose } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

function ProfileDetailsApproval() {
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



  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/profileApprovals/approvals?employeeId=${employeeId}&page=0&size=40`);
        const { approvals = []} = response.data;
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
        const response = await axiosInstance.get(`hrmsapplication/profileApprovals/updated?employeeId=${employeeId}&page=0&size=40`);
        const { updatedResponses = [] } = response.data; // Adjust if your response structure is different
        setResponses(response.data); // Ensure you're using the correct variable from your response
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
    fetchResponses();
    
  }, []);
  
  // Filter and search states
  const [pendingFilters, setPendingFilters] = useState({ employeeId: '', employeeName: '', fieldName: '' });
  const [allFilters, setAllFilters] = useState({ employeeId: '', employeeName: '', fieldName: '' });
  const [pendingSearch, setPendingSearch] = useState('');
  const [allSearch, setAllSearch] = useState('');

  // Unique values for dropdowns
  const uniqueTypes = [...new Set(requests.map(req => req.fieldName))];
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
                ? 'hrmsapplication/profileApprovals/manager/approve'
                : 'hrmsapplication/profileApprovals/manager/reject';
        } else if (userRole === 'ROLE_HR') { // Example for another role
            url = isApproved
                ? 'hrmsapplication/profileApprovals/hr/approve'
                : 'hrmsapplication/profileApprovals/hr/reject';
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
  const idMatch = pendingFilters.employeeId ? req.employeeId === pendingFilters.employeeId : true;
  const nameMatch = pendingFilters.employeeName ? req.employeeName.includes(pendingFilters.employeeName) : true;
  const typeMatch = pendingFilters.fieldName ? req.fieldName === pendingFilters.fieldName : true; // Ensure field name is correct

  const searchMatch =
    req.employeeId.includes(searchText) ||
    req.employeeName.toLowerCase().includes(searchText) ||
    req.fieldName.toLowerCase().includes(searchText) ||
    req.oldValue.toLowerCase().includes(searchText) ||
    req.newValue.toLowerCase().includes(searchText);

  return idMatch && nameMatch && typeMatch && (searchText ? searchMatch : true);
}).slice(pendingPage * rowsPerPage, (pendingPage + 1) * rowsPerPage);




const filteredresponses = responses.filter(req => {
  const searchText = allSearch.toLowerCase();
  const idMatch = allFilters.employeeId ? req.employeeId === allFilters.employeeId : true;
  const nameMatch = allFilters.employeeName ? req.employeeName.includes(allFilters.employeeName) : true;
  const typeMatch = allFilters.fieldName ? req.fieldName === allFilters.fieldName : true;

  const searchMatch =
    req.employeeId.includes(searchText) ||
    req.employeeName.toLowerCase().includes(searchText) ||
    req.fieldName.toLowerCase().includes(searchText) ||
    req.oldValue.toLowerCase().includes(searchText) ||
    req.newValue.toLowerCase().includes(searchText) ||
    req.comments.toLowerCase().includes(searchText);

  return idMatch && nameMatch && typeMatch && (searchText ? searchMatch : true);
}).slice(allPage * rowsPerPage, (allPage + 1) * rowsPerPage);



const totalPendingPages = Math.ceil(filteredrequests.length / rowsPerPage);
const totalAllPages = Math.ceil(filteredresponses.length / rowsPerPage);


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <NavLink className="flex items-center justify-start px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition" to='/ApprovalMaster'>
          <FaLessThan className="text-orange-500 mr-2" />
          <span className="font-semibold text-orange-500">Previous Page</span>
        </NavLink>
        <NavLink to={`/ProfileDetailsStatus/${employeeId}`} 
  className="flex items-center justify-start px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
>
  <span className="font-semibold text-orange-500">My Status</span>
</NavLink>
        <button className="flex items-center justify-center px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition">
          <span className="font-semibold text-orange-500">Export</span>
        </button>
      </div>
  
      <div className='mt-5'>
        {/* Pending Requests Table */}
        <div className='border rounded-lg shadow-md p-4 bg-white'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-xl">Profile Details Approvals/Pending</h1>
            <div className="relative">
              <FaSearch className="absolute right-2 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search all fields..."
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
                className="border border-gray-600 p-1 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-40"
              />
            </div>
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-300">
              <th className="border border-solid border-gray-400 p-1 text-center">
  <select onChange={(e) => setPendingFilters({ ...pendingFilters, employeeId: e.target.value })} className="bg-gray-300 p-1 rounded">
    <option value="">Employee ID</option>
    {[...new Set(requests.map(req => req.employeeId))].map(empId => (
      <option key={empId} value={empId}>{empId}</option>
    ))}
  </select>
</th>

                <th className="border border-solid border-gray-400 p-1 text-center">
                <select onChange={(e) => setPendingFilters({ ...pendingFilters, employeeName: e.target.value })} className="bg-gray-300 p-1 rounded">
                    <option value="">Employee Name</option>
                    {uniqueNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-1 text-center">
                <select onChange={(e) => setPendingFilters({ ...pendingFilters, fieldName: e.target.value })} className="bg-gray-300 p-1 rounded">
                    <option value="">Field Name</option>
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-1 text-center">Old Value</th>
                <th className="border border-solid border-gray-400 p-1 text-center">New Value</th>
                <th className="border border-solid border-gray-400 p-1 text-center">Actions</th>
                <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredrequests.map(req => (
                <tr key={req.id} className="text-center">
                  <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.fieldName}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.oldValue}</td>
                  <td className="border border-solid border-gray-400 p-1">{req.newValue}</td>
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
          <span
  onClick={() => {
    if (pendingPage > 0) setPendingPage(pendingPage - 1);
  }}
  className={`cursor-pointer ${pendingPage === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold mr-2`}
>
  &lt;
</span>
<span
  onClick={() => {
    if (pendingPage < totalPendingPages - 1) setPendingPage(pendingPage + 1);
  }}
  className={`cursor-pointer ${pendingPage === totalPendingPages - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold ml-2`}
>
  &gt;
</span>

        </div>
  
        <hr className="my-6 border-red-900 mt-5" />
  
        {/* Approved/Rejected Requests Table */}
        <div className='border rounded-lg shadow-md p-4 bg-white'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-xl">Approved/Rejected Requests</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search all fields..."
                value={allSearch}
                onChange={(e) => setAllSearch(e.target.value)}
                className="border border-gray-600 p-1 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-40"
              />
              <FaSearch className="absolute right-2 top-2 text-gray-500" />
            </div>
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-300">
              <th className="border border-solid border-gray-400 p-1 text-center">
  <select onChange={(e) => setAllFilters({ ...allFilters, id: e.target.value })} className="bg-gray-300 p-1 rounded">
    <option value="">Employee ID</option>
    {[...new Set(responses.map(req => req.employeeId))].map(empId => (
      <option key={empId} value={empId}>{empId}</option>
    ))}
  </select>
</th>

                <th className="border border-solid border-gray-400 p-1 text-center">
                <select onChange={(e) => setAllFilters({ ...allFilters, employeeName: e.target.value })} className="bg-gray-300 p-1 rounded">
                    <option value="">Employee Name</option>
                    {[...new Set(responses.map(req => req.employeeName))].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-1 text-center">
                <select onChange={(e) => setAllFilters({ ...allFilters, fieldName: e.target.value })} className="bg-gray-300 p-1 rounded">
                    <option value="">Field Name</option>
                    {[...new Set(responses.map(req => req.fieldName))].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-1 text-center">Old Value</th>
                <th className="border border-solid border-gray-400 p-1 text-center">New Value</th>
                <th className="border border-solid border-gray-400 p-1 text-center">Status</th>
                <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredresponses.map(req => (
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
          <span
  onClick={() => {
    if (allPage > 0) setAllPage(allPage - 1);
  }}
  className={`cursor-pointer ${allPage === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold mr-2`}
>
  &lt;
</span>
<span
  onClick={() => {
    if (allPage < totalAllPages - 1) setAllPage(allPage + 1);
  }}
  className={`cursor-pointer ${allPage === totalAllPages - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold ml-2`}
>
  &gt;
</span>

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

export default ProfileDetailsApproval;
