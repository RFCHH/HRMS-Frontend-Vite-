import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaLessThan } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Examdetails() {
    const { employeeId } = useParams();
    const [data, setdata] = useState({
        "examId": "",
        "examName": "",
        "startDate": "",
        "endDate": "",
        "duration": "",
    });
    const navigate=useNavigate()


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await axiosInstance.get(`hrmsapplication/exam/get-employee-exams?employeeId=${employeeId}`);
                setdata(response.data);

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

    const handlebackclick = ((event) => {
        event.preventDefault();
        navigate(-1);
    })

    return (
        <>
            <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
                <FaLessThan className="text-white mr-2" />
                <button onClick={handlebackclick}><span className="font-semibold text-white">Previous Page</span></button>
            </div>
            <div className="container mx-auto p-4">
  <div className="border rounded-lg shadow-md p-4 bg-white">
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-300 text-xs sm:text-sm">
            <th className="border border-solid border-gray-400 p-1 text-center">Exam ID</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Exam Name</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Start Date</th>
            <th className="border border-solid border-gray-400 p-1 text-center">End Date</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Duration</th>
            <th className="border border-solid border-gray-400 p-1 text-center">No of Attempts</th>
            <th className="border border-solid border-gray-400 p-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(req => (
              <tr key={req.id} className="text-center hover:bg-gray-100 text-xs sm:text-sm">
                <td className="border border-solid border-gray-400 p-1">{req.examId}</td>
                <td className="border border-solid border-gray-400 p-1">{req.examName}</td>
                <td className="border border-solid border-gray-400 p-1">{req.startDate}</td>
                <td className="border border-solid border-gray-400 p-1">{req.endDate}</td>
                <td className="border border-solid border-gray-400 p-1">{req.duration}</td>
                <td className="border border-solid border-gray-400 p-1">{req.maxAttempts}</td>
                <td className="border border-solid border-gray-400 p-1">
                  <Link to={`/examdata/${employeeId}/${req.examId}`}>
                    <button>
                      <span className="flex items-center bg-green-500 text-black px-2 py-1 rounded">View</span>
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4 text-xs sm:text-sm">No data available</td>
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

export default Examdetails;
