import React, { useState, useEffect } from "react";
import axiosInstance from './axiosConfig';
import { useParams, NavLink } from "react-router-dom";
import { FaLessThan } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Organisation = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { employeeId } = useParams();
  const userRole = localStorage.getItem("UserRole");
  const accessToken = localStorage.getItem("AccessToken");
  const loggedInUserId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let response;

        if (['ROLE_HR', 'ROLE_ADMIN', 'ROLE_EMPLOYEE', 'ROLE_MANAGER'].includes(userRole)) {
          response = await axiosInstance.get(`hrmsapplication/organization/?employeeId=${employeeId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } else {
          return;
        }

        const data = response.data;
        const formattedEmployees = data.map(emp => ({
          employeeId: emp.employeeId,
          employeeName: emp.employeeName,
          designation: emp.designation,
          reportingManagerId: emp.reportingManagerId,
          reportingManagerName: emp.reportingManagerName,
          reports: emp.reports || [],
        }));

        toast.success("Data generated successfully!");
        setEmployees(formattedEmployees);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setIsLoading(false);
        toast.error("No Data for these EmployeeId");
      }
    };

    fetchEmployees();
  }, [userRole, employeeId, accessToken, loggedInUserId]);

  const handleClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getSuperior = (employeeId) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    return employee && employee.reportingManagerId
      ? employees.find(emp => emp.employeeId === employee.reportingManagerId)
      : null;
  };

  const getSubordinates = (employeeId) => {
    return employees.filter(emp => emp.reportingManagerId === employeeId);
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <NavLink
        to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5"
      >
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>

      <h2 className="text-lg font-semibold my-4 text-center">Organisation Chart</h2>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : employees.length === 0 ? (
          <p>No Data Available</p>
        ) : (
          employees.map((employee, index) => (
            <div
              key={employee.employeeId}
              className={`w-full flex flex-col items-center transition-all duration-300 ease-in-out ${expandedIndex !== null && expandedIndex !== index && index > expandedIndex
                ? "opacity-5 pointer-events-none"
                : ""}`}
            >
              <div
                className={`relative flex flex-col items-center bg-white p-3 shadow-lg mb-4 rounded-lg cursor-pointer transform transition-all duration-300 w-40 h-40 ${expandedIndex === index ? "scale-110" : ""}`}
                onClick={() => handleClick(index)}
              >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <h3 className="font-semibold text-sm text-center">{employee.employeeName}</h3>
                  <p className="text-xs text-gray-500 text-center">{employee.designation}</p>
                </div>
              </div>
              {expandedIndex === index && (
                <div className="mt-4 w-full flex flex-col items-center">
                  {getSubordinates(employee.employeeId).length > 0 && (
                    <div className="flex justify-center flex-wrap gap-3 max-w-full mt-6">
                      {getSubordinates(employee.employeeId).map((subordinate) => (
                       <div
                       key={subordinate.employeeId}
                       className="flex flex-col items-center bg-blue-950 p-3 shadow rounded-lg cursor-pointer text-white  justify-center"
                       style={{
                         padding: "12px",
                         flexBasis: "22%",
                         aspectRatio: "1", 
                         maxWidth: "100px", 
                         minHeight: "100px", 
                       }}
                     >
                       <p className="text-xs text-white text-center">{subordinate.employeeName}</p>
                       <p className="text-xs text-white  text-center">{subordinate.designation}</p>
                     </div>
                     
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Organisation;
