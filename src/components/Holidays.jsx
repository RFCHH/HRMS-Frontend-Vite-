import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdCancelPresentation } from 'react-icons/md';
import { FaLessThan } from 'react-icons/fa';
import axiosInstance from './axiosConfig';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const initialData = {
    holidayName: '',
    date: '',
    location: '',
    holidayId: '',
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const userRole = localStorage.getItem("UserRole");
  // const ROLE_ADMIN = "ROLE_ADMIN"; 

  useEffect(() => {
    fetchCurrentDetails();
  }, []);

  const fetchCurrentDetails = async () => {
    try {
      const response = await axiosInstance.get("hrmsapplication/holiday/getHoliday");
      setTableData(response.data);
      console.log("Fetched data:", response.data);
      toast.success("Data loaded successfully!");
    }
    // catch (error) {
    //   console.error("Error fetching Holiday Details:", error);
    //   toast.error("kindly recheck the Form");
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

  const today = new Date();
  const currentYear = today.getFullYear();
  const nextYear = currentYear + 1;
  const startDate = `${currentYear}-01-01`;
  const endDate = `${nextYear}-12-31`;
  const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;

  const validateForm = () => {
    let newError = {};

    if (!formData.holidayName.trim()) {
      newError.holidayName = 'Holiday Name is required';
    } else if (!nameRegex.test(formData.holidayName)) {
      newError.holidayName = 'Holiday Name must start with a character and contain only alphabets and spaces';
    } else if (formData.holidayName.length < 2 || formData.holidayName.length > 30) {
      newError.holidayName = 'Holiday Name must be between 2 and 30 characters';
    }

    if (!formData.date) {
      newError.date = 'Holiday Date is required';
    } else if (tableData.some((row, index) =>
      row.date === formData.date && index !== editIndex)) {
      newError.date = 'Date is already taken';
    }

    if (!formData.location.trim()) {
      newError.location = 'Location is required';
    } else if (!nameRegex.test(formData.location)) {
      newError.location = 'Location must start with a character and contain only alphabets and spaces';
    } else if (formData.location.length < 1 || formData.location.length > 30) {
      newError.location = 'Location must be between 1 and 30 characters';
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleOpenPopup = (index = null) => {
    setFormData(index !== null ? { ...tableData[index] } : { ...initialData });
    setEditIndex(index);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
  };

  const formatPostDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const updatedFormData = {
          ...formData,
          date: formatPostDate(formData.date),
        };

        if (editIndex !== null) {
          const response = await axiosInstance.patch(
            'hrmsapplication/holiday/',
            { holidayId: tableData[editIndex].holidayId, ...updatedFormData },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("PATCH Response Data:", response.data);

          // Update the local state
          const newTableData = [...tableData];
          newTableData[editIndex] = { ...newTableData[editIndex], ...updatedFormData };
          setTableData(newTableData);
          toast.success("Data loaded successfully!");
        } else {
          const response = await axiosInstance.post(
            'hrmsapplication/holiday/',
            updatedFormData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("POST Response Data:", response.data);
          const newHolidayEntry = { ...updatedFormData, holidayId: response.data.holidayId };
          setTableData([...tableData, newHolidayEntry]);
          toast.success("Data loaded successfully!");
        }

        handleClosePopup();
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
    } else {
      console.log("Form validation failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleDelete = async (index) => {
    const holidayId = tableData[index].holidayId;

    try {
      await axiosInstance.delete(
        `hrmsapplication/holiday/${holidayId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("DELETE Response Data:", holidayId);
      setTableData(tableData.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error during deletion:", error.response?.data || error.message);
      alert("There was an error deleting the holiday. Please try again.");
    }
  };

  const handleAddRow = () => {
    handleOpenPopup();
  };

  const preventManualInput = (e) => {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  const handleNameChar = (e) => {
    const key = e.key;
    const value = e.target.value;

    if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="mr-10 ml-6">
        <NavLink
          to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
          className="flex items-center justify-start p-2 overflow-x-auto  bg-blue-950 border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-white mr-2" />
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </NavLink>
      </div>
      <div className="p-4 pt-5 mt-5 ml-2 mr-2 lg:ml-48 lg:mr-48">
        <div className="overflow-x-auto border border-black">
          <table className="w-full text-sm lg:text-base">
            <thead>
              <tr>
                <th
                  className="p-4 text-left bg-blue-950 text-white border border-solid border-black"
                  colSpan="4"
                >
                  Holidays
                </th>
              </tr>
              <tr>
                <th
                  className="py-2 px-4 text-left text-black border border-solid border-black"
                  colSpan="4"
                >
                  <div className="flex justify-between items-center">
                    <span>Holidays</span>
                    {(userRole === "ROLE_ADMIN" || userRole === "ROLE_HR") && (
                      <button
                        className="bg-green-600 text-white py-1 px-4 rounded text-xs sm:text-sm"
                        onClick={handleAddRow}
                        type="button"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="border border-black border-collapse">
              <tr>
                <th className="bg-gray-400 py-2 border border-solid border-black text-xs sm:text-sm">
                  Name of The Holiday
                </th>
                <th className="bg-gray-400 py-2 border border-solid border-black text-xs sm:text-sm">
                  Date
                </th>
                <th className="bg-gray-400 py-2 border border-solid border-black text-xs sm:text-sm">
                  Location
                </th>
                {userRole === "ROLE_ADMIN" && (
                  <th className="bg-gray-400 py-2 border border-solid border-black text-xs sm:text-sm">
                    Action
                  </th>
                )}
              </tr>
              {tableData.map((row, index) => (
                <tr key={row.holidayId}>
                  <td className="py-3 px-2 border-b border-gray-900 border-r text-center text-xs sm:text-sm">
                    {row.holidayName}
                  </td>
                  <td className="py-3 px-2 border-b border-gray-900 border-r text-center text-xs sm:text-sm">
                    {row.date}
                  </td>
                  <td className="py-3 px-2 border-b border-gray-900 border-r text-center text-xs sm:text-sm">
                    {row.location}
                  </td>
                  {userRole === "ROLE_ADMIN" && (
                    <td className="py-2 px-2 border-b border-gray-900 text-center text-xs sm:text-sm">
                      <div className="flex flex-row justify-center">
                        <TiPencil
                          className="inline-block mr-4 cursor-pointer text-base sm:text-lg"
                          onClick={() => handleOpenPopup(index)}
                        />
                        {index !== 0 && (
                          <RiDeleteBin6Line
                            className="cursor-pointer text-base sm:text-lg inline-block"
                            onClick={() => handleDelete(index)}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="bg-gray-200 p-4 rounded-lg shadow-lg max-w-full sm:max-w-[700px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 bg-orange-500 border border-gray-950 p-2 rounded">
                <h2 className="text-sm sm:text-lg">{editIndex !== null ? "Edit Holiday Details" : "Add New Holiday"}</h2>
                <MdCancelPresentation
                  className="text-lg sm:text-xl cursor-pointer"
                  onClick={handleClosePopup}
                />
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2 sm:p-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1 text-sm sm:text-base">Holiday Name:</label>
                    <input
                      type="text"
                      name="holidayName"
                      value={formData.holidayName}
                      onChange={handleChange}
                      onKeyDown={handleNameChar}
                      maxLength="30"
                      className="p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                    {errors.holidayName && <p className="text-red-500 text-xs sm:text-sm">{errors.holidayName}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1 text-sm sm:text-base">Holiday Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onKeyDown={preventManualInput}
                      min={startDate}
                      max={endDate}
                      className="p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                    {errors.date && <p className="text-red-500 text-xs sm:text-sm">{errors.date}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1 text-sm sm:text-base">Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onKeyDown={handleNameChar}
                      maxLength="30"
                      className="p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                    {errors.location && <p className="text-red-500 text-xs sm:text-sm">{errors.location}</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="submit"
                    className="hover:bg-gray-600 bg-gray-500 text-white py-2 px-4 rounded text-xs sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="hover:bg-gray-600 bg-gray-500 text-white py-2 px-4 rounded text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </>
  );
}

export default App;