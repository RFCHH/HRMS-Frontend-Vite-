import React, { useEffect, useState } from "react";
import axiosInstance from '../axiosConfig'; 
import { useNavigate ,NavLink} from "react-router-dom";
import { FaLessThan } from 'react-icons/fa';
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("UserRole"); 
  const managerId = localStorage.getItem("EmpId");
  const hrId = localStorage.getItem("EmpId"); 
  const userId = localStorage.getItem("EmpId"); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let url = "";
        if (userRole === "ROLE_MANAGER") {
          if (managerId) {
            url = `hrmsapplication/employee/getEmployeesListByManagerId/${managerId}`;
          } else {
            console.error("Manager ID is missing in localStorage.");
            return;
          }
        } else if (userRole === "ROLE_HR") {
          if (hrId) {
            url = `hrmsapplication/employee/getHrReportees/${hrId}`;
          } else {
            console.error("Unauthorized role: User cannot view employee list.");
            return;
          }
        }

        const response = await axiosInstance.get(url);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    
    if (userRole) {
      fetchEmployees();
    } else {
      console.error("No user role found in localStorage.");
    }
  }, [userRole, managerId, hrId]);

  const handleViewClick = async (employeeId) => {
    try {
      if (userRole === "ROLE_EMPLOYEE" && userId !== employeeId) {
        alert("You can only view your own timesheet.");
        return;
      }

      const response = await axiosInstance.get(
        `hrmsapplication/timesheetapproval/approvals/${employeeId}`
      );

      const { totalHours, weekStartDate, swipeHours, formDate, endDate } = response.data;
      navigate(`/timesheets/${employeeId}`, {
        state: {
          totalHours: totalHours || 0,
          weekStartDate: weekStartDate ? new Date(weekStartDate) : new Date(), 
          swipeHours: swipeHours || Array(7).fill(0), 
          formDate: formDate ? new Date(formDate) : null, 
          endDate: endDate ? new Date(endDate) : null, 
        },
      });
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
      alert("Failed to load timesheet data.");
    }
  };
  const handleback =(e) => {
    e.preventDefault()
    navigate(-1)
  }
  
  const handleStatus = (employeeId) => {
    navigate(`/status/${employeeId}`,
      
  );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavLink
        onClick={handleback}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>
      <h1 className="text-2xl font-bold mb-6">Employee List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2">Employee ID</th>
            <th className="p-2">Employee Name</th>
            <th className="p-2">Action</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.employeeId} className="text-center hover:bg-gray-100">
                <td className="p-2 border">{employee.employeeId}</td>
                <td className="p-2 border">{employee.employeeName}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleViewClick(employee.employeeId)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleStatus(employee.employeeId)}
                    className="text-blue-500 hover:underline"
                  >
                    View Status
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 text-center">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
