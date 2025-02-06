// import React, { useState, useEffect, useDebugValue } from 'react';
// //import { Link } from 'react-router-dom';
// import axiosInstance from '../axiosConfig';
// import { Link } from 'react-router-dom';
// import { FaLessThan} from "react-icons/fa";



// const calculateDuration = async (startDate, endDate, isHalfDay) => {
//   const weekends = [0, 6]; 
//   let duration = 0;
//   let current = new Date(startDate);

//   while (current <= new Date(endDate)) {
//     if (!weekends.includes(current.getDay())) {
//       duration++;
//     }
//     current.setDate(current.getDate() + 1);
//   }
//   return isHalfDay ? duration - 0.5 : duration;
// };

// const LeaveRequest = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [appliedDate, setAppliedDate] = useState('');
//   const [leaveName, setLeaveName] = useState('');
//   const [isHalfDay, setIsHalfDay] = useState(false);
//   const [totalDuration, setTotalDuration] = useState(0);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [comments, setComments] = useState('');
//   const [errors, setErrors] = useState({});
//   const EmpId = localStorage.getItem('EmpId');

//   const today = new Date();
//   const todayStr = today.toISOString().split('T')[0]; 

//   useEffect(() => {
//     const getAvailableLeaves = async () => {
//       try {
//         const response = await axiosInstance.get(`hrmsapplication/leaves/getAvailableLeaveTypes`);
//         setLeaveTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching leave types:', error);
//       }
//     };
//     getAvailableLeaves();
//   }, []);

//   const pastWeekDate = new Date();
//   let workingDays = 7;
//   while (workingDays > 0) {
//     pastWeekDate.setDate(pastWeekDate.getDate() - 1);
//     const day = pastWeekDate.getDay();
//     if (day !== 0 && day !== 6) workingDays--;
//   }
//   const pastWeekStr = pastWeekDate.toISOString().split('T')[0];

//   // Calculate the date one year from today
//   const oneYearFromToday = new Date();
//   oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
//   const oneYearLaterStr = oneYearFromToday.toISOString().split('T')[0];

//   useEffect(() => {
//     if (startDate && endDate && !errors.startDate && !errors.endDate) {
//       calculateDuration(startDate, endDate, isHalfDay).then(setTotalDuration);
//     }
//   }, [startDate, endDate, isHalfDay, errors]);

//   const validateDates = () => {
//     const newErrors = {};
//     const applied = new Date(appliedDate);
//     const start = new Date(startDate);
//     const end = new Date(endDate);
  
//     if (!appliedDate) {
//       newErrors.appliedDate = 'Applied date is required.';
//     } else if (applied < pastWeekDate || applied > oneYearFromToday) {
//       newErrors.appliedDate = 'Applied date must be within the last 7 working days or up to 1 year ahead.';
//     }
  
//     if (!startDate) {
//       newErrors.startDate = 'Start date is required.';
//     } else if (start < pastWeekDate || start > oneYearFromToday) {
//       newErrors.startDate = 'Start date must be within the last 7 working days or up to 1 year ahead.';
//     }
  
//     // Modify this condition to allow today as a valid end date
//     if (endDate && end < new Date(todayStr).setHours(0, 0, 0, 0)) {
//       newErrors.endDate = 'End date cannot be in the past.';
//     }
  
//     if (startDate && endDate && start > end) {
//       newErrors.endDate = 'End date cannot be before the start date.';
//     }
  
//     if (!totalDuration) {
//       newErrors.duration = 'Duration is required.';
//     }
  
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (validateDates()) {
//       try {
//         const leaveData = {
//           employeeId:EmpId,
//           startDate,
//           endDate,
//           appliedDate,
//           leaveName,
//           isHalfDay,
//           duration: totalDuration,
//           comments,
//         };
  
//         const response = await axiosInstance.post(`hrmsapplication/leave/create`, leaveData);
  
//         if (response.status === 200) {
//           alert('Leave applied successfully!');
//           setStartDate('');
//           setEndDate('');
//           setAppliedDate('');
//           setLeaveName('');
//           setIsHalfDay(false);
//           setTotalDuration('');
//           setComments('');
//           setErrors({});
//         }
//       } catch (error) {
//         console.error('Error applying for leave:', error);
//         alert('Failed to apply for leave. Please try again later.');
//       }
//     }
//   };
  

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//         <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
//                 <FaLessThan className="text-orange-500 mr-2" />
//                 <Link to="/userdashboard"> <button><span className="text font-semibold text-orange-500">Previous Page</span></button>
//                 </Link>
//         </div>
//       <div className="flex justify-between items-center mb-4">
//       <h1 className="text-lg font-semibold text-black">Leaves Masters</h1>

//         <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
//           <Link to="/LeaveBalance">Leave Balance</Link>
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 md:p-8">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm mb-1">Applied Date</label>
//           <input
//             type="date"
//             value={appliedDate}
//             onChange={(e) => setAppliedDate(e.target.value)}
//             className="border rounded-md w-full px-3 py-2 text-sm"
//             min={pastWeekStr}
//             max={oneYearLaterStr}
//           />
//           {errors.appliedDate && <span className="text-red-500 text-xs">{errors.appliedDate}</span>}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-gray-700 text-sm mb-1">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border rounded-md w-full px-3 py-2 text-sm"
//               min={pastWeekStr}
//               max={oneYearLaterStr}
//             />
//             {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate}</span>}
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm mb-1">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="border rounded-md w-full px-3 py-2 text-sm"
//               min={todayStr}
//             />
//             {errors.endDate && <span className="text-red-500 text-xs">{errors.endDate}</span>}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm mb-1">Leave Name</label>
//           <select
//             value={leaveName}
//             onChange={(e) => setLeaveName(e.target.value)}
//             className="border rounded-md w-full px-3 py-2 text-sm"
//           >
//             <option value="">Select Leave</option>
//             {leaveTypes.map((type) => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center mb-4">
//           <input
//             type="checkbox"
//             checked={isHalfDay}
//             onChange={(e) => setIsHalfDay(e.target.checked)}
//             className="mr-2"
//           />
//           <label className="text-gray-700 text-sm">Select half-day leave</label>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm mb-1">Total Duration</label>
//           <input
//             type="text"
//             value={totalDuration}
//             readOnly
//             className="border rounded-md w-full px-3 py-2 bg-gray-100 text-sm"
//           />
//           {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm mb-1">Request Comments</label>
//           <textarea
//             value={comments}
//             onChange={(e) => setComments(e.target.value)}
//             maxLength={100}
//             className="border rounded-md w-full px-3 py-2 text-sm"
//             rows={3}
//           ></textarea>
//           <span className="text-xs text-gray-500">{100 - comments.length} characters left</span>
//         </div>

//         <div className="flex justify-end space-x-4">
//           <button type="button" className="border border-gray-400 px-3 py-1 rounded-md text-sm">Cancel</button>
//           <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LeaveRequest;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Link } from 'react-router-dom';
import { FaLessThan } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

// const calculateDuration = async (startDate, endDate, isHalfDay) => {
//   const weekends = [0, 6]; 
//   let duration = 0;
//   let current = new Date(startDate);

//   while (current <= new Date(endDate)) {
//     if (!weekends.includes(current.getDay())) {
//       duration++;
//     }
//     current.setDate(current.getDate() + 1);
//   }
//   return isHalfDay ? duration - 0.5 : duration;
// };
const calculateDuration = async (startDate, endDate, isHalfDay) => {
  let duration = 0;
  let current = new Date(startDate);

  while (current <= new Date(endDate)) {
    duration++; 
    current.setDate(current.getDate() + 1);
  }

  return isHalfDay ? duration - 0.5 : duration;
};

  const formatLeaveType = (leaveType) => {
    return leaveType
      .toLowerCase()
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/leave/g, ' Leave')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

const LeaveRequest = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [appliedDate, setAppliedDate] = useState('');
  const [leaveName, setLeaveName] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});
  const EmpId = localStorage.getItem('EmpId');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; 

  useEffect(() => {
    const getAvailableLeaves = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/leaves/getAvailableLeaveTypes`);
        setLeaveTypes(response.data);
        toast.success("Data loaded successfully!");
      } 
      // catch (error) {
      //   console.error('Error fetching leave types:', error);
      //   toast.error("Error fetching data!");
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
    getAvailableLeaves();
  }, []);

  // const pastWeekDate = new Date();
  
  // let workingDays = 7;
  // while (workingDays > 0) {
  //   pastWeekDate.setDate(pastWeekDate.getDate() - 1);
  //   const day = pastWeekDate.getDay();
  //   if (day !== 0 && day !== 6) workingDays--;
  // }
  
  // const pastWeekStr = pastWeekDate.toISOString().split('T')[0];

  const pastWeekDate = new Date();
const daysToSubtract = 7;
pastWeekDate.setDate(pastWeekDate.getDate() - daysToSubtract);
const pastWeekStr = pastWeekDate.toISOString().split('T')[0];

  const oneYearFromToday = new Date();
  oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
  const oneYearLaterStr = oneYearFromToday.toISOString().split('T')[0];

  useEffect(() => {
    if (startDate && endDate && !errors.startDate && !errors.endDate) {
      calculateDuration(startDate, endDate, isHalfDay).then(setTotalDuration);
    }
  }, [startDate, endDate, isHalfDay, errors]);

  const validateDates = () => {
    const newErrors = {};
    // const applied = new Date(appliedDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // if (!appliedDate) {
    //   newErrors.appliedDate = 'Applied date is required.';
    // } else if (applied < pastWeekDate || applied > oneYearFromToday) {
    //   newErrors.appliedDate = 'Applied date must be within the last 7 working days or up to 1 year ahead.';
    // }
  
    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    } else if (start < pastWeekDate || start > oneYearFromToday) {
      newErrors.startDate = 'Start date must be within the last 7 working days or up to 1 year ahead.';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    } 
    if (!comments) {
      newErrors.comments = 'Comments is required.';
    } 
  
    // if (endDate && end < new Date(todayStr).setHours(0, 0, 0, 0)) {
    //   newErrors.endDate = 'End date cannot be in the past.';
    // }
  
    if (startDate && endDate && start > end) {
      if (start !== end) {
        newErrors.endDate = 'End date cannot be before the start date.';
      }
    }
    if (!totalDuration) {
      newErrors.duration = 'Duration is required.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateDates()) {
      try {
        const leaveData = {
          employeeId: EmpId,
          startDate,
          endDate,
          // appliedDate,
          leaveName,
          isHalfDay,
          duration: totalDuration,
          comments,
        };
  
        const response = await axiosInstance.post(`hrmsapplication/leave/create`, leaveData);
  
        if (response.status === 200) {
          alert('Leave applied successfully!');
          setStartDate('');
          setEndDate('');
          // setAppliedDate('');
          setLeaveName('');
          setIsHalfDay(false);
          setTotalDuration('');
          setComments('');
          setErrors({});
        }
        toast.success("Data loaded successfully!"); 
      }
      //  catch (error) {
      //   console.error('Error applying for leave:', error);
      //   toast.error("Error fetching data!");
  
      //   if (error.response && error.response.status === 400) {
      //     const validationErrors = error.response.data.errors;
  
      //     if (validationErrors) {
      //       const errorMessages = Object.keys(validationErrors).map(
      //         (field) => `${field}: ${validationErrors[field].join(', ')}`
      //       );
      //       alert(`There were validation errors:\n\n${errorMessages.join('\n')}`);
      //     } else {
      //       alert('There was an issue with the data you entered. Please check and try again.');
      //     }
      //   } else {
      //     alert('Failed to apply for leave. Please try again later.');
      //   }
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {  /* ToastContainer to display toasts */}
      <div className="flex items-center justify-start px-2 py-2 overflow-x-auto bg-blue-950 border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <Link to="/userdashboard">
          <button><span className="text font-semibold text-white">Previous Page</span></button>
        </Link>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-black"> Apply Leave </h1>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
          <Link to="/LeaveBalance">Leave Balance</Link>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 md:p-8">
        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Applied Date</label>
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className="border rounded-md w-full px-3 py-2 text-sm"
            min={pastWeekStr}
            max={oneYearLaterStr}
          />
          {errors.appliedDate && <span className="text-red-500 text-xs">{errors.appliedDate}</span>}
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Start Date :</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md w-full px-3 py-2 text-sm"
              min={pastWeekStr}
              max={oneYearLaterStr}
            />
            {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate}</span>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">End Date :</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md w-full px-3 py-2 text-sm"
              min={pastWeekStr}
              max={oneYearLaterStr}
            />
            {errors.endDate && <span className="text-red-500 text-xs">{errors.endDate}</span>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Leave Type :</label>
          <select
            value={leaveName}
            onChange={(e) => setLeaveName(e.target.value)}
            className="border rounded-md w-full px-3 py-2 text-sm"
          >
            <option value="">Select Leave</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>{formatLeaveType(type)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isHalfDay}
            onChange={(e) => setIsHalfDay(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700 text-sm">Select half-day leave</label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Total Duration :</label>
          <input
            type="number"
            value={totalDuration}
            readOnly
            className="border rounded-md w-full px-3 py-2 text-sm"
          />
          {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Comments :</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="border rounded-md w-full px-3 py-2 text-sm"
            rows="3"
            maxLength={100}
          />
                    {errors.comments && <span className="text-red-500 text-xs">{errors.comments}</span>}

        </div>
        <span className="text-xs text-gray-500">{100 - comments.length} characters left</span>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Apply for Leave
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequest;
