import React, { useState } from "react";

import axiosInstance from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

const DialogueBox = ({ onClose, onSubmit, category, employeeId, outevent }) => {
  const [formData, setFormData] = useState({
    input2: "", // Represents the file name
    file: null, // Represents the uploaded file
  });

  // Get organizationId from localStorage
  const organizationId = localStorage.getItem("organizationId");

  // Handle input text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validation: Ensure the file is an image
    if (!file.type.startsWith("image/")) {
     
      toast.error("Please select an image file (e.g., .png, .jpg, .jpeg).");
      e.target.value = ""; // Clear the input
      return;
    }

    // Validations
    if (file.size > 2 * 1024 * 1024) { // 2 MB = 2 * 1024 * 1024...
      toast.error("file should be 2 MB.");
      e.target.value = ""; 
      return;
    }

    setFormData({ ...formData, file });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on submit

    // Validate input fields
    if (!formData.input2 || !formData.file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const url = `hrmsapplication/documents/upload?organizationId=${organizationId}&employeeId=${employeeId}&fileName=${encodeURIComponent(formData.input2)}&category=${category}`;

    const formDataToSend = new FormData();
    formDataToSend.append("file", formData.file);

    try {
      const response = await axiosInstance.post(url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Image uploaded Successfully!");
        console.log('Response Data:', response.data);
        outevent(response.data); // Call parent event handler

        onSubmit({ ...formData, category, employeeId });
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the file.");
      console.error("File upload error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Upload Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {/* Category (Read-only) */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category:
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              readOnly
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
            />
          </div>

          {/* File Name Input */}
          <div className="mb-4">
            <label
              htmlFor="input2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              File Name:
            </label>
            <input
              type="text"
              id="input2"
              name="input2"
              value={formData.input2}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter file name"
              required
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload File:
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="block w-full text-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DialogueBox;
