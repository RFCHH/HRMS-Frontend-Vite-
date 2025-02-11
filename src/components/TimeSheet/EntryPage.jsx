import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from "react-router-dom";
import axiosInstance from '../axiosConfig';
import { FaLessThan } from 'react-icons/fa';

const TimeEntryForm = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [yearsList, setYearsList] = useState([]);
  const [monthsList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const userRole = localStorage.getItem("UserRole");

  useEffect(() => {
    const startYear = 2024;
    const years = Array.from({ length: 10 }, (_, i) => startYear + i);
    setYearsList(years);
    setYear(new Date().getFullYear()); // Default year to current year
    setMonth(new Date().getMonth() + 1); // Default month to current month

    // Fetch current week data on initial load
    fetchCurrentWeekData();
  }, []);

  const getCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      fromDate: startOfWeek.toISOString().split('T')[0],
      toDate: endOfWeek.toISOString().split('T')[0],
    };
  };

  const fetchCurrentWeekData = async () => {
    const currentWeek = getCurrentWeek();
    const defaultData = [{
      id: 1,
      employeeId: employeeId,
      fromDate: currentWeek.fromDate,
      toDate: currentWeek.toDate,
      swipeHours: 0.0,
      totalHours: 0.0,
      status: "",
      comments: null,
    }];
    setTableData(defaultData);
    setFormSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const intYear = parseInt(year, 10);
    const intMonth = parseInt(month, 10);

    if (!intYear || !intMonth || intMonth < 1 || intMonth > 12 || intYear < 1000 || intYear > 9999) {
      // If no valid year or month is selected, use the current week data by default
      alert("Invalid year or month selected. Showing current week data.");
      fetchCurrentWeekData();
      return;
    }

    const apiUrl = `hrmsapplication/timesheetapproval/${employeeId}?month=${intMonth}&year=${intYear}`;

    setLoading(true);

    try {
      const response = await axiosInstance.get(apiUrl);
      console.log("API Response:", response.data);

      const serverData = response.data;

      if (Array.isArray(serverData) && serverData.length > 0) {
        const currentWeek = getCurrentWeek();
        const selectedDate = new Date(intYear, intMonth - 1);
        const currentDate = new Date();

        const isCurrentMonthAndYear =
          selectedDate.getFullYear() === currentDate.getFullYear() &&
          selectedDate.getMonth() === currentDate.getMonth();

        let combinedData = [...serverData];
        if (isCurrentMonthAndYear) {
          const currentWeekData = {
            id: 1,
            employeeId: employeeId,
            fromDate: currentWeek.fromDate,
            toDate: currentWeek.toDate,
            swipeHours: 0.0,
            totalHours: 0.0,
            status: "",
            comments: null,
          };
          combinedData = [...serverData, currentWeekData];
        }

        setTableData(combinedData);
      } else {
        setTableData([]);
        alert("No Data Available");
      }
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error fetching data:", error);

    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (employeeId, fromDate, toDate, status) => {
    navigate(`/timeEntry/${employeeId}/${fromDate}/${toDate}`, {
      state: { employeeId, fromDate, toDate, status }
    });
  };


  const handleTeamTimeSheetClick = () => {
    navigate("/table");
  };

  return (
    <>
      <NavLink
        to={'/userdashboard'}
        className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 border-2 bg-blue-950 rounded-md  text-white p-1">Time Sheet</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div className="flex items-end space-x-2 mb-4 w-full">
            <div className="w-32">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {yearsList.map((yearItem) => (
                  <option key={yearItem} value={yearItem}>{yearItem}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {monthsList.map((monthItem) => (
                  <option key={monthItem} value={monthItem}>{monthItem}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-500 text-white text-xs lg:text-lg py-2 lg:px-4 px-3 hover:bg-blue-700 rounded-md"
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
            </div>

            {(userRole === "ROLE_MANAGER" || userRole === "ROLE_HR") && (
              <div className="flex items-end pr-2">
                <button
                  onClick={handleTeamTimeSheetClick}
                  className="bg-blue-500 text-white pr-2 text-xs lg:text-lg lg:py-2 lg:px-4 px-3 py-2 rounded-md hover:bg-blue-600"
                >
                  See my Reportees
                </button>
              </div>
            )}
          </div>
        </form>

        {formSubmitted && tableData.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Employee ID</th>
                  <th className="px-4 py-2 text-left">From Date</th>
                  <th className="px-4 py-2 text-left">To Date</th>
                  <th className="px-4 py-2 text-left">Swipe Hours</th>
                  <th className="px-4 py-2 text-left">Total Hours</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => {
                  console.log("Row Status:", row.status);

                  return (
                    <tr key={row.id} className="border-b">
                      <td className="px-4 py-2">{row.employeeId}</td>
                      <td className="px-4 py-2">{row.fromDate}</td>
                      <td className="px-4 py-2">{row.toDate}</td>
                      <td className="px-4 py-2">{row.swipeHours}</td>
                      <td className="px-4 py-2">{row.totalHours}</td>
                      <td className="px-4 py-2">{row.status}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewClick(row.employeeId, row.fromDate, row.toDate, row.status)}
                          className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default TimeEntryForm;
