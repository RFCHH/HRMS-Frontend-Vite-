import { useState, useEffect } from "react";
import { AiTwotoneHome, AiOutlineDownload } from "react-icons/ai";
import axiosInstance from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

const AttendanceSheet = () => {
  const [attendance, setAttendance] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedDay, setClickedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [tempStartTime, setTempStartTime] = useState("");
  const [tempEndTime, setTempEndTime] = useState("");
  const [totalWorkHours, setTotalWorkHours] = useState(null);
  const [attendanceType, setAttendanceType] = useState("");
  const [attendanceId, setAttendanceId] = useState(null); // Store the attendance id
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState(""); // New state for form validation error
  const navigate = useNavigate();
  const userRole = localStorage.getItem("UserRole");


  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State to store validation error messages

const handleDateChange = (e) => {
  const selectedDate = new Date(e.target.value);
  const today = new Date();
  
  // Reset the time of 'today' and 'selectedDate' to only compare dates, not time.
  today.setHours(0, 0, 0, 0); 
  selectedDate.setHours(0, 0, 0, 0);
  
  // Get the limits: 7 days ago and 1 year ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Validate the selected date
  if (selectedDate.getTime() === today.getTime()) {
    setErrorMessage("Today's date is not allowed. Please select a date in the past.");
    return;
  }
  
  if (selectedDate > today) {
    setErrorMessage("Future dates are not allowed.");
    return;
  }
  
  if (selectedDate < sevenDaysAgo) {
    setErrorMessage("You can only select a date from the past 7 days.");
    return;
  }
  
  if (selectedDate < oneYearAgo) {
    setErrorMessage("Dates older than 1 year are not allowed.");
    return;
  }

  // If all validations pass, clear any previous error messages
  setErrorMessage("");

  // Set the selected date and fetch attendance if valid
  setSelectedDate(selectedDate);
  setClickedDay(selectedDate.toLocaleDateString("en-US", { weekday: "short" }));
  fetchAttendance(selectedDate);
};

  

  const handleReportsClick = () => {
    navigate("/EmployeeReports");
  };

  const getEmployeeId = () => {
    return localStorage.getItem("EmpId");
  };

  const fetchAttendance = async (date) => {
    const employeeId = getEmployeeId();
    const formattedDate = formatDateForAPI(date);

    try {
      const response = await axiosInstance.get(
        `hrmsapplication/attendance/self`,
        {
          params: {
            employeeId: employeeId,
            attendanceDate: formattedDate,
          },
        }
      );
      const fetchedAttendance = response.data;

      if (fetchedAttendance && Object.keys(fetchedAttendance).length > 0) {
        setAttendance(fetchedAttendance);
        setAttendanceId(fetchedAttendance.id); // Set the fetched attendance id
        setStartTime(fetchedAttendance.inTime || "");
        setEndTime(fetchedAttendance.outTime || "");
        setTotalWorkHours(fetchedAttendance.totalWorkingHours || "");
        setAttendanceType(fetchedAttendance.type || "");
        setErrorMessage(""); // Clear any previous error message
      } else {
        clearForm(); // Reset the form when no data is found
        setErrorMessage("No attendance data available for this date.");
      }
    }catch (error) {
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

  const clearForm = () => {
    setAttendance(null);
    setStartTime("");
    setEndTime("");
    setTotalWorkHours(null);
    setAttendanceType("");
    setAttendanceId(null); // Clear attendanceId when form is cleared
  };

  useEffect(() => {
    // Fetch attendance for the initially selected date
    fetchAttendance(selectedDate);
  }, []);

  const handleCreate = () => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
    setFormError(""); // Clear form error when closing the popup
  };

  const calculateTotalWorkingHours = (inTime, outTime) => {
    const [inHours, inMinutes] = inTime.split(":").map(Number);
    const [outHours, outMinutes] = outTime.split(":").map(Number);

    const start = new Date();
    start.setHours(inHours, inMinutes, 0);

    const end = new Date();
    end.setHours(outHours, outMinutes, 0);

    const totalMinutes = Math.abs((end - start) / 60000); 
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const handleSubmit = async () => {
    if (!attendanceType || !tempStartTime || !tempEndTime) {
      setFormError("Please select attendance type, start time, and end time.");
      return; // Stop the form submission if validation fails
    }

    const employeeId = getEmployeeId();
    const formattedDate = formatDateForAPI(selectedDate);

    const calculatedTotalWorkingHours = calculateTotalWorkingHours(
      tempStartTime,
      tempEndTime
    );

    const payload = {
      employeeId: employeeId,
      inTime: tempStartTime,
      outTime: tempEndTime,
      attendanceDate: formattedDate,
      totalWorkingHours: calculatedTotalWorkingHours, // Calculate total working hours here
      type: attendanceType, // Use the selected attendance type
    };

    try {
      const response = await axiosInstance.post(
        "hrmsapplication/attendance/create",
        payload
      );
      console.log("Attendance successfully created:", response.data);
      setShowPopUp(false);
      setFormError(""); // Clear form error after successful submission
      fetchAttendance(selectedDate); // Refresh attendance data
    } catch (error) {
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

  return (
    <>
       
      <NavLink
        to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>

      <div className="w-full lg:w-10/12 xl:w-9/12 mx-auto mt-2 bg-white rounded-md border border-black/90 shadow-md p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AiTwotoneHome size={20} className="mr-2" />Home
          </div>
          <div className="flex gap-3 items-center">
            <button className="flex items-center px-5 py-2 bg-blue-950 text-white rounded-lg hover:bg-orange-500 transition duration-300">
              <AiOutlineDownload className="mr-2" />
              Export to Excel
            </button>

            {userRole !== 'ROLE_EMPLOYEE' && (
              <button
                onClick={handleReportsClick}
                className="flex items-center px-5 py-2 bg-blue-950 text-white rounded-lg hover:bg-orange-500 transition duration-300"
              >
                See My Reportees
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Attendance Tracker
          </h2>
          <div>
  <input type="date" onChange={handleDateChange} />
  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
</div>

        </div>

        {clickedDay && selectedDate <= new Date() && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white text-center border border-blue-900 bg-blue-950">
              {attendance
                ? `Attendance Date: ${attendance.attendanceDate}`
                : "No Attendance Data"}
            </h3>

            <div className="text-center text-lg font-bold text-gray-800">
              {attendance ? (
                <>
                  {`Total Working Hours: ${attendance.totalWorkingHours}`}
                  <br />
                  {`Type: ${attendance.type}`}
                </>
              ) : (
                <p>{errorMessage || "No data available for this date."}</p>
              )}
            </div>
            <div className="flex justify-center items-center space-x-4 mb-6">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-46"
                  placeholder="Start Time"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-46"
                  placeholder="End Time"
                />
              </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-orange-500"
              >
                Add Attendance
              </button>
            </div>
          </div>
        )}

        {showPopUp && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Add Attendance</h3>
              <label htmlFor="attendanceType" className="font-semibold">
                Attendance Type:
              </label>
              <select
                id="attendanceType"
                value={attendanceType}
                onChange={(e) => setAttendanceType(e.target.value)}
                className="border rounded-md p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="workFromOffice">Work from Office</option>
                <option value="workFromHome">Work from Home</option>
                <option value="halfDay">Half Day</option>
                <option value="halfDay">Missed Swipein</option>
              </select>

              <label htmlFor="startTime" className="font-semibold">
                Start Time:
              </label>
              <input
                id="startTime"
                type="time"
                value={tempStartTime}
                onChange={(e) => setTempStartTime(e.target.value)}
                className="border rounded-md p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label htmlFor="endTime" className="font-semibold">
                End Time:
              </label>
              <input
                id="endTime"
                type="time"
                value={tempEndTime}
                onChange={(e) => setTempEndTime(e.target.value)}
                className="border rounded-md p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {formError && (
                <p className="text-red-500 mb-2">{formError}</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-orange-500"
                >
                  Save
                </button>
                <button
                  onClick={handleClosePopUp}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceSheet;
