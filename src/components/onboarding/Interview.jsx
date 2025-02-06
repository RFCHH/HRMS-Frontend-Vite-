// import { useState } from 'react';
// import { FiEdit3 } from 'react-icons/fi';
// import {FaHome  } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const Interview = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     mobileNumber: '',
//     roleAppliedFor: '',
//     location: '',
//     interviewDate: '',
//     interviewerName: '',
//     interviewerId: '',
//     interviewerMailId: '',
//     modeOfInterview: '',
//     interviewStatus: '',
//     interviewScore: '',
//     interviewSessionFile: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [isEditing, setIsEditing] = useState(false);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'interviewSessionFile') {
//       setFormData({
//         ...formData,
//         [name]: e.target.files[0],
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsEditing(false); // Close the popup if the form is valid
//     }
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     // Full name validation
//     if (!formData.fullName.trim()) {
//       newErrors.fullName = 'Full name is required';
//     } else if (/^\s/.test(formData.fullName)) {
//       newErrors.fullName = 'Full name should not start with a space';
//     } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
//       newErrors.fullName = 'Full name must contain only alphabets and spaces';
//     } else if (formData.fullName.length < 3) {
//       newErrors.fullName = 'Full name must be at least 3 characters';
//     }

//     // Email validation
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (/^\s/.test(formData.email)) {
//       newErrors.email = 'Email should not start with a space';
//     } else if (!emailPattern.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Mobile number validation
//     const mobilePattern = /^[0-9]{10}$/;
//     if (!formData.mobileNumber.trim()) {
//       newErrors.mobileNumber = 'Mobile number is required';
//     } else if (!mobilePattern.test(formData.mobileNumber)) {
//       newErrors.mobileNumber = 'Mobile number must be 10 digits';
//     }

//     // Role applied validation
//     if (!formData.roleAppliedFor.trim()) {
//       newErrors.roleAppliedFor = 'Role applied for is required';
//     }

//     // Location validation
//     if (!formData.location.trim()) {
//       newErrors.location = 'Location is required';
//     }

//     // Interview date validation
//     if (!formData.interviewDate.trim()) {
//       newErrors.interviewDate = 'Interview date is required';
//     } else {
//       const currentYear = new Date().getFullYear();
//       const selectedYear = new Date(formData.interviewDate).getFullYear();
//       if (selectedYear !== currentYear) {
//         newErrors.interviewDate = 'Interview date must be within the current year';
//       }
//     }

//     // Interviewer name validation
//     if (!formData.interviewerName.trim()) {
//       newErrors.interviewerName = 'Interviewer name is required';
//     }

//     // Interviewer ID validation
//     if (!formData.interviewerId.trim()) {
//       newErrors.interviewerId = 'Interviewer ID is required';
//     }

//     // Interviewer email validation
//     if (!formData.interviewerMailId.trim()) {
//       newErrors.interviewerMailId = 'Interviewer email is required';
//     } else if (!emailPattern.test(formData.interviewerMailId)) {
//       newErrors.interviewerMailId = 'Please enter a valid email address';
//     }

//     // Mode of interview validation
//     if (!formData.modeOfInterview.trim()) {
//       newErrors.modeOfInterview = 'Mode of interview is required';
//     }

//     // Interview status validation
//     if (!formData.interviewStatus.trim()) {
//       newErrors.interviewStatus = 'Interview status is required';
//     }

//     // Interview score validation
//     if (!formData.interviewScore.trim()) {
//       newErrors.interviewScore = 'Interview score is required';
//     } else if (isNaN(formData.interviewScore) || formData.interviewScore < 0 || formData.interviewScore > 100) {
//       newErrors.interviewScore = 'Interview score must be a number between 0 and 100';
//     }

//     // Interview session file validation
//     if (!formData.interviewSessionFile) {
//       newErrors.interviewSessionFile = 'Interview session file is required';
//     } else {
//       const validFormats = ['image/png', 'image/jpeg', 'application/pdf'];
//       if (!validFormats.includes(formData.interviewSessionFile.type)) {
//         newErrors.interviewSessionFile = 'Interview session file must be in PNG, JPG, or PDF format';
//       } else if (formData.interviewSessionFile.size > 5 * 1024 * 1024) { // Limit to 5MB
//         newErrors.interviewSessionFile = 'Interview session file must be smaller than 5MB';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   return (
//     <div className="container mx-auto p-20">
//       {/* {/ Interview Details Section /} */}
//       <div className='flex items-center justify-start px-2 py-2 border-2 border-gray-800 rounded-md h-20 ml-3 mb-5'>
//           <FaHome className="text-black-500 mr-2" />
//           <button><link to=''></link><span className="text font-semibold text-black-500">Home</span></button>
//           <div className='flex items-center justify-center space-x-10 px-2 py-2 rounded-md w-full ml-3 mb-5 mt-5'>
//           <Link to='/interview'><button><span className="text font-semibold text-black-500">Interview Details Section</span></button></Link>
//           <Link to='/onboardingDocuments'><button><span className="text font-semibold text-black-500">Onboarding Documents Section</span></button></Link>
//           <Link to='/allEmployee'><button><span className="text font-semibold text-black-500">Profile Creation</span></button></Link>
//             <button><Link to='/payrollSection'></Link><span className="text font-semibold text-black-500">Pay Roll Section</span></button>
//           </div>
//         </div>  

//       <div className="border rounded-lg shadow-lg p-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-bold mb-4">Interview Details Section</h2>
//           <button onClick={() => setIsEditing(true)} className="text-gray-600">
//             <FiEdit3 size={24} />
//           </button>
//         </div>
//         <div className="grid grid-cols-3 gap-8 text-left">
//           <div>
//             <p className="font-bold">Full Name</p>
//             <p>{formData.fullName}</p>
//           </div>
//           <div>
//             <p className="font-bold">Email ID</p>
//             <p>{formData.email}</p>
//           </div>
//           <div>
//             <p className="font-bold">Mobile Number</p>
//             <p>{formData.mobileNumber}</p>
//           </div>
//           <div>
//             <p className="font-bold">Role Applied for</p>
//             <p>{formData.roleAppliedFor}</p>
//           </div>
//           <div>
//             <p className="font-bold">Location</p>
//             <p>{formData.location}</p>
//           </div>
//           <div>
//             <p className="font-bold">Interview Date</p>
//             <p>{formData.interviewDate}</p>
//           </div>
//           <div>
//             <p className="font-bold">Interviewer Name</p>
//             <p>{formData.interviewerName}</p>
//           </div>
//           <div>
//             <p className="font-bold">Interviewer ID</p>
//             <p>{formData.interviewerId}</p>
//           </div>
//           <div>
//             <p className="font-bold">Interviewer Mail ID</p>
//             <p>{formData.interviewerMailId}</p>
//           </div>
//           <div>
//             <p className="font-bold">Mode of Interview</p>
//             <p>{formData.modeOfInterview}</p>
//           </div>
//           <div>
//             <p className="font-bold">Interview Status</p>
//             <p>{formData.interviewStatus}</p>
//           </div>
//           <div>
//             <p className="font-bold">Interview Score</p>
//             <p>{formData.interviewScore}</p>
//           </div>
//         </div>
//       </div>

//     {isEditing && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-2/3 ">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Edit Details</h2>
//               <button onClick={() => setIsEditing(false)}>✕</button>
//             </div>
//             <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">

//               <div>
//                 <label className="block font-bold">Full Name</label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required />
//                 {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Email ID</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required />
//                 {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Mobile Number</label>
//                 <input
//                   type="tel"
//                   name="mobileNumber"
//                   value={formData.mobileNumber}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required/>
//                 {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
//               </div>
//              <div>
//                 <label className="block font-bold">Role Applied for</label>
//                 <input
//                   type="text"
//                   name="roleAppliedFor"
//                   value={formData.roleAppliedFor}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.roleAppliedFor ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required />
//                 {errors.roleAppliedFor && <p className="text-red-500 text-sm">{errors.roleAppliedFor}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required/>
//                 {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Interview Date</label>
//                 <input
//                   type="date"
//                   name="interviewDate"
//                   value={formData.interviewDate}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.interviewDate ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required/>
//                 {errors.interviewDate && <p className="text-red-500 text-sm">{errors.interviewDate}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Interviewer Name</label>
//                 <input
//                   type="text"
//                   name="interviewerName"
//                   value={formData.interviewerName}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.interviewerName ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required/>
//                 {errors.interviewerName && <p className="text-red-500 text-sm">{errors.interviewerName}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Interviewer ID</label>
//                 <input
//                   type="text"
//                   name="interviewerId"
//                   value={formData.interviewerId}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.interviewerId ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required/>
//                 {errors.interviewerId && <p className="text-red-500 text-sm">{errors.interviewerId}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Interviewer Mail ID</label>
//                 <input
//                   type="email"
//                   name="interviewerMailId"
//                   value={formData.interviewerMailId}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.interviewerMailId ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required/>
//                 {errors.interviewerMailId && <p className="text-red-500 text-sm">{errors.interviewerMailId}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Mode of Interview</label>
//                 <select
//                   name="modeOfInterview"
//                   value={formData.modeOfInterview}
//                   onChange={handleInputChange}
//                   className="border w-full p-2 rounded-lg"
//                   required>
//                     <option value="">select</option>
//                   <option value="Offline">Offline</option>
//                   <option value="Online">Online</option>
//                 </select>
//                 {errors.modeOfInterview && <p className="text-red-500 text-sm">{errors.modeOfInterview}</p>}
//               </div>
//              <div>
//                 <label className="block font-bold">Interview Status</label>
//                 <select
//                   name="interviewStatus"
//                   value={formData.interviewStatus}
//                   onChange={handleInputChange}
//                   className="border w-full p-2 rounded-lg" >
//                     <option value="">select</option>
//                   <option value="Passed">Passed</option>
//                   <option value="Failed">Failed</option>
//                 </select>
//                 {errors.interviewStatus && <p className="text-red-500 text-sm">{errors.interviewStatus}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Interview Score</label>
//                 <input
//                   type="number"
//                   name="interviewScore"
//                   value={formData.interviewScore}
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.interviewScore ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required />
//                 {errors.interviewScore && <p className="text-red-500 text-sm">{errors.interviewScore}</p>}
//               </div>
//               <div>
//                 <label className="block font-bold">Upload Interview Session File</label>
//                 <input
//                   type="file"
//                   name="interviewSessionFile"
//                   onChange={handleInputChange}
//                   className={`w-full p-2 border ${errors.interviewSessionFile ? 'border-red-500' : 'border-gray-300'} rounded`}
//                   required />
//                 {errors.interviewSessionFile && <p className="text-red-500 text-sm">{errors.interviewSessionFile}</p>}
//               </div>
//               <div className="col-span-2 flex justify-end">
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white py-2 px-4 rounded" >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Interview;