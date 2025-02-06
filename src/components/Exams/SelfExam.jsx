import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLessThan } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Exam() {
  const [savedData, setsavedData] = useState([]);
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("UserRole");

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/exam/get-employee-exams?employeeId=${employeeId}`
        );
        const data = response.data;
        console.log("Fetched Data:", data);
        setsavedData(data);
      } catch (error) {
        console.error("Error in fetching data", error);

        let errorMessage = "Error in fetching data. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }

        toast.error(errorMessage);
      }
    };

    fetchedData();
  }, [employeeId]);

  const handleViewReportsClick = () => {
    navigate(`/employeelist`);
  };


  const handleStartButtonClick = (examId) => {
    navigate(`/ExamStart/${examId}`);


  };

  return (
    <>
      <div className="flex bg-blue-950 items-center justify-start lg:px-2 lg:py-2 md:px-2 md:py-2 lg:text-md px-1 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/userdashboard`}>
          <button><span className="font-semibold text-white">Previous Page</span></button>
        </Link>
      </div>
      <div className="container mx-auto p-4">
        {/* View Reports Button (Hidden for Employees) */}
        {userRole !== 'ROLE_EMPLOYEE' && (
          <div className="flex justify-end">
            <button
              onClick={handleViewReportsClick}
              className="bg-black text-white px-3 py-1 rounded-md text-xs lg:text-sm"
            >
              View All Reports
            </button>
          </div>
        )}

        <div className="mt-4">
          <div className="border rounded-lg shadow-md p-4 bg-white overflow-x-auto">
            {/* Table Wrapper to Enable Horizontal Scroll on Mobile */}
            <table className="w-full table-auto border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-300 text-xs lg:text-lg">
                  <th className="border border-solid border-gray-400 p-1 text-center whitespace-nowrap">Exam Name</th>
                  <th className="border border-solid border-gray-400 p-1 text-center whitespace-nowrap">Start Date</th>
                  <th className="border border-solid border-gray-400 p-1 text-center whitespace-nowrap">End Date</th>
                  <th className="border border-solid border-gray-400 p-1 text-center whitespace-nowrap">Duration</th>
                  <th className="border border-solid border-gray-400 p-1 text-center whitespace-nowrap">No of Attempts</th>
                  <th className="border border-solid border-gray-400 p-1 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {savedData.length > 0 ? (
                  savedData.map((data) => {
                    console.log("Data for each exam:", data);
                    const examId = data.id || data.examId;
                    return (
                      <tr key={examId} className="text-center text-xs lg:text-base">
                        <td className="border border-solid border-gray-400 p-1">{data.examName}</td>
                        <td className="border border-solid border-gray-400 p-1">{data.startDate}</td>
                        <td className="border border-solid border-gray-400 p-1">{data.endDate}</td>
                        <td className="border border-solid border-gray-400 p-1">{data.duration}</td>
                        <td className="border border-solid border-gray-400 p-1">{data.maxAttempts}</td>
                        <td className="border border-solid border-gray-400 p-1">
                          <button
                            onClick={() => handleStartButtonClick(examId)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md text-xs lg:px-4 lg:py-2 lg:text-sm"
                          >
                            Start
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-xs lg:text-sm">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  );
}

export default Exam;
