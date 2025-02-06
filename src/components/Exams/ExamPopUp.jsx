import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
const CreateExamDetailsPopUp = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    examName: '',
    startDate: '',
    endDate: '',
    duration: 0,
    maxAttempts: 0,
    passPercentage:'',
    departmentId: [],
  });

  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [errors, setErrors] = useState({}); // State to hold error messages

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('hrmsapplication/department/getAllDepartments');
        setAvailableDepartments(response.data);
      } 
      catch (error) {
        console.error("Error updating the job:", error);
  
        // Extract error details
        let errorMessage = "Failed to update the job. Please try again.";
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
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDepartment = () => {
    if (selectedDepartment && !formData.departmentId.includes(selectedDepartment)) {
      setFormData({
        ...formData,
        departmentId: [...formData.departmentId, selectedDepartment],
      });
      setSelectedDepartment('');
    }
  };

  const handleRemoveDepartment = (departmentToRemove) => {
    setFormData({
      ...formData,
      departmentId: formData.departmentId.filter((id) => id !== departmentToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Validate required fields
    if (!formData.examName) newErrors.examName = 'Exam Name is required.';
    if (!formData.startDate) newErrors.startDate = 'Start Date is required.';
    if (!formData.endDate) newErrors.endDate = 'End Date is required.';
    
    // Validate duration (must be positive)
    if (formData.duration <= 0) newErrors.duration = 'Duration must be a positive number.';
  
    // Validate passPercentage
    if (formData.passPercentage <= 0) {
      newErrors.passPercentage = 'Percentage should not be less than or equal to 0.';
    } else if (!formData.passPercentage) {
      newErrors.passPercentage = 'Percentage is required.';
    }
  
    // Validate maxAttempts
    if (formData.maxAttempts === '-') {
      newErrors.maxAttempts = '- values not allowed.';
    } else if (formData.maxAttempts <= 0) {
      newErrors.maxAttempts = 'Max Attempts must be a positive number.';
    }
  
    // Validate department selection
    if (formData.departmentId.length === 0) newErrors.departmentId = 'At least one department must be selected.';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if validation fails
    }

    try {
      if (initialData) {
        await axiosInstance.patch('hrmsapplication/exam/update', {
          ...formData,
          examId: initialData.examId,
        });
        onSave(formData);
      } else {
        const response = await axiosInstance.post('hrmsapplication/exam/create', formData);
        onSave(response.data);
      }
    } 
    catch (error) {
      console.error("Error updating the job:", error);

      // Extract error details
      let errorMessage = "Failed to update the job. Please try again.";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
  <div className="bg-white rounded shadow-lg p-6 w-full sm:w-4/6 max-h-[90vh] overflow-y-auto sm:overflow-visible">
    <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit Exam Details' : 'Add Exam Details'}</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4"> 
        {/* Exam Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
          <input
            type="text"
            name="examName"
            value={formData.examName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.examName && <div className="text-red-500 text-sm mt-1">{errors.examName}</div>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.startDate && <div className="text-red-500 text-sm mt-1">{errors.startDate}</div>}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.endDate && <div className="text-red-500 text-sm mt-1">{errors.endDate}</div>}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (in minutes)</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.duration && <div className="text-red-500 text-sm mt-1">{errors.duration}</div>}
        </div>

        {/* Max Attempts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
          <input
            type="text"
            name="maxAttempts"
            value={formData.maxAttempts}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.maxAttempts && <div className="text-red-500 text-sm mt-1">{errors.maxAttempts}</div>}
        </div>

        {/* Pass Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pass Percentage</label>
          <input
            type="text"
            name="passPercentage"
            value={formData.passPercentage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.passPercentage && <div className="text-red-500 text-sm mt-1">{errors.passPercentage}</div>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <div className="flex items-center space-x-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>Select a department</option>
              {availableDepartments.map((dept) => (
                <option key={dept.id} value={dept.departmentId}>
                  {dept.departmentId}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddDepartment}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              +
            </button>
          </div>
          {errors.departmentId && <div className="text-red-500 text-sm mt-1">{errors.departmentId}</div>}
        </div>

      {/* List of Selected Departments */}
      <div className="mt-2">
        {formData.departmentId.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {formData.departmentId.map((deptId, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded w-full">
                <span>{availableDepartments.find((dept) => dept.id === deptId)?.departmentName || deptId}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDepartment(deptId)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default CreateExamDetailsPopUp;
