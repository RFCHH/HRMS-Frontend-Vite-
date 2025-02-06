import React, { useState, useEffect } from "react";
import { AiTwotoneHome } from "react-icons/ai";
import { useLocation, useNavigate, useParams, NavLink } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLessThan } from "react-icons/fa";
import { requestFormReset } from "react-dom";

const TimeSheet = () => {
  const navigate = useNavigate();
  const { employeeId: paramEmployeeId } = useParams(); 
  const location = useLocation();
  const fromReportees = location.state?.fromReportees || false;
  const userRole = localStorage.getItem("UserRole");
  const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
  const ROLE_MANAGER = "ROLE_MANAGER";
  const ROLE_HR = "ROLE_HR";
  const [employeeId, setEmployeeId] = useState(() => {
    const storedEmpId = localStorage.getItem("EmpId");
    return paramEmployeeId || storedEmpId || ""; 
  });

  const [totalSwipeHours, setTotalSwipeHours] = useState(0);
  const [timeSummaries, setTimeSummaries] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabledRequests, setDisabledRequests] = useState({}); // track the disabled requests

  const isButtonDisabled =
    userRole === ROLE_EMPLOYEE ||
    (!fromReportees && (userRole === ROLE_MANAGER || userRole === ROLE_HR));

  const { totalHours, weekStartDate, swipeHours } = location.state || {
    totalHours: 0,
    weekStartDate: new Date(),
    swipeHours: Array(7).fill(0),
  };
  useEffect(() => {
    if (paramEmployeeId && !localStorage.getItem("EmpId")) {
      localStorage.setItem("EmpId", paramEmployeeId);
      setEmployeeId(paramEmployeeId);
    }
  }, [paramEmployeeId]);

  useEffect(() => {
    const calculateTotalSwipeHours = () => {
      if (Array.isArray(swipeHours)) {
        const total = swipeHours.reduce(
          (acc, curr) => acc + (parseFloat(curr) || 0),
          0
        );
        setTotalSwipeHours(total.toFixed(2));
      }
    };

    const generateWeeklySummaries = () => {
      const summaries = [];
      const startingDate = new Date(weekStartDate);
      for (let i = 0; i < 4; i++) {
        const startOfWeek = new Date(startingDate);
        const endOfWeek = new Date(startingDate);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        const weekPeriod = `${startOfWeek.toLocaleDateString(
          "en-US"
        )} To ${endOfWeek.toLocaleDateString("en-US")}`;
        summaries.push({
          id: i + 1,
          period: weekPeriod,
          submittedTotalHours: i === 0 ? totalHours : 0,
          status: "Pending",
        });
        startingDate.setDate(startingDate.getDate() - 7);
      }
      setTimeSummaries(summaries);
    };

    calculateTotalSwipeHours();
    generateWeeklySummaries();
  }, [totalHours, swipeHours, weekStartDate]);

  useEffect(() => {
    const fetchTimesheetData = async () => {
      const url = `hrmsapplication/timesheetapproval/approvals/${employeeId}`;
      try {
        const response = await axiosInstance.get(url);
        setRequests(response.data);
        setIsLoading(false);
        toast.success("Data generated successfully!");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setIsLoading(false);
        toast.error("Kindly recheck the Form");
      }
    };

    if (employeeId) {
      fetchTimesheetData(); 
    }
  }, [employeeId]);

  const handleHomeClick = () => {
    navigate("/to");
  };

  const handleApproval = async (id, action) => {
    const updatedStatus = action === "approve" ? "Approved" : "Rejected";
    const updatedSummaries = timeSummaries.map((summary) =>
      summary.id === id ? { ...summary, status: updatedStatus } : summary
    );
    setTimeSummaries(updatedSummaries);

    setDisabledRequests((prev) => ({
      ...prev,
      [id]: true, // Disable buttons for this request
    }));

    try {
      let url;
      if (userRole === ROLE_MANAGER) {
        url =
          action === "approve"
            ? `hrmsapplication/timesheetapproval/managerApproval?timeSheetId=${id}&comments=string`
            : `hrmsapplication/timesheetapproval/managerReject?timeSheetId=${id}&comments=string`;
      } else if (userRole === ROLE_HR) {
        url =
          action === "approve"
            ? `hrmsapplication/timesheetapproval/hrApproval?timeSheetId=${id}&comments=string`
            : `hrmsapplication/timesheetapproval/hrReject?timeSheetId=${id}&comments=string`;
      } else {
        console.error("User role not recognized");
        return;
      }
      await axiosInstance.patch(url, { status: updatedStatus });
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error("Error adding the job:", error);
      let errorMessage = "Failed to add the job. Please try again.";
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

  const handleback = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const backToEntryPage = (employeeId, fromDate, toDate) => {
    navigate(`/timeEntry/${employeeId}/${fromDate}/${toDate}`, {
      state: { employeeId, fromDate, toDate },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    alert(`Error loading timesheet data: ${error.message}`);
    return <div>Error loading timesheet data: {error.message}</div>;
  }

  return (
    <div className="p-5">
      <NavLink
        onClick={handleback}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5"
      >
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>

      <h2 className="text-2xl font-semibold mb-4">Time Summary</h2>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-600">
            No data available
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <div
                onClick={() =>
                  backToEntryPage(request.employeeId, request.fromDate, request.toDate)
                }
                className="flex-1 border-r border-gray-300 p-2 cursor-pointer"
              >
                <span className="text-red-600 font-semibold">
                  {request.fromDate
                    ? new Date(request.fromDate).toLocaleDateString("en-US")
                    : "N/A"}{" "}
                  To{" "}
                  {request.toDate
                    ? new Date(request.toDate).toLocaleDateString("en-US")
                    : "N/A"}
                </span>
              </div>
              <div className="flex-1 text-center p-2">
                <span className="text-sm text-gray-700">
                  {typeof totalSwipeHours === "number"
                    ? totalSwipeHours
                    : "Invalid swipe hours"}
                </span>
                <p className="text-xs text-gray-500">Swipe Hours</p>
              </div>
              <div className="flex-1 text-center p-2">
                <span className="text-sm text-gray-700">
                  {typeof request.totalHours === "number"
                    ? request.totalHours
                    : "Invalid total hours"}
                </span>
                <p className="text-xs text-gray-500">Total Hours</p>
              </div>
              <div className="flex-1 text-center p-2">
                {userRole === "ROLE_EMPLOYEE" && (
                  <span className="text-sm text-gray-700">
                    {typeof request.status === "string"
                      ? request.status
                      : "Invalid status"}
                  </span>
                )}

                {(userRole === "ROLE_MANAGER" || userRole === "ROLE_HR") && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleApproval(request.id, "approve")}
                      className="bg-green-500 text-white p-2 rounded-md"
                      disabled={disabledRequests[request.id]}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(request.id, "reject")}
                      className="bg-red-500 text-white p-2 rounded-md"
                      disabled={disabledRequests[request.id]}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default TimeSheet;
