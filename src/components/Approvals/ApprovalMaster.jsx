// import React from 'react';
import { NavLink } from 'react-router-dom';
import React, { useState} from 'react';
import { FaLessThan } from 'react-icons/fa';



function ApprovalMaster() {
  const employeeId = localStorage.getItem('EmpId'); // Retrieve employee ID from local storage
  // const [employeeId, setEmployeeId] = useState(localStorage.getItem('UserId'));
  const userRole = localStorage.getItem('UserRole'); // Retrieve user role from local storage

  return (
    <div style={{ height: 'calc(100vh - 4rem)' }}>
    <div>
        <NavLink className="flex items-center justify-start px-2 py-2 overflow-x-auto bg-blue-950 border border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5" to='/userdashboard'>
          <FaLessThan className="text-white mr-2" />
          <button><span className="text font-semibold text-white">Previous Page</span></button>
        </NavLink>
      </div>
    <div  className="flex items-center justify-center">
      <div className="flex flex-col">
        {userRole === 'ROLE_HR' || userRole === 'ROLE_MANAGER' ? (
          <>
            <NavLink to={`/LeaveApproval/${employeeId}/${userRole}`} 
              className="block w-48 text-center border border-black px-4 py-2 my-1 rounded-lg hover:bg-blue-200"
            >
              <span className="font-semibold text-blue-500">Leave Approval</span>
            </NavLink>
            <NavLink to={`/AttendanceApproval/${employeeId}/${userRole}`} 
              className="block w-48 text-center border border-black px-4 py-2 my-1 rounded-lg hover:bg-blue-200"
            >
              <span className="font-semibold text-blue-500">Attendance Approval</span>
            </NavLink>
            {/* <NavLink to={`/ProfileDetailsApproval/${employeeId}/${userRole}`} 
              className="block w-48 text-center border border-black px-4 py-2 my-1 rounded-lg hover:bg-blue-200"
            >
              <span className="font-semibold text-blue-500">Profile Details</span>
            </NavLink> */}
          </>
        ) : (
          <>
          <NavLink to={`/LeaveStatus/${employeeId}`} 
            className="block w-48 text-center border border-black px-4 py-2 my-1 rounded-lg hover:bg-blue-200"
          >
            <span className="font-semibold text-blue-500">Leave Status</span>
          </NavLink>
          <NavLink to={`/AttendanceStatus/${employeeId}`} 
            className="block w-48 text-center border border-black px-4 py-2 my-1 rounded-lg hover:bg-blue-200"
          >
            <span className="font-semibold text-blue-500">Attendance Status</span>
          </NavLink>
          {/* <NavLink to={`/ProfileDetailsStatus/${employeeId}`} 
            className="block w-48 text-center border border-black px-4 py-2 my-1 rounded-lg hover:bg-blue-200"
          >
            <span className="font-semibold text-blue-500">Profile Details Status</span>
          </NavLink> */}
          </>
        )}
      </div>
    </div>
    </div>
  );
}

export default ApprovalMaster;
