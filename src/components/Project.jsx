import React, { useState, useEffect } from "react";
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
// import axios from 'axios';
import axiosInstance from "./axiosConfig";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import AssignmentCreation from "./Assignmentcreation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Project() {
  const initialData = {
    projectName: "",
    projectCode: "",
    managerId: "",
    managerName: "",
    description: "",
    billability: "",
    billabilityLocation: "",
    client: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const userRole = localStorage.getItem("UserRole");
  const navigate = useNavigate();


  const nameRegex = /^(?!0)[a-zA-Z][a-zA-Z\s]*$/;
  const codeRegex = /^(?!0)(?!.*\/)[a-zA-Z][a-zA-Z0-9\-]*$/
    ;

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get("hrmsapplication/project/getProjects");
      setTableData(response.data);
      // toast.success("Data generated successfully!"); 
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("kindly recheck the Form");
    }
  };

  //   const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
    setFormData({ ...initialData });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.projectName) {
      formErrors.projectName = "Project Name is required";
    } else if (formData.projectName.length < 1 || formData.projectName.length > 20) {
      formErrors.projectName = "Project Name must be between 1 and 20 characters";
    } else if (!nameRegex.test(formData.projectName)) {
      formErrors.projectName = "Must start with a letter and can only include letters and spaces";
    }

    if (!formData.projectCode) {
      formErrors.projectCode = "Project Code is required";
    } else if (formData.projectCode.length < 1 || formData.projectCode.length > 20) {
      formErrors.projectCode = "Project Code must be between 1 and 20 characters";
    } else if (!codeRegex.test(formData.projectCode)) {
      formErrors.projectCode = "Invalid Project Code";
    }

    if (!formData.managerId) {
      formErrors.managerId = "Project Manager ID is required";
    }

    if (!formData.managerName) {
      formErrors.managerName = "Project Manager Name is required";
    } else if (!nameRegex.test(formData.managerName)) {
      formErrors.managerName = "Name can only contain letters and spaces";
    }

    if (!formData.billabilityLocation) {
      formErrors.billabilityLocation = "Location is Required";
    } else if (!nameRegex.test(formData.billabilityLocation)) {
      formErrors.billabilityLocation = "Name can only contain letters and spaces";
    } else if (formData.billabilityLocation.length < 1 || formData.billabilityLocation.length > 20) {
      formErrors.billabilityLocation = "Location must be between 1 and 20 characters";
    }

    if (!formData.client) {
      formErrors.client = "Client is required";
    } else if (!nameRegex.test(formData.client)) {
      formErrors.client = "Client can only contain letters and spaces";
    }

    if (!formData.description) {
      formErrors.description = "Project Description is required";
    } else if (formData.description.length > 500) {
      formErrors.description = "Max 500 Characters";
    }

    if (formData.billability === "") {
      formErrors.billability = "Choose any one";
    }

    return formErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (editIndex !== null) {
        const response = await axiosInstance.patch("hrmsapplication/project/update", formData);
        const updatedData = [...tableData];
        updatedData[editIndex] = response.data;
        setTableData(updatedData);
        // toast.success("Data updated successfully!"); 

      } else {
        const response = await axiosInstance.post("hrmsapplication/project/create", formData);
        setTableData([...tableData, response.data]);
      }
      // toast.success("Data created successfully!"); 
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
  };

  // const handleViewClick = (row) => {
  //   if (row && row.projectCode){
  //     const projectCode = row.projectCode;
  //     window.location.href = `https://hrms-application-l1e0.onrender.com/hrmsapplication/AssignmentCreation?projectCode=${projectCode}`;
  //   } else {
  //     alert('Unable to retrieve project information. Please try again.');
  //   }
  // };
  const handleViewClick = (projectCode) => {
    navigate(`/AssignmentCreation/${projectCode}`);
  };

  const handleOpenPopup = (index = null) => {
    if (index !== null) {
      setFormData({ ...tableData[index] });
      setEditIndex(index);
    } else {
      setFormData({ ...initialData });
      setEditIndex(null);
    }
    setShowPopup(true);
  };

  const handleDelete = async (index) => {
    const projectCode = tableData[index].projectCode;
    try {
      await axiosInstance.delete(`hrmsapplication/project/deleteProject/${projectCode}`);
      const updatedData = tableData.filter((_, i) => i !== index);
      setTableData(updatedData);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
    <div>
      <div className="mr-10 ml-6">
        <div className="">
          <div>
            <NavLink
              className="flex items-center justify-start p-2  bg-blue-950 overflow-x-auto border border-gray-800 rounded-md w-40  mb-5 mt-5"
              to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
            >
              <FaLessThan className="text-white mr-2" />
              <button>
                <span className="text font-semibold text-white">Previous Page</span>
              </button>
            </NavLink>

          </div>
        </div>
        <div className='border border-black p-2 bg-gray-200 rounded mb-4 flex items-center'>
          <AiOutlineHome className="text-black" /><span className='pl-1 text-black'>Home</span>
        </div>
      </div>

      <div className="pt-5 mt-5 ml-3 md:ml-20 lg:ml-40 mx-auto mr-3 md:mr-20 lg:mr-40">
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-2">
            <button
              className="p-2 cursor-pointer border border-black text-white rounded-md bg-blue-950"
              onClick={() => handleOpenPopup()}
            >
              Add New Project
            </button>
            <button className="ml-2 p-2 cursor-pointer border border-black text-white bg-blue-950 rounded-md">
              Export to Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px]">
              <thead>
                <tr>
                  <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center">Project Name</th>
                  <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center">Project Code</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project Manager Id</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project Manager Name</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project Description</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Billability</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Billability Location</th>
                  <th className="py-2 px-5 border-b-black border-2 border-solid border-black text-center">Client</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Actions</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project View</th>
                </tr>
              </thead>
              <tbody className="border border-black border-collapse overflow-y-auto max-h-60">
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.projectName}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.projectCode}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.managerId}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.managerName}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.description}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.billability}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">{row.billabilityLocation}</td>
                    <td className="py-2 px-4 border-b border-gray-900 border-r text-center">{row.client}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">
                      <div className="flex flex-row justify-center">
                        <TiPencil className="mr-2 cursor-pointer text-black-500 text-md sm:text-sm" onClick={() => handleOpenPopup(index)} />
                        {index !== 0 && (
                          <RiDeleteBin6Line className="cursor-pointer text-black-500 text-md sm:text-sm" onClick={() => handleDelete(index)} />
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 border-b border-gray-900 text-center">
                      <button
                        className="text-blue-500 font-bold"
                        onClick={() => handleViewClick(row.projectCode)}> View </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-200 p-2 sm:p-4 rounded-lg shadow-lg w-[95%] max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 bg-orange-500 p-2 rounded-t-md">
              <h2 className="text-lg text-white font-semibold">
                {editIndex !== null ? "Edit Project Details" : "Add New Project"}
              </h2>
              <MdCancelPresentation className="text-xl cursor-pointer text-white" onClick={handleClosePopup} />
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Project Name:</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.projectName && <p className="text-red-500">{errors.projectName}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Project Code:</label>
                  <input
                    type="text"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.projectCode && <p className="text-red-500">{errors.projectCode}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Project Manager Id:</label>
                  <input
                    type="text"
                    name="managerId"
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.managerId && <p className="text-red-500">{errors.managerId}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Project Manager Name:</label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.managerName && <p className="text-red-500">{errors.managerName}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Billability:</label>
                  <select
                    className="p-1 border border-gray-300 rounded-lg"
                    name="billability"
                    value={formData.billability}
                    onChange={(e) => setFormData({ ...formData, billability: e.target.value })}
                  >
                    <option value="" disabled hidden>Select any one</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.billability && <p className="text-red-500">{errors.billability}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Billability Location:</label>
                  <input
                    type="text"
                    name="billabilityLocation"
                    value={formData.billabilityLocation}
                    onChange={(e) => setFormData({ ...formData, billabilityLocation: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.billabilityLocation && <p className="text-red-500">{errors.billabilityLocation}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Client:</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.client && <p className="text-red-500">{errors.client}</p>}
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label className="text-gray-700 mb-1">Project Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-1 border border-gray-300 rounded-lg overflow-auto resize-none"
                  />
                  {errors.description && <p className="text-red-500">{errors.description}</p>}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3 mb-2">
                  Save
                </button>
                <button type="button" onClick={handleClosePopup} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-2">
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

export default Project;