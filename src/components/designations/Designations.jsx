import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

function DesignationForm() {
  const [designation, setDesignation] = useState('');
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState('');

  // Fetch designations from the API
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axiosInstance.get(
          'hrmsapplication/designations/getAllDesignations'
        );
        setDesignations(response.data);
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };
    fetchDesignations();
  }, []);

  const validateDesignation = () => {
    if (!designation) {
      return 'Please select or enter a designation.';
    }
    if (designation.length < 1) {
      return 'Designation must be at least 1 character long.';
    }
    if (designation.length > 50) {
      return 'Designation cannot be longer than 50 characters.';
    }
    if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(designation)) {
      return 'Designation cannot start with a space and should only contain letters and spaces.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateDesignation();
    if (validationError) {
      setErrors(validationError);
      return;
    }

    try {
      const response = await axiosInstance.post(
        'hrmsapplication/designations/create',
        { designation }
      );

      // Reset the form and errors
      setDesignation('');
      setErrors('');

      // Refresh the dropdown list after successful POST
      const updatedDesignations = await axiosInstance.get(
        'hrmsapplication/designations/getAllDesignations'
      );
      setDesignations(updatedDesignations.data);
    } catch (error) {
      console.log('Error response:', error.response);

      let errorMessage = 'Failed to add designation. Please try again.';

      if (error.response?.data) {
        if (error.response.data.detail) {
          // Use the "detail" field from the backend error response
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          // Fallback to "message" field if "detail" is not available
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          // Handle string responses
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        // Fallback to general error message
        errorMessage = error.message;
      }

      setErrors(errorMessage); // Display the extracted error message in the UI
    }

  };


  return (
    <>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
        <NavLink
          to={'/admindashboard'}
          className="absolute top-5 left-5 flex items-center px-2 py-2 bg-blue-950 rounded-md w-40"
        >
          <FaLessThan className="text-white mr-2" />
          <span className="font-semibold text-white">Previous Page</span>
        </NavLink>
        <div className="bg-white p-10 mb-[15rem] rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center text-blue-950 mb-6">Set Designation</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Dropdown for Designations */}
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-2/3 p-2 mb-2 border border-black rounded-md focus:outline-none focus:ring-2"
            >
              <option value="" disabled>
                See  all Designation list
              </option>
              {designations.map((item, index) => (
                <option key={index} value={item.designation}>
                  {item.designation}
                </option>
              ))}
            </select>

            {/* Input to Add a New Designation */}
            <input
              type="text"
              placeholder="Add New Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-2/3 p-2 mb-2 border border-black rounded-md focus:outline-none focus:ring-2"
            />

            {/* Validation Errors */}
            {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DesignationForm;
