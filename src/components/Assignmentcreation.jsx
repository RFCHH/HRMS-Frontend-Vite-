import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdCancelPresentation } from 'react-icons/md';
import { AiOutlineHome } from "react-icons/ai";
import axiosInstance from './axiosConfig';
import { NavLink, useParams } from 'react-router-dom';
import { FaLessThan} from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

// import Project from './project'; 
const defaultFields = [
  { name: 'employeeId', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9]*$/ },
  { name: 'employeeName', type: 'text', required: true, min: 1, max: 20 },
  { name: 'employeeDesignation', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9\-/\s]*$/ },
  { name: 'projectCode', type: 'text', required: true, min: 1, max: 20, pattern: /^(?!0)(?!.*\/)[a-zA-Z][a-zA-Z0-9\-]*$/ },
  { name: 'startDate', type: 'date', required: true },
  { name: 'endDate', type: 'date', required: true },
  { name: 'shiftStartTime', type: 'time', required: true }, 
  { name: 'shiftEndTime', type: 'time', required: true },
  // { name: 'bilabilityLocation', type: 'text', required: true, min: 1, max: 20 },
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
  bilabilityLocation: 'Location',
  comments: 'Comments',
};

const AssignmentCreation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelloPopupOpen, setIsHelloPopupOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [tempFormData, setTempFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [errors, setErrors] = useState({});
  const { projectCode } = useParams();
  console.log('Project Code:', projectCode);

  useEffect(() => {
    const fetchAssignments = async (projectCode) => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/assignments/getAssignments/${projectCode}`);
        const formattedRows = response.data.map(item => ({
          id: item.id,
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          employeeDesignation: item.employeeDesignation,
          projectCode: item.projectCode,
          startDate: item.startDate,
          endDate: item.endDate,
          shiftStartTime: item.shiftStartTime,
          shiftEndTime: item.shiftEndTime,
          comments: item.comments,
        }));
        setRows(formattedRows);
        toast.success("Data generated successfully!"); 
      } catch (error) {
        console.error('Error fetching assignments:', error.message);
        // alert('Failed to fetch assignments. Please check your network connection and try again.');
        toast.error("kindly recheck the Form");
      }
    };
    
    // Use projectCode from URL params or localStorage if not found
    if (!projectCode) {
      const storedProjectCode = localStorage.getItem('projectCode');
      if (storedProjectCode) {
        fetchAssignments(storedProjectCode);
      } else {
        alert("Project Code is missing in the URL.");
        return;
      }
    } else {
      // localStorage.setItem('projectCode', projectCode);
      fetchAssignments(projectCode);
    }

    const fieldsParam = new URLSearchParams(window.location.search).get('fields');
  
    if (fieldsParam) {
      const selectedFieldNames = fieldsParam.split(',');
      const newSelectedFields = defaultFields.filter(field => selectedFieldNames.includes(field.name));
      setSelectedFields(newSelectedFields);
      setFields(newSelectedFields);
    }
  }, [projectCode]);
  
  
  


  const handleModalToggle = () => setIsOpen(prev => !prev);
  const handleHelloPopupToggle = () => {
    setIsHelloPopupOpen(prev => !prev);
    if (isHelloPopupOpen) {
      setTempFormData(new Array(fields.length).fill(''));
      setEditIndex(null);
      setErrors({});
    }
  };

  const handleFieldChange = (value, index) => {
    const trimmedValue = value.replace(/^\s+/, '');
    const newTempFormData = [...tempFormData];
    newTempFormData[index] = trimmedValue;
    setTempFormData(newTempFormData);
  };

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRowSave = async () => {
    if (validateFields()) {
        const newRow = tempFormData.reduce((acc, val, i) => ({ ...acc, [fields[i].name]: val }), {});

        try {
            let response;

            if (editIndex !== null) {
                const updateData = { id: rows[editIndex].id, ...newRow };
                console.log("Updating row with data:", updateData);
                response = await axiosInstance.patch(
                    `hrmsapplication/assignments/update`,
                    updateData
                );

                console.log("PATCH Response Data:", response.data);
                toast.success("Data updated successfully!");

                // Update rows with the edited data
                setRows(prev => {
                    const updatedRows = [...prev];
                    updatedRows[editIndex] = { ...updatedRows[editIndex], ...newRow }; 
                    return updatedRows;
                });
            } else {
                response = await axiosInstance.post(
                    'hrmsapplication/assignments/create',
                    newRow
                );
                toast.success("Data created successfully!"); 
                console.log("POST Response Data:", response.data);
                // Append the new row to the existing rows
                setRows(prev => [...prev, { ...newRow, id: response.data.id }]);
            }

            setTempFormData(new Array(fields.length).fill(''));
            handleHelloPopupToggle();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "There was an error saving the row. Please try again.";
            console.error("Error saving assignment:", errorMessage);
            toast.error("kindly recheck the Form");
    
        }
    } else {
        console.log("Field validation failed.");
        alert("Please fill in all required fields correctly.");
    }
};


  const handleRowDelete = async (rowIndex) => {
    const id = rows[rowIndex].id; 
    try {
      await axiosInstance.delete(`hrmsapplication/assignments/deleteAssignment/${id}`);
      setRows(prev => prev.filter((_, index) => index !== rowIndex));
      console.log("Row deleted successfully");
      toast.success("Data Deleted successfully!"); 

    } catch (error) {
      console.error("Error deleting assignment:", error.response?.data || error.message);
      // alert("There was an error deleting the row. Please try again.");
      toast.error("kindly recheck the Form");
    }
  };

  const handleFieldSelect = (field) => {
    const isSelected = selectedFields.find(f => f.name === field.name);
    let newSelectedFields;

    if (isSelected) {
        // Remove the field from the selectedFields array
        newSelectedFields = selectedFields.filter(f => f.name !== field.name);
    } else {
        // Add the field to the selectedFields array at the end
        newSelectedFields = [...selectedFields, field];
    }

    // Sort selected fields based on the order in defaultFields
    newSelectedFields.sort((a, b) => 
        defaultFields.findIndex(f => f.name === a.name) - defaultFields.findIndex(f => f.name === b.name)
    );

    setSelectedFields(newSelectedFields);
};

  

const handleSaveSelectedFields = () => {
  // Sort selected fields before saving
  const sortedFields = selectedFields.sort((a, b) => 
      defaultFields.findIndex(f => f.name === a.name) - defaultFields.findIndex(f => f.name === b.name)
  );
  setFields(sortedFields);  // Update the fields state to show in sorted order
  handleModalToggle(); // Close the modal

  // Update the URL with the sorted fields
  const fieldsParam = sortedFields.map(field => field.name).join(',');
  const newUrl = `${window.location.pathname}?fields=${fieldsParam}`;
  window.history.replaceState({}, '', newUrl);
};


const handleModalOpen = () => {
  // Sort selected fields to ensure they appear in the same order as in defaultFields
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

  return (
    <div className="p-6">
    
      <div className='border border-black p-2 rounded mb-4 flex items-center'>
        <AiOutlineHome /><span className='pl-1'>Home</span>
      </div>
      <div>
      <NavLink className="flex items-center justify-start p-2 bg-blue-950 overflow-x-auto border border-gray-800 rounded-md w-40  mb-5 mt-5" to='/projects' >
        <FaLessThan className="text-white mr-2" />
        <button><span className="text font-semibold text-white">Previous Page</span></button>
      </NavLink>
      </div>
      <div className="mb-4 flex justify-end">
        <button onClick={handleModalOpen} className="text-white bg-blue-950 font-semibold py-2 px-4 rounded border border-black">
          Add Field
        </button>
        <button className="text-white bg-blue-950 font-semibold py-2 px-4 mx-2 rounded border border-black">
          Export to Excel
        </button>
      </div>
   
      <div className='overflow-auto'>
      <table className="table-auto border-collapse border border-black w-full">
      <thead>
  <tr>
    <th colSpan={fields.length + 1} className="border border-black p-2 text-right">
      <button className="bg-green-600 text-white py-1 px-4 rounded" onClick={handleHelloPopupToggle}>
        Add
      </button>
    </th>
  </tr>
  <tr className="bg-gray-200">
    {fields.map((field, index) => (
      <th key={index} className="border border-black p-2 text-center">
        {labels[field.name]}
      </th>
    ))}
    {fields.length > 0 && <th className="border border-black p-2 text-center">Actions</th>}
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
      {fields.length > 0 && (
        <td className="border border-black p-2 text-center">
          <span onClick={() => { 
              setTempFormData(fields.map(field => row[field.name] || '')); 
              setEditIndex(rowIndex); 
              handleHelloPopupToggle(); 
          }} className="inline-block mr-2 cursor-pointer">
            <TiPencil />
          </span>
          <span onClick={() => handleRowDelete(rowIndex)} className="inline-block mr-2 cursor-pointer">
            <RiDeleteBin6Line />
          </span>
        </td>
      )}
    </tr>
  ))}
</tbody>

      </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className='bg-blue-950 text-white flex justify-between px-4 py-2 rounded-lg border border-black mb-4'>
              <h2 className="text-lg font-semibold text-center">Select Fields</h2>
              <button onClick={handleModalToggle} className="text-xl font-bold text-white">
                <MdCancelPresentation />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {defaultFields.map((field, index) => (
                <button 
                  key={index} 
                  onClick={() => handleFieldSelect(field)} 
                  className={`py-2 px-4 rounded ${selectedFields.find(f => f.name === field.name) ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                  {labels[field.name]}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleSaveSelectedFields} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-md mr-2">
                Save
              </button>
              <button onClick={handleModalToggle} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{isHelloPopupOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:max-w-4xl mx-2 max-h-[80vh] overflow-y-auto">
      <div className="bg-blue-950 text-white flex justify-between px-4 py-2 rounded-lg border border-black mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-center">
          {editIndex !== null ? 'Edit' : 'Add Fields'}
        </h2>
        <button onClick={handleHelloPopupToggle} className="text-lg sm:text-xl font-bold text-white">
          <MdCancelPresentation />
        </button>
      </div>
      
      <form className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {fields.map((field, index) => (
          <div key={index} className="col-span-1">
            <label className="block text-black font-medium text-sm sm:text-base">
              {labels[field.name]}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={tempFormData[index] || ''}
                onChange={e => handleFieldChange(e.target.value, index)}
                className={`mt-1 p-2 block w-full border border-black rounded-md h-32 ${
                  errors[field.name] ? 'border-red-500' : ''
                } text-sm sm:text-base`}
              />
            ) : field.type === 'date' || field.type === 'time' ? (
              <input
                type={field.type}
                value={tempFormData[index] || ''}
                onKeyDown={preventInput}
                onChange={e => handleFieldChange(e.target.value, index)}
                className={`mt-1 p-2 block w-full border border-black rounded-md ${
                  errors[field.name] ? 'border-red-500' : ''
                } text-sm sm:text-base`}
              />
            ) : (
              <input
                type={field.type}
                value={tempFormData[index] || ''}
                onChange={e => handleFieldChange(e.target.value, index)}
                className={`mt-1 p-2 block w-full border border-black rounded-md ${
                  errors[field.name] ? 'border-red-500' : ''
                } text-sm sm:text-base`}
              />
            )}
            {errors[field.name] && <span className="text-red-500 text-xs sm:text-sm">{errors[field.name]}</span>}
          </div>
        ))}
      </form>

      <div className="flex justify-end space-x-2 mt-4">
        <button 
          type="button" 
          onClick={handleRowSave} 
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base"
        >
          Save
        </button>
        <button 
          type="button" 
          onClick={handleHelloPopupToggle} 
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base"
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

export default AssignmentCreation;
