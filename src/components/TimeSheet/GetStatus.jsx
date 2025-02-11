
import React, { useEffect, useState } from "react";
import axiosInstance from '../axiosConfig'; 
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { FaLessThan } from 'react-icons/fa';

const GetStatus = () => {
  const { employeeId } = useParams(); 
  const [timesheetData, setTimesheetData] = useState([]);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/timesheetapproval/approvals/${employeeId}`
        );
        setTimesheetData(response.data);  
        console.log(response.data);  
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
        alert("Failed to load timesheet data.");
      }
    };

    if (employeeId) {
        fetchTimesheetData();
    } else {
      console.error("No employee ID provided in the URL.");
    }
  }, [employeeId]);

  const handleback = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
  <NavLink
    onClick={handleback}
    className="flex items-center justify-start px-2 py-2 border-2 bg-blue-950 rounded-md w-40 mb-5 mt-5"
  >
    <FaLessThan className="text-white mr-2" />
    <button>
      <span className="text font-semibold text-white">Previous Page</span>
    </button>
  </NavLink>
  <h1 className="text-xl font-bold mb-4 text-center">Timesheet Details</h1>

  {/* Responsive Table Wrapper */}
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-blue-500 text-white">
          <th className="p-2 text-sm">Employee ID</th>
          <th className="p-2 text-sm">From Date</th>
          <th className="p-2 text-sm">To Date</th>
          <th className="p-2 text-sm">Swipe Hours</th>
          <th className="p-2 text-sm">Total Hours</th>
          <th className="p-2 text-sm">Status</th>
          <th className="p-2 text-sm">Status Message</th>
        </tr>
      </thead>
      <tbody>
        {timesheetData && timesheetData.length > 0 ? (
          timesheetData.map((timesheet, index) => (
            <tr key={index} className="text-center hover:bg-gray-100">
              <td className="p-2 border text-xs">{timesheet.employeeId}</td>
              <td className="p-2 border text-xs">{timesheet.fromDate}</td>
              <td className="p-2 border text-xs">{timesheet.toDate}</td>
              <td className="p-2 border text-xs">{timesheet.swipeHours}</td>
              <td className="p-2 border text-xs">{timesheet.totalHours}</td>
              <td className="p-2 border text-xs">{timesheet.status}</td>
              <td className="p-2 border text-xs">{timesheet.statusMessage}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="p-2 text-center text-sm">No timesheet data available</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default GetStatus;