import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams,  useNavigate } from "react-router-dom";
import { FaLessThan } from "react-icons/fa";


function Data() {
  const [tableData, setTableData] = useState([]);

  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { examId } = useParams();





  const handlebackclick = ((event) => {
    event.preventDefault();
    navigate(-1);
  })
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/examSheets/get?employeeId=${employeeId}&examId=${examId}`);
        setTableData(response.data);
      }
      catch (error) {
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
    fetchdata();
  }, []);

  return (
    <>
      <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        {/* <Link to={`/employeelist/${employeeId}`}> */}
        <button onClick={handlebackclick}><span className="font-semibold text-white">Previous Page</span></button>
        {/* </Link> */}
      </div>
      <div className="container mx-auto p-4">
  <div className="border rounded-lg shadow-md p-4 bg-white">
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-300 lg:text-lg ">
            <th className="border border-solid border-gray-400 p-1 text-center">Exam Date</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Exam Start Time</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Exam End Time</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Percentage</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-xs sm:text-sm">No data available</td>
            </tr>
          ) : (
            tableData.map((row, index) => {
              const formatTime = (dateTime) => {
                const date = new Date(dateTime);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
              };

              return (
                <tr key={index} className="odd:bg-white even:bg-gray-50 text-sm ">
                  <td className="border border-gray-300 text-center p-1">{row.examDate}</td>
                  <td className="border border-gray-300 text-center p-1">{formatTime(row.examStartTime)}</td>
                  <td className="border border-gray-300 text-center p-1">{formatTime(row.examEndTime)}</td>
                  <td className="border border-gray-300 text-center p-1">{row.percentage}</td>
                  <td className="border border-gray-300 text-center p-1">{row.qualified ? "Qualified" : "Not Qualified"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </>
  );
}

export default Data;
