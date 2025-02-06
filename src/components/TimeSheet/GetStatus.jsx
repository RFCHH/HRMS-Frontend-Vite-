
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavLink
        onClick={handleback}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5"
      >
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>
      <h1 className="text-2xl font-bold mb-6">Timesheet Details</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2">Employee ID</th>
            <th className="p-2">From Date</th>
            <th className="p-2">To Date</th>
            <th className="p-2">Swipe Hours</th>
            <th className="p-2">Total Hours</th>
            <th className="p-2">Status</th>
            <th className="p-2">Status Message</th>
          </tr>
        </thead>
        <tbody>
          {timesheetData && timesheetData.length > 0 ? (
            timesheetData.map((timesheet, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                <td className="p-2 border">{timesheet.employeeId}</td>
                <td className="p-2 border">{timesheet.fromDate}</td>
                <td className="p-2 border">{timesheet.toDate}</td>
                <td className="p-2 border">{timesheet.swipeHours}</td>
                <td className="p-2 border">{timesheet.totalHours}</td>
                <td className="p-2 border">{timesheet.status}</td>
                <td className="p-2 border">{timesheet.statusMessage}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-2 text-center">No timesheet data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GetStatus;