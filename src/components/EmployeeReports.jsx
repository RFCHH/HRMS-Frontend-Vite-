import { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig';
import { Link } from 'react-router-dom';
import {AiOutlineHome } from 'react-icons/ai'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

const EmployeeReports = () => {
  const [employees, setEmployees] = useState([]);
  // const [employeeId, setEmployeeId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const employeeId = localStorage.getItem('EmpId');


  const fetchReports = async () => {
    try {
      // Construct the URL using employeeId and attendanceDate from the input fields
      const response = await axiosInstance.get(
        `hrmsapplication/attendance/reportees?employeeId=${employeeId}&attendanceDate=${attendanceDate}`
      );
      setEmployees(response.data);
      setIsDataFetched(true); 
      toast.success("Data generated successfully!"); 
    } 
    // catch (error) {
    //   console.error("Error fetching employee reports:", error);
    //   toast.error("Authentication details found with the given id and Recheck the data submitted");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fetch the reports when the user submits the form
    fetchReports();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
         
        <nav className="mt-2 flex p-1 bg-gray-200 shadow-md max-w-7xl mx-auto border border-black rounded-md">
        <div className="flex items-center space-x-1">
          <Link to={`/attendenceSheet/${employeeId}`}> <AiOutlineHome className="text-xl" /></Link>
         
          <span className="text-lg justify-center font-bold">Reportees</span>
        </div>
      </nav>
      <h2 className="text-2xl font-bold mb-4">Employee Attendance Reports</h2>
      
      {/* Input Form for employeeId and attendanceDate */}
      <form onSubmit={handleSubmit} className="mb-6">
        {/* <div className="flex items-center mb-4">
          <label htmlFor="employeeId" className="mr-4">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter your Employee ID..."
            required
          />
        </div> */}

        <div className="flex items-center mb-4">
          <label htmlFor="attendanceDate" className="mr-4">Attendance Date:</label>
          <input
            type="date"
            id="attendanceDate"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Fetch Reports
        </button>
      </form>

      {/* Show the table if data is fetched */}
      {isDataFetched && (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
      <thead>
        <tr className="">
          <th className="px-4 sm:px-6 py-3 border-b">Employee ID</th>
          <th className="px-4 sm:px-6 py-3 border-b">Employee Name</th>
          <th className="px-4 sm:px-6 py-3 border-b">Attendance Date</th>
          <th className="px-4 sm:px-6 py-3 border-b">In Time</th>
          <th className="px-4 sm:px-6 py-3 border-b">Out Time</th>
          <th className="px-4 sm:px-6 py-3 border-b">Total Working Hours</th>
          <th className="px-4 sm:px-6 py-3 border-b">Type</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) =>
          employee.attendanceDTOList.map((attendance) => (
            <tr key={attendance.id} className="hover:bg-gray-100 text-center">
              <td className="px-4 sm:px-6 py-3 border-b">{employee.employeeId}</td>
              <td className="px-4 sm:px-6 py-3 border-b">{employee.employeeName}</td>
              <td className="px-4 sm:px-6 py-3 border-b">{attendance.attendanceDate}</td>
              <td className="px-4 sm:px-6 py-3 border-b">{attendance.inTime}</td>
              <td className="px-4 sm:px-6 py-3 border-b">{attendance.outTime}</td>
              <td className="px-4 sm:px-6 py-3 border-b">{attendance.totalWorkingHours} hours</td>
              <td className="px-4 sm:px-6 py-3 border-b">{attendance.type}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default EmployeeReports;
