// import React, { useEffect, useState } from "react";
// import { FaRegWindowClose, FaLessThan } from "react-icons/fa";
// import axiosInstance from "./axiosConfig";
// import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { TiPencil } from "react-icons/ti";

// const ExperienceCard = () => {
//   const { employeeId } = useParams();
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false); 
//   const [designationOptions, setDesignationOptions] = useState([]);
//   const [formData, setFormData] = useState({
//     organisationName: "",
//     employeeName: "",
//     employeeId: "",
//     designation: "",
//     doj: "",
//     reportingManagerId: "",
//     reportingManager: "",
//     pay: "",
//     departmentId: "",
//     departmentName: "",
//     hrId: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [tableData, setTableData] = useState({});
//   const userRole = localStorage.getItem("UserRole");
//   const [managers, setManagers] = useState([]);
//   const [hrIds, setHrIds] = useState([]);
//   const [departmentIds, setDepartmentIds] = useState([]);



//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       try {
//         const response = await axiosInstance.get(
//           `hrmsapplication/currentexperience/getEmployeeDetails/${employeeId}`
//         );

//         const data = response.data;

//         setFormData({
//           organisationName: data.organizationName || "",
//           employeeName: data.employeeName || "",
//           employeeId: data.employeeId || "",
//           designation: data.designation || "",
//           doj: data.doj || "", 
//           reportingManagerId: data.reportingManagerId || "",
//           reportingManager: data.reportingManager || "",
//           pay: data.pay || "",
//           departmentId: data.departmentId || "",
//           departmentName: data.departmentName || "",
//           hrId: data.hrId || "",
//         });
//       } catch (error) {
//         console.error("Error fetching employee details:", error);
//       }
//     };

//     fetchEmployeeDetails();
//   }, [employeeId]);


//   useEffect(() => {
//     const fetchReportingManagers = async () => {
//       try {
//         const response = await axiosInstance.get(
//           "hrmsapplication/currentexperience/getUserRoleManager"
//         );
//         setManagers(response.data || []); 
//       } catch (error) {
//         console.error("Error fetching reporting managers:", error);
//       }
//     };

//     fetchReportingManagers(); 
//   }, []); 

//   useEffect(() => {
//     const fetchHrIds = async () => {
//       try {
//         const response = await axiosInstance.get(
//           "hrmsapplication/currentexperience/getUserRoleHr"
//         );
//         setHrIds(response.data || []); 
//       } catch (error) {
//         console.error("Error fetching HR IDs:", error);
//       }
//     };

//     fetchHrIds(); 
//   }, []);
//   const handleHrIdChange = (e) => {
//     const selectedHrId = e.target.value;
//     setFormData({ ...formData, hrId: selectedHrId }); 
//   };

//   const handleReportingManagerChange = (e) => {
//     const selectedManagerId = e.target.value;
//     setFormData({ ...formData, reportingManagerId: selectedManagerId }); 
//   };

//   useEffect(() => {
//     const fetchDesignations = async () => {
//       try {
//         const response = await axiosInstance.get('hrmsapplication/designations/getAllDesignations');
//         setDesignationOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching designations:', error);
//       }
//     };

//     fetchDesignations();
//   }, []);  

//   const fetchCurrentDetails = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `hrmsapplication/currentexperience/${employeeId}`
//       );
//       const data = response.data;
//       setTableData(data);
//       setFormData({
//         organisationName: data.organisationName,
//         employeeName: data.employeeName,
//         employeeId: data.employeeId,
//         designation: data.designation,
//         doj: data.doj,
//         reportingManagerId: data.reportingManagerId,
//         reportingManager: data.reportingManager,
//         pay: data.pay,
//         departmentId: data.departmentId,
//         departmentName: data.departmentName,
//         hrId: data.hrId,
//       });
//       console.log("Fetched data:", data);
//     } catch (error) {
//       console.error("Error fetching Current Experience Details:", error);
//     }
//   };
//   useEffect(() => {
//     fetchCurrentDetails();
//   }, [employeeId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setFormErrors({ ...formErrors, [name]: "" });
//   };

//   const handleDesignationChange = (e) => {
//     setFormData({ ...formData, designation: e.target.value });
//     setFormErrors({ ...formErrors, designation: "" });
//   };
//   useEffect(() => {
//     const fetchDepartmentIds = async () => {
//       try {
//         const response = await axiosInstance.get(
//           "hrmsapplication/department/getAllDepartmentIds" 
//         );
//         setDepartmentIds(response.data || []); 
//       } catch (error) {
//         console.error("Error fetching Department IDs:", error);
//       }
//     };

//     fetchDepartmentIds(); 
//   }, []);
//   const handleDepartmentIdChange = (e) => {
//     const selectedDepartmentId = e.target.value;
//     setFormData({ ...formData, departmentId: selectedDepartmentId });
//   };

//   const handleNumericChange = (e) => {
//     const { name, value } = e.target;
//     const regex = /^[0-9]*$/;
//     if (regex.test(value)) {
//       setFormData({ ...formData, [name]: value });
//       setFormErrors({ ...formErrors, [name]: "" });
//     } else {
//       setFormErrors({ ...formErrors, [name]: "Only numbers are allowed." });
//     }
//   };

//   const handleDateChange = (e) => {
//     setFormData({ ...formData, doj: e.target.value });
//     setFormErrors({ ...formErrors, doj: "" });
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.employeeName) {
//       errors.employeeName = "Employee Name is required.";
//     } else if (formData.employeeName.length < 4 || formData.employeeName.length > 40) {
//       errors.employeeName = "Employee Name should be between 4 and 40 characters.";
//     } else if (!/^[A-Za-z\s]+$/.test(formData.employeeName)) {
//       errors.employeeName = "Employee Name should contain only alphabets and spaces.";
//     }

//     if (!formData.organisationName) {
//       errors.organisationName = "Organization Name is required.";
//     } else if (formData.organisationName.length < 4 || formData.organisationName.length > 40) {
//       errors.organisationName = "Organization Name should be between 4 and 40 characters.";
//     } else if (!/^[A-Za-z\s]+$/.test(formData.organisationName)) {
//       errors.organisationName = "Organization Name should contain only alphabets and spaces.";
//     }

//     if (!formData.employeeId) {
//       errors.employeeId = "Employee ID is required.";
//     } else if (formData.employeeId.length < 4 || formData.employeeId.length > 40) {
//       errors.employeeId = "Employee ID should be between 4 and 40 characters.";
//     }

//     if (!formData.hrId) {
//       errors.hrId = "HR ID is required.";
//     } else if (formData.hrId.length < 4 || formData.hrId.length > 8) {
//       errors.hrId = "HR ID should be between 4 and 8 characters.";
//     }

//     if (!formData.designation) {
//       errors.designation = "Designation is required.";
//     }

//     if (!formData.doj) {
//       errors.doj = "Date of Joining is required.";
//     }

//     if (!formData.reportingManagerId) {
//       errors.reportingManagerId = "Reporting Manager ID is required.";
//     } else if (formData.reportingManagerId.length < 4 || formData.reportingManagerId.length > 40) {
//       errors.reportingManagerId = "Reporting Manager ID should be between 4 and 40 characters.";
//     }

//     if (!formData.reportingManager) {
//       errors.reportingManager = "Reporting Manager is required.";
//     }

//     if (!formData.departmentId) {
//       errors.departmentId = "Department ID is required.";
//     } else if (formData.departmentId.length < 1 || formData.departmentId.length > 20) {
//       errors.departmentId = "Department ID should be between 1 and 20 characters.";
//     } else if (!/^[A-Za-z0-9]+$/.test(formData.departmentId)) {
//       errors.departmentId = "Department ID should contain only alphanumeric characters (no spaces or special characters).";
//     }

//     if (!formData.departmentName) {
//       errors.departmentName = "Department Name is required.";
//     } else if (formData.departmentName.length < 1 || formData.departmentName.length > 20) {
//       errors.departmentName = "Department Name should be between 1 and 20 characters.";
//     } else if (!/^[A-Za-z\s]+$/.test(formData.departmentName)) {
//       errors.departmentName = "Department Name should contain only alphabets and spaces.";
//     }

//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errors = validateForm();
//     if (Object.keys(errors).length === 0) {
//       const payload = {
//         organisationName: formData.organisationName.trim(),
//         employeeName: formData.employeeName,
//         employeeId: formData.employeeId,  
//         designation: formData.designation,
//         doj: formData.doj,
//         reportingManagerId: formData.reportingManagerId,
//         reportingManager: formData.reportingManager,
//         pay: Number(formData.pay),
//         departmentId: formData.departmentId,
//         departmentName: formData.departmentName,
//         hrId: formData.hrId,
//       };

//       console.log("Form Data Payload: ", payload); 
//       try {
//         let response;
//         if (formData.employeeId && formData.employeeId === "") {
//           console.log("Sending PATCH Request...");
//           response = await axiosInstance.patch(
//             `hrmsapplication/currentexperience/updateCurrentEmployement`,
//             payload
//           );
//           fetchCurrentDetails()
//         } else {
//           console.log("Sending POST Request...");
//           response = await axiosInstance.post(
//             `hrmsapplication/currentexperience/createCurrentEmployement?employeeId=${employeeId}`,
//             payload 
//           );
//           fetchCurrentDetails()
//         }
//         console.log("API Response:", response); 
//         setIsPopupOpen(false)
//         if (response.status === 200) {
//           setTableData(response.data); 
//           setIsPopupOpen(false); 
//           setIsEditMode(false); 
//           setFormErrors({}); 
//           alert(formData.employeeId ? "Employee Record Updated Successfully" : "Employee Record Created Successfully");
//         } else {
//           console.error("Unexpected Response:", response);
//         }
//       } catch (error) {
//         console.error("Error processing Current Experience Details:", error);
//       }
//     } else {
//       setFormErrors(errors);
//     }
//   };
//   const handleEdit = () => {
//     setIsPopupOpen(true);
//     setIsEditMode(true); 
//   };

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       handleSubmit(e);
//     }
//   };
//   const handleOpenPopup = () => {
//     setIsPopupOpen(true);  
//   };
//   const handleCancel = () => {
//     setIsPopupOpen(false);  
//     setIsEditMode(false);   
//   };

//   const preventManualInput = (e) => {
//     e.preventDefault();  
//   };


//   return (
//     <>
//       <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
//         <FaLessThan className="text-orange-500 mr-2" />
//         <Link to={`/dashboard/${employeeId}`}>
//           <button>
//             <span className="text font-semibold text-orange-500">Previous Page</span>
//           </button>
//         </Link>
//       </div>

//       <div className="mr-36 ml-36 border border-black rounded-t-md ">
//         <div className="bg-blue-950  text-white p-2 rounded-t-md">
//           <h2 className="font-semibold">Current Experience</h2>
//         </div>
//         <div className="bg-white p-2  border-1 border-black flex justify-between items-center">
//           <span className="font-semibold">Current Experience</span>
//           { userRole === "ROLE_ADMIN" &&
//           <button className="flex items-center text-black bg-green-500 px-2 py-1 rounded" onClick={handleEdit}>
//             Add
//           </button>
// }
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse border border-gray-400">
//             <thead>
//               <tr className="bg-gray-300">
//                 <th className="border border-gray-400 px-4 py-2">Organisation Name</th>
//                 <th className="border border-gray-400 px-4 py-2">Employee Name</th>
//                 <th className="border border-gray-400 px-4 py-2">Employee ID</th>
//                 <th className="border border-gray-400 px-4 py-2">Designation</th>
//                 <th className="border border-gray-400 px-4 py-2">Date Of Joining</th>
//                 <th className="border border-gray-400 px-4 py-2">Reporting Manager ID</th>
//                 <th className="border border-gray-400 px-4 py-2">Reporting Manager</th>
//                 <th className="border border-gray-400 px-4 py-2">Department ID</th> 
//                 <th className="border border-gray-400 px-4 py-2">Department Name</th>
//                 <th className="border border-gray-400 px-4 py-2">Hr ID</th>
//                 { userRole === 'ROLE_ADMIN'  &&
//                 <th className="border border-gray-400 px-4 py-2">Actions</th>
//               }
//               </tr>
//             </thead>
//             <tbody>
//               {tableData ? (
//                 <tr>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.organisationName}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.employeeName}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.employeeId}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.designation}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.doj}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.reportingManagerId}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.reportingManager}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.departmentId}</td>  
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.departmentName}</td>
//                   <td className="border border-gray-400 px-4 py-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">{tableData.hrId}</td>
//                   { userRole === 'ROLE_ADMIN'  &&
//                   <td className="py-2 px-4 border-b border-gray-900 text-right">
//                     <div className="flex flex-row">
//                       <TiPencil
//                         className="mr-2 cursor-pointer text-black-500 text-xs sm:text-sm"
//                         onClick={() => handleOpenPopup()}
//                       />
//                     </div>
//                   </td>
//                    }
//                 </tr>
//               ) : (
//                 <tr>
//                   <td className="border border-gray-400 px-4 py-2 text-center" colSpan="8">
//                     No Experience Added
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//       </div>

//        {isPopupOpen && (
//         <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50 ">
//           <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
//             <div className="flex justify-between items-center mb-8 bg-blue-950 rounded-lg pl-2 pr-2 w-full p-2">
//               <h3 className=" text-xl  w-full">{isEditMode ? "Add Current Experience Details" : "Enter Details"}</h3>

//                <button ><FaRegWindowClose   size={24} className="text-black  text-xl cursor-pointer" onClick={handleCancel}/></button>
//             </div>
//             <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
//              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4 " >
//              <div className="col-span-1 ">
//                 <label className="block mb-1 ">Organisation Name:</label>
//                 <input
//                   type="text"
//                   name="organisationName"
//                   disabled
//                   value={formData.organisationName}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
//                         setFormData({ ...formData, organisationName: value });
//                         setFormErrors({ ...formErrors, organisationName: "" });}
//                     }}

//                   className="w-full p-1 border border-gray-300 rounded-lg"
//                 />
//                 {formErrors.organisationName && <p className="text-red-600 text-sm mt-1">{formErrors.organisationName}</p>}
//               </div>
//               <div className="col-span-1 ">
//                 <label className="block mb-1 ">Employee Name:</label>
//                 <input
//                   type="text"
//                   disabled
//                   name="employeeName"
//                   value={formData.employeeName}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
//                         setFormData({ ...formData, employeeName: value });
//                         setFormErrors({ ...formErrors, employeeName: "" });}
//                     }}

//                   className="w-full p-1 border border-gray-300 rounded-lg"
//                 />
//                 {formErrors.employeeName && <p className=" text-red-600 text-sm mt-1">{formErrors.employeeName}</p>}
//               </div>


//               <div className="col-span-1 ">
//                 <label className="block mb-1 ">Employee ID:</label>
//                 <input
//                   type="text"
//                   name="employeeId"
//                   disabled
//                   value={formData.employeeId}
//                   onChange={handleInputChange}
//                   minLength={4}
//                   maxLength={20}

//                   className="w-full p-1 border border-gray-300 rounded-lg"
//                 />
//                 {formErrors.employeeId && <p className="text-red-600 text-sm mt-1">{formErrors.employeeId}</p>}
//                 </div>
//                 <div className="col-span-1">
//         <label className="block mb-1">Designation:</label>
//         <select 
//           name="designation" 
//           value={formData.designation} 
//           onChange={handleDesignationChange}
//           className="w-full p-1 border border-gray-300 rounded-lg"
//         ><option value="" disabled>Select designation</option>
//           {designationOptions.length > 0 ? (
//             designationOptions.map((option, index) => (

//               <option key={index} value={option.designation}> 
//                 {option.designation} 
//               </option>
//             ))
//           ) : (
//             <option>Loading...</option>  
//           )}
//         </select>
//         {formErrors.designation && <p className="text-red-600 text-sm mt-1">{formErrors.designation}</p>}
//       </div>
//                <div className="col-span-1 ">
//                 <label className="block mb-1 ">Date Of Joining:</label>
//                 <input
//                   type="date"
//                   id="doj"
//                   value={formData.doj}
//                   onChange={handleDateChange}
//                   className="w-full p-1 border border-gray-300 rounded-lg"
//                   onKeyDown={preventManualInput}
//                   onClick={(e) => e.target.readOnly = false}  
//                   disabled
//                 />
//                 {formErrors.doj && <p className="text-red-600 text-sm mt-1">{formErrors.doj}</p>}
//                 </div>
//                 <div className="col-span-1">
//   <label className="block mb-1">Reporting Manager ID:</label>
//   <select
//     name="reportingManagerId"
//     value={formData.reportingManagerId}
//     onChange={handleReportingManagerChange}
//     className="w-full p-1 border border-gray-300 rounded-lg"
//   >
//     <option value="" disabled>Select a Reporting Manager</option>
//     {managers.length > 0 ? (
//       managers.map((managerId) => (
//         <option key={managerId} value={managerId}>
//           {managerId} 
//         </option>
//       ))
//     ) : (
//       <option>Loading...</option>
//     )}
//   </select>
// </div>
//                 <div className="col-span-1 ">
//                 <label className="block mb-1 ">Reporting Manager:</label>
//                 <input
//                   type="text"
//                   name="reportingManager"
//                   value={formData.reportingManager}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
//                         setFormData({ ...formData, reportingManager: value });
//                         setFormErrors({ ...formErrors, reportingManager: "" });}
//                     }}

//                   className="w-full p-1 border border-gray-300 rounded-lg"
//                 />
//                 {formErrors.reportingManager && <p className="text-red-600 text-sm mt-1">{formErrors.reportingManager}</p>}
//                 </div>
//                 <div className="col-span-1">
//   <label className="block mb-1">Department ID:</label>
//   <select
//     name="departmentId"
//     value={formData.departmentId}
//     onChange={handleDepartmentIdChange}
//     className="w-full p-1 border border-gray-300 rounded-lg"
//   >
//     <option value="" disabled>Select a Department</option>
//     {departmentIds.length > 0 ? (
//       departmentIds.map((departmentId) => (
//         <option key={departmentId} value={departmentId}>
//           {departmentId}
//         </option>
//       ))
//     ) : (
//       <option>Loading...</option>
//     )}
//   </select>
// </div>

//               <div className="col-span-1 ">
//                 <label className="block mb-1 ">Department Name:</label>
//                 <input
//                   type="text"
//                   name="departmentName"
//                   value={formData.departmentName}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
//                         setFormData({ ...formData, departmentName: value });
//                         setFormErrors({ ...formErrors, departmentName: "" });}
//                     }}

//                   className="w-full p-1 border border-gray-300 rounded-lg"
//                 />
//                 {formErrors.departmentName && <p className="text-red-600 text-sm mt-1">{formErrors.departmentName}</p>}
//               </div>
//               <div className="col-span-1">
//   <label className="block mb-1">HR ID:</label>
//   <select
//     name="hrId"
//     value={formData.hrId}
//     onChange={handleHrIdChange}
//     className="w-full p-1 border border-gray-300 rounded-lg"
//   >
//     <option value="" disabled>Select an HR</option>
//     {hrIds.length > 0 ? (
//       hrIds.map((hrId) => (
//         <option key={hrId} value={hrId}>
//           {hrId} 
//         </option>
//       ))
//     ) : (
//       <option>Loading...</option>
//     )}
//   </select>
// </div>

//               </div>
//               <div className="  mt-5 flex justify-end space-x-4">
//               <button type="submit"  onClick={handleSubmit} className=" border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ">
//                {isEditMode ? "Save " : "Submit"} 
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ">Cancel
//               </button>
//             </div>
//             </form>
//           </div>
//         </div>
//        )}
//      </div>
//     </>

//   );
// };

// export default ExperienceCard; 


import React, { useEffect, useState } from "react";
import { FaRegWindowClose, FaLessThan } from "react-icons/fa";
import axiosInstance from "./axiosConfig";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { TiPencil } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ExperienceCard = () => {
  const { employeeId } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [formData, setFormData] = useState({
    organisationName: "",
    employeeName: "",
    employeeId: "",
    designation: "",
    doj: "",
    reportingManagerId: "",
    reportingManager: "",
    pay: "",
    departmentId: "",
    departmentName: "",
    hrId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableData, setTableData] = useState({});
  const userRole = localStorage.getItem("UserRole");
  const [managers, setManagers] = useState([]);
  const [hrIds, setHrIds] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [isdesignation, setIsDesignation] = useState(true);




  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/currentexperience/getEmployeeDetails/${employeeId}`
        );

        const data = response.data;
        console.log(data);


        setFormData({
          organisationName: data.organizationName || "",
          employeeName: data.employeeName || "",
          employeeId: data.employeeId || "",
          designation: data.designation || "",
          doj: data.doj || "",
          reportingManagerId: data.reportingManagerId || "",
          reportingManager: data.reportingManager || "",
          pay: data.pay || "",
          departmentId: data.departmentId || "",
          departmentName: data.departmentName || "",
          hrId: data.hrId || "",
        });
      } catch (error) {
        console.error("Error fetching employee details:", error);
        toast.error("kindly recheck the Form");
      }
    };

    fetchEmployeeDetails();
    fetchCurrentDetails();
  }, [employeeId]);


  useEffect(() => {
    const fetchReportingManagers = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/currentexperience/getUserRoleManager`
        );
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching reporting managers:", error);
        toast.error("kindly recheck the Form");
      }
    };

    fetchReportingManagers();
  }, []);
  useEffect(() => {
    const fetchHrIds = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/currentexperience/getUserRoleHr`
        );
        setHrIds(response.data || []);
      } catch (error) {
        console.error("Error fetching HR IDs:", error);
        toast.error("kindly recheck the Form");
      }
    };

    fetchHrIds();
  }, []);
  const handleHrIdChange = (e) => {
    const selectedHrId = e.target.value;
    setFormData({ ...formData, hrId: selectedHrId });
  };



  const handleManagerIdChange = async (e) => {
    const selectedManagerId = e.target.value;
    formData.reportingManagerId = selectedManagerId;

    try {
      const response = await axiosInstance.get(
        `hrmsapplication/employee/getEmployeeName/${selectedManagerId}`
      );
      formData.reportingManager = response.data || "";
      setManagerName(response.data || "");
    } catch (error) {
      toast.error("kindly recheck the Form");
      console.error("Error fetching manager name:", error);
      setManagerName("");
    }

    setFormData(formData);
  };




  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/designations/getAllDesignations`);
        setDesignationOptions(response.data);
      } catch (error) {
        console.error('Error fetching designations:', error);
        toast.error("kindly recheck the Form");
      }
    };

    fetchDesignations();
  }, []);

  const fetchCurrentDetails = async () => {
    console.log('called this method')
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/currentexperience/${employeeId}`
      );
      console.log('inside try')
      const data = response.data;
      if (data.designation === "" || data.designation === undefined || data.designation === 'null') {
        setIsDesignation(false);
      }
      setTableData(data);
      setFormData({
        organisationName: data.organisationName,
        employeeName: data.employeeName,
        employeeId: data.employeeId,
        designation: data.designation,
        doj: data.doj,
        reportingManagerId: data.reportingManagerId,
        reportingManager: data.reportingManager,
        pay: data.pay,
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        hrId: data.hrId,
      });
      console.log("Fetched data:", data);

    } catch (error) {
      console.log('inside catch block');
      console.error("Error fetching Current Experience Details:", error);
      toast.error("kindly recheck the Form");
    }
  };
  useEffect(() => {


  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleDesignationChange = (e) => {
    setFormData({ ...formData, designation: e.target.value });
    setFormErrors({ ...formErrors, designation: "" });
  };
  useEffect(() => {
    const fetchDepartmentIds = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/department/getAllDepartmentIds`
        );
        setDepartmentIds(response.data || []);
      } catch (error) {
        console.error("Error fetching Department IDs:", error);
        toast.error("kindly recheck the Form");
      }
    };

    fetchDepartmentIds();
  }, []);
  const handleDepartmentIdChange = async (e) => {
    const selectedDepartmentId = e.target.value;
    formData.departmentId = selectedDepartmentId;

    try {
      const response = await axiosInstance.get(
        `hrmsapplication/department/getDepartmentName/${selectedDepartmentId}`
      );
      formData.departmentName = response.data;
      setDepartmentName(response.data || "");
    } catch (error) {
      toast.error("kindly recheck the Form");
      console.error("Error fetching department name:", error);
      setDepartmentName("");
    }
    setFormData(formData);
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, doj: e.target.value });
    setFormErrors({ ...formErrors, doj: "" });
  };

  const validateForm = () => {
    const errors = {};
    console.log(formData)
    if (!formData.employeeName) {
      errors.employeeName = "Employee Name is required.";
    }
    // else if (formData.employeeName.length < 4 || formData.employeeName.length > 40) {
    //   errors.employeeName = "Employee Name should be between 4 and 40 characters.";
    // } else if (!/^[A-Za-z\s]+$/.test(formData.employeeName)) {
    //   errors.employeeName = "Employee Name should contain only alphabets and spaces.";
    // }

    if (!formData.organisationName) {
      errors.organisationName = "Organization Name is required.";
    }
    // else if (formData.organisationName.length < 4 || formData.organisationName.length > 40) {
    //   errors.organisationName = "Organization Name should be between 4 and 40 characters.";
    // } else if (!/^[A-Za-z\s]+$/.test(formData.organisationName)) {
    //   errors.organisationName = "Organization Name should contain only alphabets and spaces.";
    // }

    if (!formData.employeeId) {
      errors.employeeId = "Employee ID is required.";
    }
    // else if (formData.employeeId.length < 4 || formData.employeeId.length > 40) {
    //   errors.employeeId = "Employee ID should be between 4 and 40 characters.";
    // }

    if (!formData.hrId) {
      errors.hrId = "HR ID is required.";
    }
    // else if (formData.hrId.length < 4 || formData.hrId.length > 8) {
    //   errors.hrId = "HR ID should be between 4 and 8 characters.";
    // }

    if (!formData.designation) {
      errors.designation = "Designation is required.";
    }

    if (!formData.doj) {
      errors.doj = "Date of Joining is required.";
    }

    if (!formData.reportingManagerId) {
      errors.reportingManagerId = "Reporting Manager ID is required.";
    }
    // else if (formData.reportingManagerId.length < 4 || formData.reportingManagerId.length > 40) {
    //   errors.reportingManagerId = "Reporting Manager ID should be between 4 and 40 characters.";
    // }

    if (!formData.reportingManager) {
      errors.reportingManager = "Reporting Manager is required.";
    }

    if (!formData.departmentId) {
      errors.departmentId = "Department ID is required.";
    }
    //  else if (formData.departmentId.length < 1 || formData.departmentId.length > 20) {
    //   errors.departmentId = "Department ID should be between 1 and 20 characters.";
    // } else if (!/^[A-Za-z0-9]+$/.test(formData.departmentId)) {
    //   errors.departmentId = "Department ID should contain only alphanumeric characters (no spaces or special characters).";
    // }


    if (!formData.departmentName) {
      errors.departmentName = "Department Name is required.";
    }
    // else if (formData.departmentName.length < 1 || formData.departmentName.length > 20) {
    //   errors.departmentName = "Department Name should be between 1 and 20 characters.";
    // } else if (!/^[A-Za-z\s]+$/.test(formData.departmentName)) {
    //   errors.departmentName = "Department Name should contain only alphabets and spaces.";
    // }
    console.log(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const payload = {
        organisationName: formData.organisationName.trim(),
        employeeName: formData.employeeName,
        employeeId: formData.employeeId || null,
        designation: formData.designation,
        doj: formData.doj,
        reportingManagerId: formData.reportingManagerId,
        reportingManager: formData.reportingManager,
        // pay: Number(formData.pay), 
        departmentId: formData.departmentId,
        departmentName: formData.departmentName,
        hrId: formData.hrId,
      };

      console.log("Form Data Payload: ", payload);

      try {
        let response;

        if (isdesignation) {
          console.log("Sending PATCH Request...");
          response = await axiosInstance.patch(
            `hrmsapplication/currentexperience/updateCurrentEmployement`,
            payload,
          );
          setIsPopupOpen(false);
        } else {
          console.log("Sending POST Request...");
          response = await axiosInstance.post(
            `hrmsapplication/currentexperience/createCurrentEmployement?employeeId=${employeeId}`,
            payload
          );
          setIsPopupOpen(false);
          fetchCurrentDetails();
        }

        console.log("API Response:", response);
        if (response.status === 200) {
          setTableData(response.data);
          setIsPopupOpen(false);
          setIsEditMode(false);
          setFormErrors({});

          alert(isdesignation ? "Employee Record Updated Successfully" : "Employee Record Created Successfully");
        } else {
          console.error("Unexpected Response:", response);
        }
      } catch (error) {
        console.error("Error processing Current Experience Details:", error);
        if (error.response) {
          console.error("Error Response:", error.response.data);
          toast.error(`Error: ${error.response.data.message || "Kindly recheck the Form"}`);
        } else {
          toast.error("Network error, please try again.");
        }
      }
    } else {
      setFormErrors(errors);
    }
  };


  // const handleSubmitPost = async () => {
  //   const payload = {
  //     organisationName: formData.organisationName.trim(),
  //     employeeName: formData.employeeName,
  //     employeeId: formData.employeeId,  
  //     designation: formData.designation,
  //     doj: formData.doj,
  //     reportingManagerId: formData.reportingManagerId,
  //     reportingManager: formData.reportingManager,
  //     pay: Number(formData.pay),
  //     departmentId: formData.departmentId,
  //     departmentName: formData.departmentName,
  //     hrId: formData.hrId,
  //   };

  //   try {
  //     console.log("Sending POST Request...");
  //     const response = await axiosInstance.post(
  //       `hrmsapplication/currentexperience/createCurrentEmployement?employeeId=${employeeId}`,
  //       payload
  //     );

  //     console.log("POST Response:", response);
  //     if (response.status === 201) {
  //       fetchCurrentDetails();
  //       setTableData(response.data);
  //       setIsPopupOpen(false);
  //     }
  //   } catch (error) {
  //     //handleBackendErrors(error);
  //   }
  // };

  // const handleSubmitPatch = async () => {
  //   const payload = {
  //     organisationName: formData.organisationName.trim(),
  //     employeeName: formData.employeeName,
  //     employeeId: formData.employeeId,  
  //     designation: formData.designation,
  //     doj: formData.doj,
  //     reportingManagerId: formData.reportingManagerId,
  //     reportingManager: formData.reportingManager,
  //     //pay: Number(formData.pay),
  //     departmentId: formData.departmentId,
  //     departmentName: formData.departmentName,
  //     hrId: formData.hrId,
  //   };

  //   try {

  //     console.log("Sending PATCH Request...");
  //     const response = await axiosInstance.patch(
  //       `hrmsapplication/currentexperience/updateCurrentEmployement`,
  //       payload
  //     );

  //     console.log("PATCH Response:", response);
  //     if (response.status === 200) {
  //       setTableData((prevData) => ({
  //         ...prevData,
  //         [formData.employeeId]: {
  //           ...prevData[formData.employeeId], // Directly update departmentName
  //         },
  //       }));
  //       fetchCurrentDetails();


  //       alert("Employee Record Updated Successfully");
  //     }
  //   } catch (error) {
  //     //handleBackendErrors(error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //  debugger;
  //   const errors = validateForm();
  //   if (Object.keys(errors).length === 0) {
  //     if (formData.employeeId && formData.employeeId === "") {
  //       await handleSubmitPatch(); // Call PATCH logic
  //     } else {
  //       await handleSubmitPost(); // Call POST logic
  //     }
  //   } else {
  //     setFormErrors(errors);
  //   }
  // };



  const handleEdit = () => {
    setIsPopupOpen(true);
    setIsEditMode(true);

  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setFormData(tableData);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
  };

  const preventManualInput = (e) => {
    e.preventDefault();
  };


  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-start px-2 py-2 overflow-x-auto bg-blue-950 border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/dashboard/${employeeId}`}>
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </Link>
      </div>

      <div className="mx-2 sm:mx-10 md:mx-36 border border-black rounded-md">
        <div className="bg-blue-950 text-white p-2 rounded-t-md">
          <h2 className="font-semibold text-sm sm:text-base">Current Experience</h2>
        </div>
        <div className="bg-white p-2 border-1 border-black flex justify-between items-center">
          <span className="font-semibold text-sm sm:text-base">Current Experience</span>
          {userRole === "ROLE_ADMIN" && (
            <button
              className={`flex items-center bg-green-500 text-black px-2 py-1 rounded ${tableData ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={handleEdit}
              disabled={!!tableData}
            >
              <span className="text-xs sm:text-sm">Add</span>
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Organisation Name</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Employee Name</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Employee ID</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Designation</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Date Of Joining</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Reporting Manager ID</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Reporting Manager</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Department ID</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Department Name</th>
                <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Hr ID</th>
                {userRole === 'ROLE_ADMIN' && (
                  <th className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData ? (
                <tr>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.organisationName}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.employeeName}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.employeeId}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.designation}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.doj}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.reportingManagerId}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.reportingManager}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.departmentId}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.departmentName}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{tableData.hrId}</td>
                  {userRole === 'ROLE_ADMIN' && (
                    <td className="py-2 px-4 border-b border-gray-900 text-right">
                      <div className="flex flex-row">
                        <TiPencil
                          className="mr-2 cursor-pointer text-black-500 text-xs sm:text-sm"
                          onClick={() => handleOpenPopup()}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ) : (
                <tr>
                  <td
                    className="border border-gray-400 px-4 py-2 text-center"
                    colSpan="10"
                  >
                    No Experience Added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isPopupOpen && (
          <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-4/5 lg:w-1/2 max-h-full sm:max-h-none overflow-y-auto sm:overflow-visible">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-6 bg-blue-950 rounded-lg px-3 py-2">
                <h2 className="text-sm sm:text-base  lg:text-lg text-white">
                  {isEditMode ? "Add Current Experience Details" : "Edit Current Experience Details"}
                </h2>
                <button onClick={handleCancel}>
                  <FaRegWindowClose size={20} className="text-white cursor-pointer" />
                </button>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Organisation Name */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Organisation Name:</label>
                    <input
                      type="text"
                      name="organisationName"
                      readOnly
                      disabled
                      value={formData.organisationName}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                          setFormData({ ...formData, organisationName: value });
                          setFormErrors({ ...formErrors, organisationName: "" });
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    />
                    {formErrors.organisationName && <p className="text-red-600 text-xs mt-1">{formErrors.organisationName}</p>}
                  </div>

                  {/* Employee Name */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Employee Name:</label>
                    <input
                      type="text"
                      name="employeeName"
                      readOnly
                      disabled
                      value={formData.employeeName}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    />
                    {formErrors.employeeName && <p className="text-red-600 text-xs mt-1">{formErrors.employeeName}</p>}
                  </div>

                  {/* Employee ID */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Employee ID:</label>
                    <input
                      type="text"
                      name="employeeId"
                      readOnly
                      disabled
                      value={formData.employeeId}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    />
                    {formErrors.employeeId && <p className="text-red-600 text-xs mt-1">{formErrors.employeeId}</p>}
                  </div>

                  {/* Designation */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Designation:</label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleDesignationChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    >
                      <option value="" disabled>Select Designation</option>
                      {designationOptions.length > 0 ? (
                        designationOptions.map((option, index) => (
                          <option key={index} value={option.designation}>
                            {option.designation}
                          </option>
                        ))
                      ) : (
                        <option>Loading...</option>
                      )}
                    </select>
                    {formErrors.designation && <p className="text-red-600 text-xs mt-1">{formErrors.designation}</p>}
                  </div>

                  {/* Date of Joining */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Date Of Joining:</label>
                    <input
                      type="date"
                      id="doj"
                      value={formData.doj}
                      onChange={handleDateChange}
                      onClick={(e) => (e.target.readOnly = false)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                      onKeyDown={preventManualInput}
                      readOnly
                      disabled
                    />
                    {formErrors.doj && <p className="text-red-600 text-xs mt-1">{formErrors.doj}</p>}
                  </div>

                  {/* Reporting Manager ID */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Reporting Manager ID:</label>
                    <select
                      name="reportingManagerId"
                      value={formData.reportingManagerId}
                      onChange={handleManagerIdChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    >
                      <option value="" disabled>Select a Reporting Manager</option>
                      {managers.length > 0 ? (
                        managers.map((managerId) => (
                          <option key={managerId} value={managerId}>
                            {managerId}
                          </option>
                        ))
                      ) : (
                        <option>Loading...</option>
                      )}
                    </select>
                  </div>

                  {/* Manager Name */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Manager Name:</label>
                    <input
                      type="text"
                      name="managerName"
                      value={managerName}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Department ID */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Department ID:</label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleDepartmentIdChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    >
                      <option value="" disabled>Select a Department</option>
                      {departmentIds.length > 0 ? (
                        departmentIds.map((departmentId) => (
                          <option key={departmentId} value={departmentId}>
                            {departmentId}
                          </option>
                        ))
                      ) : (
                        <option>Loading...</option>
                      )}
                    </select>
                  </div>

                  {/* Department Name */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">Department Name:</label>
                    <input
                      type="text"
                      name="departmentName"
                      value={departmentName}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-xs sm:text-sm"
                    />
                  </div>

                  {/* HR ID */}
                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm mb-1">HR ID:</label>
                    <select
                      name="hrId"
                      value={formData.hrId}
                      onChange={handleHrIdChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    >
                      <option value="" disabled>Select an HR</option>
                      {hrIds.length > 0 ? (
                        hrIds.map((hrId) => (
                          <option key={hrId} value={hrId}>
                            {hrId}
                          </option>
                        ))
                      ) : (
                        <option>Loading...</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="submit"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
                  >
                    {isEditMode ? "Save" : "Update"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
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
};

export default ExperienceCard; 
