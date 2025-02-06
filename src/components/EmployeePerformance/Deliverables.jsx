import React, { useState, useEffect } from 'react';
import { FaLessThan} from "react-icons/fa";
import { AiTwotoneHome, AiOutlineDownload } from "react-icons/ai";
import { MdAddCircle, MdCancel, MdEdit, MdDelete } from "react-icons/md";
import axiosInstance from '../axiosConfig';
import { useParams ,NavLink,useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PerformanceAndDeliverables = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddPerformanceOpen, setIsAddPerformanceOpen] = useState(false);
  const [isAddDeliverableOpen, setIsAddDeliverableOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { employeeId: employeeIdFromParams } = useParams(); 
  const employeeId = employeeIdFromParams || localStorage.getItem('EmpId');
  const userRole = localStorage.getItem('UserRole');
  const ROLE_EMPLOYEE = 'ROLE_EMPLOYEE';
  const ROLE_HR = 'ROLE_HR';
  const ROLE_MANAGER = 'ROLE_MANAGER';
  const MangerId  = localStorage.getItem('EmpId')
  const loggedUSer = localStorage.getItem('EmpId')

  const location = useLocation();
  const fromReportees = location.state?.fromReportees || false;
  const isButtonDisabled = 
  userRole === ROLE_EMPLOYEE || 
  (!fromReportees && (userRole === ROLE_MANAGER || userRole === ROLE_HR));

  // const { employeeId } = useParams(); // Employee ID from params
  const [performanceData, setPerformanceData] = useState({
    employeeId: employeeId || "",
    managerId: MangerId || "",
    performanceId: "",
    comments: "",
  });

  const [deliverableData, setDeliverableData] = useState({
    id:"",
    employeeId: employeeId || "",
    performanceId: "",
    deliverableTitle: "",
    description: "",
    measurementCriteria: "",
    expectedCompletedDate: "",
    status: "INPROGRESS",
  });

  const [performanceIds, setPerformanceIds] = useState([]);
  const [submittedDeliverables, setSubmittedDeliverables] = useState([]);
  const [selectedPerformance, setSelectedPerformance] = useState("");
  const [commentsMap, setCommentsMap] = useState({});

  // Fetch performance IDs based on employeeId
  useEffect(() => {
    if (employeeId) {
      const fetchPerformanceIds = async () => {
        try {
          const response = await axiosInstance.get(
            `hrmsapplication/employeePerformance/${employeeId}/performance-ids`
          );
          if (response.status === 200) {
            setPerformanceIds(response.data); // Assuming response data contains an array of performance IDs
          } else {
            console.error('Failed to fetch performance IDs');
          }
        } 
        // catch (error) {
        //   console.error('Error fetching performance IDs:', error);
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

      fetchPerformanceIds();
    }
    console.log(selectedPerformance);
    console.log(employeeId);
    console.log(performanceData.managerId);
    console.log(loggedUSer)
    
    
  }, [employeeId,selectedPerformance,performanceData]);

  // Fetch performance data when performanceId is selected
  useEffect(() => {
    if (selectedPerformance) {
      const fetchPerformanceData = async () => {
        try {
          const response = await axiosInstance.get(
            `hrmsapplication/employeePerformance/getEmployeePerformance?employeeId=${employeeId}&performanceId=${selectedPerformance}`
          );
          if (response.status === 200) {
            const data = response.data;
            setPerformanceData({
              employeeId: data.employeeId,
              managerId: data.managerId,
              performanceId: data.performanceId,
              comments: data.comments,
            });

            setSubmittedDeliverables(data.deliverables || []);

            setCommentsMap(prev => ({
              ...prev,
              [selectedPerformance]: data.comments,
            }));
          } else {
            console.error('Failed to fetch performance data');
          }
        } 
        // catch (error) {
        //   console.error('Error fetching performance data:', error);
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

      fetchPerformanceData();
    }
  }, [selectedPerformance, employeeId]);

  const handleDeletePerformance = async (performanceId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete performance ID: ${performanceId}?`);
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(
        `hrmsapplication/employeePerformance/deleteEmployeePerformance/${employeeId}?performanceId=${performanceId}`
      );

      if (response.status === 200) {
        // Remove the deleted performance ID from the list
        setPerformanceIds(performanceIds.filter(id => id !== performanceId));
        alert('Performance deleted successfully!');
      } else {
        alert('Failed to delete performance');
      }
    } catch (error) {
      console.error('Error deleting performance:', error);
      // alert('Error deleting performance');
      toast.error("kindly recheck the Form");
    }
  };
  const handlePerformanceChange = (e) => {
    const { name, value } = e.target;
    setPerformanceData({
      ...performanceData,
      [name]: value,
    });
  };

  const handlePerformanceSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending the correct structure for POST request
      const response = await axiosInstance.post(
        `hrmsapplication/employeePerformance/create`,
        {
          employeeId: performanceData.employeeId,
          managerId: performanceData.managerId,
          performanceId: performanceData.performanceId,
          comments: performanceData.comments
        }
      );

      if (response.status === 200) {
        setPerformanceIds([...performanceIds, performanceData.performanceId]);
        setCommentsMap(prevCommentsMap => ({
          ...prevCommentsMap,
          [performanceData.performanceId]: performanceData.comments
        }));

        setPerformanceData({
          employeeId: employeeId || "",
          managerId: "",
          performanceId: "",
          comments: "",
        });

        setIsAddPerformanceOpen(false);
        alert("Performance data successfully submitted!");
      } else {
        alert("Failed to submit performance data");
      }
    } 
    // catch (error) {
    //   console.error("Error submitting performance data", error);
    //   // alert("Error submitting performance data");
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

  const handleEditComments = async () => {
    // PATCH call to update the comments for selected performance
    try {
      const response = await axiosInstance.patch(
        `hrmsapplication/employeePerformance/updateEmployeePerformance`,
        {
          employeeId: performanceData.employeeId,
          managerId: performanceData.managerId,
          performanceId: selectedPerformance,
          comments: performanceData.comments
        }
      );

      if (response.status === 200) {
        setCommentsMap((prev) => ({
          ...prev,
          [selectedPerformance]: performanceData.comments,
        }));
        alert("Comments updated successfully!");
      } else {
        alert("Failed to update comments");
      }
    } 
    // catch (error) {
    //   console.error("Error updating comments:", error);
    //   // alert("Error updating comments");
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

  const handleDeliverableChange = (e) => {
    const { name, value } = e.target;
    setDeliverableData({
      ...deliverableData,
      [name]: value,
    });
  };

  const handleDeliverableSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (editIndex !== null) {
        // Handle the update of an existing deliverable
        await handleUpdateDeliverable();
      } else {
        // Handle the creation of a new deliverable
        const response = await axiosInstance.post(
          `hrmsapplication/deliverable/createDeliverable`,
          deliverableData
        );
  
        if (response.status === 200) {
          // const newDeliverable = { ...response.data, id: response.data.id };
          setSubmittedDeliverables([...submittedDeliverables, response.data]);
          setDeliverableData({
         
            employeeId: employeeId || "",
            performanceId: selectedPerformance || "",
            deliverableTitle: "",
            description: "",
            measurementCriteria: "",
            expectedCompletedDate: "",
            status: "INPROGRESS",
          });
          setIsAddDeliverableOpen(false);
          alert("Deliverable successfully submitted!");
        } else {
          alert("Failed to submit deliverable");
        }
      }
    } 
    // catch (error) {
    //   console.error("Error submitting deliverable", error);
    //   alert("Error submitting deliverable");
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
  
  const handleEdit = (index) => {
    setDeliverableData(submittedDeliverables[index]);
    setEditIndex(index);
    setIsAddDeliverableOpen(true);
  };

 

  const handleAddNewDeliverable = () => {
    setDeliverableData({
      employeeId: employeeId || "",
      performanceId: selectedPerformance || "",
      deliverableTitle: "",
      description: "",
      measurementCriteria: "",
      expectedCompletedDate: "",
      status: "INPROGRESS",
    });
    setIsAddDeliverableOpen(true);
    setEditIndex(null);
  };
  const handleUpdateDeliverable = async () => {
    try {
      const response = await axiosInstance.patch(
        `hrmsapplication/deliverable/updateDeliverable`,
        deliverableData
      );
  
      if (response.status === 200) {
        const updatedDeliverables = [...submittedDeliverables];
        updatedDeliverables[editIndex] = response.data; 
        setSubmittedDeliverables(updatedDeliverables);
  
        setDeliverableData({
          employeeId: employeeId || "",
          performanceId: selectedPerformance || "",
          deliverableTitle: "",
          description: "",
          measurementCriteria: "",
          expectedCompletedDate: "",
          status: "INPROGRESS",
        });
        setIsAddDeliverableOpen(false);
        setEditIndex(null);
        alert("Deliverable successfully updated!");
      } else {
        alert("Failed to update deliverable");
      }
    } 
    // catch (error) {
    //   console.error("Error updating deliverable", error);
    //   // alert("Error updating deliverable");
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
  
  
  const handleDeleteDeliverable = async (Id, index) => {
    const confirmed = window.confirm("Are you sure you want to delete this deliverable?");
    if (!confirmed) return;
  
    try {
      const response = await axiosInstance.delete(
        `hrmsapplication/deliverable/${Id}`
      );
  
      if (response.status === 200) {
        const updatedDeliverables = [...submittedDeliverables];
        updatedDeliverables.splice(index, 1); // Remove the deliverable from the list
        setSubmittedDeliverables(updatedDeliverables);
  
        alert("Deliverable successfully deleted!");
      } else {
        alert("Failed to delete deliverable");
      }
    } 
    // catch (error) {
    //   console.error("Error deleting deliverable", error);
    
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
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  return (

    <>
       
      <NavLink
           to={'/userdashboard' }           
            className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-white mr-2" />
          <button >
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </NavLink>
  

<div className="w-full lg:w-10/12 xl:w-9/12 mx-auto mt-2 bg-white rounded-md border border-black/90 shadow-md p-4">
  <div className="flex justify-between items-center">
    {/* Left section with the home icon */}
    <div className="flex items-center">
      <AiTwotoneHome size={20} className="mr-2" />
      <span className="font-semibold text-gray-700">Dashboard</span> {/* Optional label next to the home icon */}
    </div>

    {/* Right section with buttons */}
    <div className="flex gap-4 items-center"> 
      {/* Export to Excel button */}
      <button className="flex items-center px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-orange-500 transition duration-300">
        <AiOutlineDownload className="mr-2 text-white" />
        Export to Excel
      </button>

      {/* Conditional NavLink (only for non-ROLE_EMPLOYEE users) */}
      {userRole !== 'ROLE_EMPLOYEE' && (
       <NavLink
       to={{
         pathname: '/employeePerformance',
         state: { fromReportees: true },  // Pass a state to track if coming from My Reportees
       }}
       className="flex items-center px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-orange-500 transition duration-300"
     >
       {/* <FaLessThan className="mr-2 text-white" /> */}
       <span className="font-semibold"> See My Reportees</span>
     </NavLink>
      )}
    </div>
  </div>
</div>

    <div className="max-w-4xl mx-auto mt-6">
      {/* Performance Creation Form */}
      {!isAddPerformanceOpen ? (
        <div className="flex justify-center mb-6">
           {!isButtonDisabled && (
              <button
                className="bg-blue-950 text-white px-6 py-3 rounded-md flex items-center"
                onClick={() => setIsAddPerformanceOpen(true)}
              >
                <MdAddCircle className="mr-2 text-orange-500" /> Add Performance
              </button>
            )}
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center bg-blue-950 p-3 rounded-t-lg">
              <h2 className="text-xl font-semibold text-white">Add Performance</h2>
              <MdCancel className="text-2xl cursor-pointer text-white" onClick={() => setIsAddPerformanceOpen(false)} />
            </div>
            <form onSubmit={handlePerformanceSubmit} className="space-y-4">
              <div>
                <label className="block">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  className="w-full p-2 border rounded-md"
                  value={performanceData.employeeId}
                  readOnly
                  onChange={handlePerformanceChange}
                  required
                />
              </div>
              <div>
                <label className="block">Manager ID</label>
                <input
                  type="text"
                  name="managerId"
                  className="w-full p-2 border rounded-md"
                  value={performanceData.managerId}
                  onChange={handlePerformanceChange}
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block">Performance ID</label>
                <input
                  type="text"
                  name="performanceId"
                  className="w-full p-2 border rounded-md"
                  value={performanceData.performanceId}
                  onChange={handlePerformanceChange}
                  required
                />
              </div>
              <div>
                <label className="block">Comments</label>
                <textarea
                  name="comments"
                  className="w-full p-2 border rounded-md"
                  value={performanceData.comments}
                  onChange={handlePerformanceChange}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => setIsAddPerformanceOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Performance Dropdown */}
      <div className="mb-6 relative">
      <label htmlFor="performanceDropdown" className="text-lg font-semibold mb-2">
         Performance
      </label>

      {/* Custom Dropdown */}
      <div
        className="w-full p-2 border rounded-md bg-white cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedPerformance ? selectedPerformance : 'Select Performance from Dropdown >'}
      </div>

      {isDropdownOpen && (
        <ul className="absolute w-full mt-2 border rounded-md bg-white z-10">
          {performanceIds.length > 0 ? (
            performanceIds.map((performanceId) => (
              <li
                key={performanceId}
                className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedPerformance(performanceId);
                  setIsDropdownOpen(false);
                }}
              >
                <span>{performanceId}</span>
                {/* <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown from closing
                    handleDeletePerformance(performanceId);
                  }}
                >
                  <MdDelete size={20} />
                </button> */}
              </li>
            ))
          ) : (
            <li className="p-2 text-center">No performances available</li>
          )}
        </ul>
      )}
    </div>
 
      {selectedPerformance && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Comments for Performance {selectedPerformance}</h3>
          <textarea
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
            readOnly={(loggedUSer !== performanceData.managerId)}
            value={performanceData.comments || commentsMap[selectedPerformance] || ""}
            onChange={(e) =>
              setPerformanceData({ ...performanceData, comments: e.target.value })
            }
          />
          {(loggedUSer === performanceData.managerId)&&(
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-950 text-white px-4 py-2 rounded-md"
              onClick={handleEditComments}
            >
              Save Comments
            </button>
          </div>
          )}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Deliverables</h4>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border border-gray-300">Title</th>
                    <th className="px-4 py-2 border border-gray-300">Description</th>
                    <th className="px-4 py-2 border border-gray-300">Measurement Criteria</th>
                    <th className="px-4 py-2 border border-gray-300">Expected Completion Date</th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>
                  {(loggedUSer !== performanceData.managerId)&&( <th className="px-4 py-2 border border-gray-300">Actions</th>)}
                  </tr>
                </thead>
                <tbody>
                  {submittedDeliverables.map((deliverable, index) => (
                    <tr key={deliverable.id}>
                      <td className="px-4 py-2 border border-gray-300">{deliverable.deliverableTitle}</td>
                      <td className="px-4 py-2 border border-gray-300">{deliverable.description}</td>
                      <td className="px-4 py-2 border border-gray-300">{deliverable.measurementCriteria}</td>
                      <td className="px-4 py-2 border border-gray-300">{deliverable.expectedCompletedDate}</td>
                      <td className="px-4 py-2 border border-gray-300">{deliverable.status}</td>
                      {(loggedUSer !== performanceData.managerId)&&( <td className="px-4 py-2 border border-gray-300 flex space-x-2">
                      <MdEdit
    className={`text-blue-500 ${deliverable.status === 'Completed' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={() => {
      if (deliverable.status !== 'Completed') {
        handleEdit(index);
      }
    }}
  />
                        <MdDelete
    className={`text-red-500 ${deliverable.status === 'Completed' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={() => {
      if (deliverable.status !== 'Completed') {
        handleDeleteDeliverable(deliverable.id, index);
      }
    }}
  />                      </td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!isAddDeliverableOpen ? (
            <div className="flex justify-center mb-6">
{(loggedUSer !== performanceData.managerId)&&(
                <button
                className="bg-blue-950 text-white px-6 py-3 rounded-md flex items-center"
                onClick={handleAddNewDeliverable}
              >
                <MdAddCircle className="mr-2 text-orange-500" /> Add Deliverable
              </button>
        )}      
              
            </div>
          ) : (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <div className="flex justify-between items-center bg-blue-950 p-3 rounded-t-lg">
        <h2 className="text-xl font-semibold text-white">Add Deliverable</h2>
        <MdCancel className="text-2xl cursor-pointer text-white" onClick={() => setIsAddDeliverableOpen(false)} />
      </div>
      <form onSubmit={handleDeliverableSubmit} className="mt-4">
        <div className="grid grid-cols-2 gap-4"> 
          <div className="mb-4">
            <label htmlFor="employeeId" className="block font-medium">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={deliverableData.employeeId}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="performanceId" className="block font-medium">Performance ID</label>
            <input
              type="text"
              id="performanceId"
              name="performanceId"
              value={deliverableData.performanceId}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deliverableTitle" className="block font-medium">Deliverable Title</label>
            <input
              type="text"
              id="deliverableTitle"
              name="deliverableTitle"
              value={deliverableData.deliverableTitle}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={deliverableData.description}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="measurementCriteria" className="block font-medium">Measurement Criteria</label>
            <input
              type="text"
              id="measurementCriteria"
              name="measurementCriteria"
              value={deliverableData.measurementCriteria}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expectedCompletedDate" className="block font-medium">Expected Completion Date</label>
            <input
              type="date"
              id="expectedCompletedDate"
              name="expectedCompletedDate"
              value={deliverableData.expectedCompletedDate}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block font-medium">Status</label>
            <select
              id="status"
              name="status"
              value={deliverableData.status}
              onChange={handleDeliverableChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="INPROGRESS">INPROGRESS</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
            onClick={() => setIsAddDeliverableOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>

          )}
        </div>
      )}
    </div>
    </>
  );
};

export default PerformanceAndDeliverables;