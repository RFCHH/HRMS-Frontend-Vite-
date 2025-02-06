import React, { useState, useEffect } from 'react';
import { MdCancelPresentation } from 'react-icons/md';
import { AiOutlineHome } from "react-icons/ai";
import { NavLink } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  


const defaultFields = [
  { name: 'employeeId', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9]*$/ },
  { name: 'employeeName', type: 'text', required: true, min: 1, max: 20 },
  { name: 'employeeDesignation', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9\-/\s]*$/ },
  { name: 'projectCode', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9]*$/ },
  { name: 'startDate', type: 'date', required: true },
  { name: 'endDate', type: 'date', required: true },
  { name: 'shiftStartTime', type: 'time', required: true },
  { name: 'shiftEndTime', type: 'time', required: true },
  { name: 'comments', type: 'textarea', required: false, min: 1, max: 100, pattern: /^[^\s].*$/ },
];

const labels = {
  employeeId: 'Employee ID',
  employeeName: 'Employee Name',
  employeeDesignation: 'Designation',
  projectCode: 'Project Code',
  startDate: 'Start Date',
  endDate: 'End Date',
  shiftStartTime: 'Shift Start Time',
  shiftEndTime: 'Shift End Time',
  comments: 'Comments',
};

const Assignments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [tempFormData, setTempFormData] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const EmployeeId = localStorage.getItem('EmpId'); // Retrieve user role from local storage


  useEffect(() => {
   
  
    fetchAssignments();
  
    // Get fields from URL query params
    const fieldsParam = new URLSearchParams(window.location.search).get('fields');
    
    if (fieldsParam) {
      const selectedFieldNames = fieldsParam.split(',');
      const newSelectedFields = defaultFields.filter(field => selectedFieldNames.includes(field.name));
      
      // Sort the selected fields based on their position in defaultFields
      const sortedFields = newSelectedFields.sort((a, b) => 
        defaultFields.findIndex(f => f.name === a.name) - defaultFields.findIndex(f => f.name === b.name)
      );
      
      setSelectedFields(sortedFields);
      setFields(sortedFields);
    }
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`hrmsapplication/assignments/getPresentAssignments?employeeId=${EmployeeId}`);
      setRows(response.data);  // Adjust based on the structure of your response
      // toast.success("Data generated successfully!"); 
    } 
    // catch (err) {
    //   setError(err.message);
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
     finally {
      setLoading(false);
    }
  };
  const fetchPreviousAssignments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`hrmsapplication/assignments/getPreviousAssignments?employeeId=${EmployeeId}`);
      setRows(response.data);  // Adjust based on the structure of your response
      // toast.success("Data generated successfully!"); 
    } 
    // catch (err) {
    //   setError(err.message);
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
    finally {
      setLoading(false);
    }
  };
  

  const handleModalToggle = () => setIsOpen(prev => !prev);

  const validateFields = () => {
    const newErrors = {};
    fields.forEach((field, index) => {
      const value = tempFormData[index];
      if (field.required && (!value || value.length < field.min || value.length > field.max)) {
        newErrors[field.name] = `min ${field.min} and max ${field.max} characters.`;
      }

      if (field.pattern && !field.pattern.test(value)) {
        newErrors[field.name] = `${field.name} is in an invalid format.`;
      }

      if (field.name === 'endDate' && newErrors['startDate'] === undefined) {
        const startDate = new Date(tempFormData[fields.findIndex(f => f.name === 'startDate')]);
        const endDate = new Date(value);
        if (startDate >= endDate) {
          newErrors['endDate'] = 'End Date must be after Start Date.';
        }
      }
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleRowDelete = (rowIndex) => {
    console.log("Row deleted:", rows[rowIndex]);
    setRows(prev => prev.filter((_, index) => index !== rowIndex));
  };

  const handleFieldSelect = (field) => {
    const isSelected = selectedFields.find(f => f.name === field.name);
    
    // Toggle the selection
    const newSelectedFields = isSelected
      ? selectedFields.filter(f => f.name !== field.name)
      : [...selectedFields, field];
  
    // Sort the selected fields based on their position in defaultFields
    const sortedSelectedFields = newSelectedFields.sort((a, b) => 
      defaultFields.findIndex(f => f.name === a.name) - defaultFields.findIndex(f => f.name === b.name)
    );
  
    setSelectedFields(sortedSelectedFields);
  };
  

  const handleSaveSelectedFields = () => {
    // Sort selected fields before saving
    const sortedFields = selectedFields.sort((a, b) => 
      defaultFields.findIndex(f => f.name === a.name) - defaultFields.findIndex(f => f.name === b.name)
    );
    
    setFields(sortedFields);  // Update the fields state to show in sorted order
    handleModalToggle();  // Close the modal
    
    // Update the URL with the sorted fields
    const fieldsParam = sortedFields.map(field => field.name).join(',');
    const newUrl = `${window.location.pathname}?fields=${fieldsParam}`;
    window.history.replaceState({}, '', newUrl);
  };
  

  const handleModalOpen = () => {
    // Sort selected fields to ensure they appear in the same order
    const sortedSelectedFields = selectedFields.sort((a, b) => 
      defaultFields.findIndex(f => f.name === a.name) - defaultFields.findIndex(f => f.name === b.name)
    );
    
    setSelectedFields(sortedSelectedFields);
    handleModalToggle();
  };
  

  const preventInput = (e) => {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lg:p-6 md:p-6">
      {/* Previous Page Button */}
      <div>
        <NavLink 
          className="flex items-center bg-blue-950 justify-start lg:px-2 lg:py-2 md:px-2 md:py-2 overflow-x-auto border border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5"
          to='/userdashboard'
        >
          <FaLessThan className="text-white mr-1" />
          <button><span className="font-semibold text-white bg-blue-950">Previous Page</span></button>
        </NavLink>
      </div>

      {/* Home Link */}
      <NavLink className="border border-black p-2 rounded mb-4 flex items-center" to='/userdashboard'>
        <AiOutlineHome /><span className="pl-1">Home</span>
      </NavLink>

      {/* Buttons Section */}
      <div className="flex  justify-between gap-1 md:gap-2 mb-4">
        {/* Left Buttons */}
        <div className="flex  gap-1">
          <button
            onClick={fetchPreviousAssignments}
            className="text-white bg-blue-500 font-semibold py-1 px-2 lg:py-2 lg:px-4 rounded border border-black text-xs lg:text-lg md:text-lg"
          >
            Previous
          </button>
          <button
            onClick={fetchAssignments}
            className="text-white bg-blue-500 font-semibold py-1 px-2 lg:py-2 lg:px-4 rounded border border-black text-xs lg:text-lg md:text-lg"
          >
            Present
          </button>
        </div>

        {/* Right Buttons */}
        <div className="flex  gap-1">
          <button
            onClick={handleModalOpen}
            className="text-white bg-blue-500 font-semibold py-1 px-2 lg:py-2 lg:px-4 rounded border border-black text-xs lg:text-lg  md:text-lg"
          >
            Add Field
          </button>
          <button
            className="text-white bg-blue-500 font-semibold py-1 px-2 lg:py-2 lg:px-4 rounded border border-black text-xs lg:text-lg md:text-lg"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="table-auto border-collapse border border-black w-full">
          <thead>
            <tr className="bg-gray-200">
              {fields.map((field, index) => (
                <th key={index} className="border border-black p-2 text-center">
                  {labels[field.name]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map((field) => (
                  <td key={field.name} className="border border-black p-2 text-center">
                    {row[field.name] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Selecting Fields */}
      {isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="bg-orange-500 flex justify-between px-4 py-2 rounded-lg border border-black mb-4">
        <h2 className="text-sm lg:text-lg font-semibold text-center">Select Fields</h2>
        <button onClick={handleModalToggle} className="text-lg lg:text-xl font-bold text-black">
          <MdCancelPresentation />
        </button>
      </div>

      {/* Field Selection Grid */}
      <div className="grid grid-cols-2 gap-2">
        {defaultFields.map((field, index) => (
          <button 
            key={index} 
            onClick={() => handleFieldSelect(field)} 
            className={`py-1 px-2 lg:py-2 lg:px-4 rounded text-sm lg:text-base ${
              selectedFields.find(f => f.name === field.name)
                ? 'bg-orange-500 text-white'
                : 'bg-gray-300 text-black'
            }`}
          >
            {labels[field.name]}
          </button>
        ))}
      </div>

      {/* Save & Cancel Buttons */}
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleSaveSelectedFields} 
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-2 lg:py-2 lg:px-4 rounded-md mr-2 text-sm lg:text-base"
        >
          Save
        </button>
        <button 
          onClick={handleModalToggle} 
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-2 lg:py-2 lg:px-4 rounded-md text-sm lg:text-base"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>

  );
};

export default Assignments;
    