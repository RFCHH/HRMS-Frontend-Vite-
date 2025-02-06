// import  { useState, useEffect } from "react";
// import axiosInstance from "./axiosConfig";

// const InterviewTable = () => {
//   const [activePage,] = useState("interviewDetails");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [interviews, setInterviews] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [newInterview, setNewInterview] = useState({
//     fullName: "",
//     emailId: "",
//     mobileNumber: "",
//     countryCode: "",
//     roleApplied: "",
//     location: "",
//     interviewDate: "",
//     interviewerId: "",
//     interViewerEmailId: "",
//     modeOfInterview: "",
//     interviewStatus: "",
//     comments: "",
//   });
//   const [fetchedInterview, setFetchedInterview] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     fetchAllInterviews();
//   }, [currentPage]);

//   // Fetch all interview details
//   const fetchAllInterviews = async () => {
//     try {
//       const response = await axiosInstance.get(`hrmsapplication/interview/getAllInterviewDetails?pageNumber=${currentPage}&size=40`);
//       console.log('Fetched Interviews:', response.data); // Add this line
//       setInterviews(response.data.content);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching all interviews:", error);
//       setInterviews([]); // Add this line to reset interviews on error
//     }
//   };
  

//   // Fetch details for a specific interview
//   // const fetchInterviewDetails = async (interviewId) => {
//   //   try {
//   //     const response = await axiosInstance.get(`hrmsapplication/interview/getInterviewDetails/${interviewId}`);
//   //     setFetchedInterview(response.data);
//   //     setShowModal(true);
//   //   } catch (error) {
//   //     console.error("Error fetching interview details:", error);
//   //   }
//   // };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewInterview({ ...newInterview, [name]: value });
//   };

//   const validateFields = () => {
//     const { fullName, emailId, mobileNumber, roleApplied, location, interviewerId, interViewerEmailId, countryCode } = newInterview;
//     let errorObj = {};

//     // Name validation
//     if (!fullName) {
//       errorObj.fullName = "Name is required.";
//     } else if (fullName.length < 3 || fullName.length > 40) {
//       errorObj.fullName = "Name should be between 3 and 40 characters.";
//     } else if (/^\s/.test(fullName)) {
//       errorObj.fullName = "Name should not start with a space.";
//     } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
//       errorObj.fullName = "Name should contain only alphabets and spaces.";
//     }

//     // Email validation
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailId || !interViewerEmailId) {
//       errorObj.emailId = "Both email fields are required.";
//     } else if (!emailPattern.test(emailId) || !emailPattern.test(interViewerEmailId)) {
//       errorObj.emailId = "Invalid email format.";
//     }

//     // Phone number validation
//     if (!mobileNumber) {
//       errorObj.mobileNumber = "Phone number is required.";
//     } else if (!/^[1-9]\d{9}$/.test(mobileNumber)) {
//       errorObj.mobileNumber = "Phone number must not start with 0 and be exactly 10 digits.";
//     }

//     // Interviewer ID validation
//     if (!interviewerId) {
//       errorObj.interviewerId = "Interviewer ID is required.";
//     } else if (!/^[a-zA-Z0-9@.]+$/.test(interviewerId)) {
//       errorObj.interviewerId = "Invalid Interviewer ID.";
//     }

//     // Role Applied validation
//     if (!roleApplied) {
//       errorObj.roleApplied = "Role applied is required.";
//     }

//     // Location validation
//     if (!location) {
//       errorObj.location = "Location is required.";
//     }

//     // Country Code validation
//     if (!countryCode) {
//       errorObj.countryCode = "Country code is required.";
//     }

//     setErrors(errorObj);
//     return Object.keys(errorObj).length === 0;
//   };

//   const handleInterviewSubmit = async () => {
//     if (validateFields()) {
//       try {
//         const response = await axiosInstance.post(
//           'hrmsapplication/interview/create',
//           newInterview,
//         );

//         if (response.status === 201) {
//           console.log('Interview submitted successfully:', response.data);

//           setInterviews([
//             ...interviews,
//             { ...newInterview, interviewId: response.data.interviewId },
//           ]);

//           setShowModal(false);
//           resetForm();
//         } else {
//           console.error('Unexpected response:', response);
//           setErrors({ apiError: 'Failed to add interview. Please try again later.' });
//         }
//       } catch (error) {
//         console.error('Error adding interview:', error);
//         setErrors({ apiError: error.response?.data?.message || 'Failed to add interview.' });
//       }
//     }
//   };

//   const resetForm = () => {
//     setNewInterview({
//       fullName: "",
//       emailId: "",
//       mobileNumber: "",
//       countryCode: "",
//       roleApplied: "",
//       location: "",
//       interviewDate: "",
//       interviewerId: "",
//       interViewerEmailId: "",
//       modeOfInterview: "",
//       interviewStatus: "",
//       comments: "",
//     });
//     setErrors({});
//   };

//   const filteredInterviews = (interviews || []).filter((interview) =>
//     interview.fullName.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  

//   return (
//     <div>
//       <div className="p-4">
//         {activePage === "interviewDetails" && (
//           <div className="container mx-auto">
//             <div className="flex justify-between items-center mb-4">
//               <input
//                 type="text"
//                 className="p-2 border border-gray-300 rounded w-full md:w-1/3"
//                 placeholder="Search by name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button className="ml-4 p-2 bg-blue-500 text-white rounded" onClick={() => setShowModal(true)}>
//                 + Add
//               </button>
//             </div>

//             <table className="min-w-full border-collapse block md:table">
//               <thead className="block md:table-header-group">
//                 <tr className="border border-gray-300 block md:table-row">
//                   {[ "Full Name", "Email Id", "Role Applied", "Interview Date", "Interviewer ID", "Mode of Interview", "Interview Status", "Action"].map(
//                     (heading, index) => (
//                       <th key={index} className="p-2 bg-gray-100 block md:table-cell">
//                         {heading}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>

//               <tbody className="block md:table-row-group">
//                 {filteredInterviews.length > 0 ? (
//                   filteredInterviews.map((interview) => (
//                     <tr key={interview.interviewId} className="border border-gray-300 block md:table-row">
//                       {/* <td className="p-2 block md:table-cell">{interview.interviewId}</td> */}
//                       <td className="p-2 block md:table-cell">{interview.fullName}</td>
//                       <td className="p-2 block md:table-cell">{interview.emailId}</td>
//                       <td className="p-2 block md:table-cell">{interview.roleApplied}</td>
//                       <td className="p-2 block md:table-cell">{interview.interviewDate}</td>
//                       <td className="p-2 block md:table-cell">{interview.interviewerId}</td>
//                       <td className="p-2 block md:table-cell">{interview.modeOfInterview}</td>
//                       <td className="p-2 block md:table-cell">{interview.interviewStatus}</td>
//                       <td className="p-2 block md:table-cell">
//                         <button
//                           className="bg-blue-500 text-white p-2 rounded"
//                           // onClick={() => fetchInterviewDetails(interview.interviewId)}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center p-4">
//                       No data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
            
//             {/* Pagination controls */}
//             <div className="flex justify-between items-center mt-4">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
//                 disabled={currentPage === 0}
//                 className="p-2 bg-gray-300 rounded"
//               >
//                 Previous
//               </button>
//               <span>
//                 Page {currentPage + 1} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
//                 disabled={currentPage === totalPages - 1}
//                 className="p-2 bg-gray-300 rounded"
//               >
//                 Next
//               </button>
//             </div>

//             {showModal && (
//               <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
//                 <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
//                   <div className="flex justify-between items-center mb-8 bg-orange-500 rounded-lg pl-2 pr-2 w-full p-2">
//                     <h2 className="text-xl">Add Interview Details</h2>
//                   </div>

//                   <div className="grid grid-cols-4 gap-4 mb-9">
//                     {/* Name Field */}
//                     <div>
//                       <label>Full Name</label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         value={newInterview.fullName}
//                         min={3}
//                         max={40}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.fullName ? "border-red-500" : ""}`}
//                       />
//                       {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
//                     </div>
//                     {/* Email Field */}
//                     <div>
//                       <label>Email Id</label>
//                       <input
//                         type="email"
//                         name="emailId"
//                         value={newInterview.emailId}
//                         min={6}
//                         max={40}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.emailId ? "border-red-500" : ""}`}
//                       />
//                       {errors.emailId && <p className="text-red-500">{errors.emailId}</p>}
//                     </div>

//                     <div>
//                       <label>Country Code</label>
//                       <select
//                         name="CountryCode"
//                         value={newInterview.countryCode}
//                         max={10}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.countryCode ? "border-red-500" : ""}`} >
//                         <option value="">select code</option>
//                         <option value="+91">+91 (INDIA)</option>
//                         <option value="+1">+1 (USA)</option>
//                         <option value="+44">+44 (UK)</option>
//                         <option value="+61">+61 (AUSTRALIA)</option>
//                         <option value="+64">+64 (NEW ZEALAND)</option>
//                         <option value="+27">+27 (SOUTH AFRICA)</option>
//                         <option value="+977">+977 (NEPAL)</option>
//                         <option value="+94">+94 (SRILANKA)</option>
//                         <option value="+60">+60 (MALAYSIA)</option>
//                         <option value="+65">+65 (SINGAPORE)</option>
//                       </select>
                      
//                       {errors.countryCode && <p className="text-red-500">{errors.countryCode}</p>}
//                     </div>
//                     {/* Mobile Number Field */}
//                     <div>
//                       <label>Mobile Number</label>
//                       <input
//                         type="text"
//                         name="mobileNumber"
//                         value={newInterview.mobileNumber}
//                         max={10}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.mobileNumber ? "border-red-500" : ""}`}
//                       />
//                       {errors.mobileNumber && <p className="text-red-500">{errors.mobileNumber}</p>}
//                     </div>
//                     {/* Role Applied Field */}
//                     <div>
//                       <label>Role Applied</label>
//                       <input
//                         type="text"
//                         name="roleApplied"
//                         value={newInterview.roleApplied}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.roleApplied ? "border-red-500" : ""}`}
//                       />
//                       {errors.roleApplied && <p className="text-red-500">{errors.roleApplied}</p>}
//                     </div>
//                     {/* Location Field */}
//                     <div>
//                       <label>Location</label>
//                       <input
//                         type="text"
//                         name="location"
//                         value={newInterview.location}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.location ? "border-red-500" : ""}`}
//                       />
//                       {errors.location && <p className="text-red-500">{errors.location}</p>}
//                     </div>
//                     {/* Interview Date Field */}
//                     <div>
//                       <label>Interview Date</label>
//                       <input
//                         type="date"
//                         name="interviewDate"
//                         value={newInterview.interviewDate}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded p-2 w-full"
//                       />
//                     </div>
//                     {/* Interviewer ID Field */}
//                     <div>
//                       <label>Interviewer ID</label>
//                       <input
//                         type="text"
//                         name="interviewerId"
//                         value={newInterview.interviewerId}
//                         onChange={handleInputChange}
//                         className={`border border-gray-300 rounded p-2 w-full ${errors.interviewerId ? "border-red-500" : ""}`}
//                       />
//                       {errors.interviewerId && <p className="text-red-500">{errors.interviewerId}</p>}
//                     </div>
//                     {/* Interviewer Email ID Field */}
//                     <div>
//                       <label>Interviewer Email ID</label>
//                       <input
//                         type="email"
//                         name="interViewerEmailId"
//                         value={newInterview.interViewerEmailId}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded p-2 w-full"
//                       />
//                     </div>
//                     {/* Mode of Interview Field */}
//                     <div>
//                       <label>Mode of Interview</label>
//                       <select
//                         name="modeOfInterview"
//                         value={newInterview.modeOfInterview}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded p-2 w-full"
//                       >
//                         <option value="">select</option>
//                         <option value="ONLINE">Online</option>
//                         <option value="OFFLINE">Offline</option>
//                       </select>
//                     </div>
//                     {/* Interview Status Field */}
//                     <div>
//                       <label>Interview Status</label>
//                       <select
//                         name="interviewStatus"
//                         value={newInterview.interviewStatus}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded p-2 w-full"
//                       >
//                         <option value="">select</option>
//                         <option value="PASSED">PASSED</option>
//                         <option value="FAILED">FAILED</option>
//                         <option value="YETTOCOMPLETE">YETTOCOMPLETE</option>
//                       </select>
//                     </div>
//                     {/* Comments Field */}
//                     <div>
//                       <label>Comments</label>
//                       <textarea
//                         name="comments"
//                         value={newInterview.comments}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded p-2 w-full"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(false)}>
//                       Cancel
//                     </button>
//                     <button className="bg-blue-500 text-white p-2 rounded" onClick={handleInterviewSubmit}>
//                   {fetchedInterview ? "Update" : "Save"}
//                 </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InterviewTable;


