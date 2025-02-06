import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function LeaveForm() {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leaveType: '',
    count: '',
    carryForward: false,
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const leaves = [
    "SICKLEAVE", "EARNLEAVE", "CASUALLEAVE", "MATERNITYLEAVE",
    "MARRIAGELEAVE", "PATERNITYLEAVE", "RELIGIOUSFESTIVALLEAVES",
    "COMPENSATIONLEAVES", "MENSTRUATIONLEAVES"
  ];
  const leaveTypeMapping = {
    "SICKLEAVE": "Sick Leave",
    "EARNLEAVE": "Earn Leave",
    "CASUALLEAVE": "Casual Leave",
    "MATERNITYLEAVE": "Maternity Leave",
    "MARRIAGELEAVE": "Marriage Leave",
    "PATERNITYLEAVE": "Paternity Leave",
    "RELIGIOUSFESTIVALLEAVES": "Religious Festival Leaves",
    "COMPENSATIONLEAVES": "Compensation Leaves",
    "MENSTRUATIONLEAVES": "Menstruation Leaves"
  };

  const formatLeaveName = (leave) => {
    return leaveTypeMapping[leave];
  };

  useEffect(() => {
    const getLeaves = async () => {
      try {
        const response = await axiosInstance.get('hrmsapplication/leaves/getLeaves');
        setLeaveTypes(response.data);
        toast.success("Data loaded successfully!");
      } catch (error) {
        console.error('Error fetching leave types:', error);
        toast.error("Error fetching data!");
      }
    };
    getLeaves();
  }, []);

  const validate = () => {
    const newErrors = {};

    // const isLeaveTypeDuplicate = leaveType.some(
    //   (leave) => leave.leaveType === form.leaveType && !isEditing
    // );

    // if (!form.leaveType) {
    //   newErrors.leaveType = 'Leave type is required';
    // } else if (isLeaveTypeDuplicate) {
    //   newErrors.leaveType = 'Leave type is already selected';
    // }
    // if (isEditing && form.leaveType !== leaveType[editIndex]?.leaveType) {
    //   newErrors.leaveType = 'Leave type cannot be changed during edit.';
    // }

    if (!form.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }
    if (!form.count || form.count < 0) {
      newErrors.count = 'Count must be greater than zero';
    }


    if (!form.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'count') {
      const newCount = parseInt(value, 10);
      if (newCount < 1) {
        setForm((prev) => ({
          ...prev,
          [name]: prev[name],
        }));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    }));
  };

  // const handleAddOrEditLeave = async (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     try {
  //       if (isEditing) {
  //         const leaveId = leaveType[editIndex].id; 
  //         const updatedForm = { ...form, id: leaveId }; 

  //         const response = await axiosInstance.patch(
  //           `hrmsapplication/leaves/updateLeave`, 
  //           updatedForm 
  //         );

  //         // Update the specific leave type in the state
  //         setLeaveTypes((prev) =>
  //           prev.map((leave, index) => (index === editIndex ? response.data : leave))
  //         );
  //       } else {
  //         const response = await axiosInstance.post(`hrmsapplication/leaves/create`, form);
  //         // Add the new leave type to the state
  //         setLeaveTypes([...leaveType, response.data]);
  //       }

  //       resetForm();
  //       toast.success("Data updated successfully!"); // Success message
  //     } catch (error) {
  //       console.error('Error adding/editing leave type:', error);

  //       // Handle error and extract message
  //       let errorMessage = "Error occurred while adding/editing leave type.";
  //       if (error.response?.data) {
  //         if (error.response.data.detail) {
  //           errorMessage = error.response.data.detail; // Use the backend `detail` message
  //         } else if (error.response.data.message) {
  //           errorMessage = error.response.data.message; // Fallback to `message`
  //         } else if (typeof error.response.data === 'string') {
  //           errorMessage = error.response.data; // Handle string responses
  //         }
  //       } else if (error.message) {
  //         errorMessage = error.message; // Fallback to generic error message
  //       }

  //       toast.error(errorMessage); // Show error message in toast
  //     }
  //   }
  // };
  const handleAddOrEditLeave = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        if (isEditing) {
          if (form.leaveType !== leaveType[editIndex]?.leaveType) {
            toast.error("Leave type cannot be changed during update.");
            return; 
          }

          const leaveId = leaveType[editIndex].id;
          const updatedForm = { ...form, id: leaveId };

          const response = await axiosInstance.patch(
            `hrmsapplication/leaves/updateLeave`,
            updatedForm
          );

          
          setLeaveTypes((prev) =>
            prev.map((leave, index) => (index === editIndex ? response.data : leave))
          );

        } else {
         
          const response = await axiosInstance.post(`hrmsapplication/leaves/create`, form);
          setLeaveTypes([...leaveType, response.data]);
        }

        resetForm();
        toast.success("Data updated successfully!"); 
      } 
      // catch (error) {
      //   console.error('Error adding/editing leave type:', error);

      //   let errorMessage = "Error occurred while adding/editing leave type.";
      //   if (error.response?.data) {
      //     if (error.response.data.detail) {
      //       errorMessage = error.response.data.detail;
      //     } else if (error.response.data.message) {
      //       errorMessage = error.response.data.message;
      //     } else if (typeof error.response.data === 'string') {
      //       errorMessage = error.response.data;
      //     }
      //   } else if (error.message) {
      //     errorMessage = error.message;
      //   }

      //   toast.error(errorMessage);
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


  const handleEdit = (index) => {
    setForm(leaveType[index]);
    setEditIndex(index);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const leaveId = leaveType[index].leaveType;
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        await axiosInstance.delete(`hrmsapplication/leaves/${leaveId}`);
        setLeaveTypes((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting leave type:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setErrors({});
    setForm({
      leaveType: '',
      count: '',
      carryForward: false,
      description: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* {<ToastContainer /> } */}
      <div className="p-4">
        <NavLink
          to='/admindashboard'
          className="flex items-center justify-start p-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-10 mb-5 mt-5"
        >
          <FaLessThan className="text-white mr-2" />
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </NavLink>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-10"
        >
          + Add Leave
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 ml-10">
          {leaveType.map((leave, index) => (
            <div key={index} className="bg-white p-4 border rounded shadow hover:shadow-lg relative">
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaPencilAlt className='mr-2' />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              <h3 className="font-semibold text-lg">{formatLeaveName(leave.leaveType)}</h3>
              <p>Total LeaveForm: {leave.count}</p>
              {leave.carryForward && <p>Carry Forward: Yes</p>}
              <p className="text-gray-700 mt-2">{leave.description}</p>
            </div>
          ))}
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">
                {isEditing ? 'Edit Leave Type' : 'Add Leave Type'}
              </h2>
              <form onSubmit={handleAddOrEditLeave} className="space-y-4">
                <div>
                  <label className="block font-medium">Leave Type</label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Leave Type</option>
                    {leaves.map((option) => (
                      <option key={option} value={option}>
                        {formatLeaveName(option)}
                      </option>
                    ))}
                  </select>
                  {errors.leaveType && <p className="text-red-500">{errors.leaveType}</p>}
                </div>

                <div>
                  <label className="block font-medium">Count </label>
                  <input
                    type="numeric"
                    name="count"
                    value={form.count}
                    onChange={handleChange}
                    maxLength={2}
                    className="w-full p-2 border rounded"
                  />
                  {errors.count && <p className="text-red-500">{errors.count}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="carryForward"
                    checked={form.carryForward}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="font-medium">Carry Forward</label>
                </div>

                <div>
                  <label className="block font-medium">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  ></textarea>
                  {errors.description && <p className="text-red-500">{errors.description}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {isEditing ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveForm;

// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../axiosConfig';
// import { FaPencilAlt, FaTrash } from "react-icons/fa";
// import { NavLink } from 'react-router-dom';
// import { FaLessThan } from 'react-icons/fa';
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// function LeaveForm() {
//   const [showForm, setShowForm] = useState(false);
//   const [leaveType, setLeaveTypes] = useState([]);
//   const [form, setForm] = useState({
//     leaveType: '',
//     count: '',
//     carryForward: false,
//     description: '',
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [errors, setErrors] = useState({});


//   const formatLeaveType = (leaveType) => {
//     return leaveType
//       .toLowerCase()
//       .replace(/([a-z])([A-Z])/g, '$1 $2')
//       .replace(/leave/g, ' Leave')
//       .replace(/\b\w/g, (char) => char.toUpperCase());
//   };



//   useEffect(() => {
//     const getLeaves = async () => {
//       try {
//         const response = await axiosInstance.get('hrmsapplication/leaves/getLeaves');

//         setLeaveTypes(response.data);
//         toast.success("Data loaded successfully!");
//       } catch (error) {
//         console.error('Error fetching leave types:', error);
//         toast.error("Error fetching data!");
//       }
//     };
//     getLeaves();
//   }, []);


//   const validate = () => {
//     const newErrors = {};
//     const isLeaveTypeDuplicate = leaveType.some(
//       (leave) => leave.leaveType === form.leaveType && !isEditing
//     );

//     if (!form.leaveType) {
//       newErrors.leaveType = 'Leave type is required';
//     } else if (isLeaveTypeDuplicate) {
//       newErrors.leaveType = 'Leave type is already selected';
//     }

//     if (!form.count || form.count <= 0) {
//       newErrors.count = 'Count must be greater than zero';
//     }

//     if (!form.description) {
//       newErrors.description = 'Description is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'count') {
//       const newCount = parseInt(value, 10);
//       if (newCount < 1) {
//         setForm((prev) => ({
//           ...prev,
//           [name]: prev[name],
//         }));
//         return;
//       }
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
//     }));
//   };

//   const handleAddOrEditLeave = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       try {
//         if (isEditing) {
//           const leaveId = leaveType[editIndex].id;
//           const updatedForm = { ...form, id: leaveId };

//           const response = await axiosInstance.patch(
//             `hrmsapplication/leaves/updateLeave`,
//             updatedForm
//           );

//           setLeaveTypes((prev) =>
//             prev.map((leave, index) => (index === editIndex ? response.data : leave))
//           );
//         } else {
//           const response = await axiosInstance.post(`hrmsapplication/leaves/create`, form);
//           setLeaveTypes([...leaveType, response.data]);
//         }
//         resetForm();
//         toast.success("Data updated successfully!");
//       } catch (error) {
//         console.error('Error adding/editing leave type:', error);
//         toast.error("Error fetching data!");
//         if (error.response) {
//           console.error('Error response:', error.response.data);
//           alert(`Error: ${error.response.data.message || 'An error occurred'}`);
//         }
//       }
//     }
//   };

//   const handleEdit = (index) => {
//     setForm(leaveType[index]);
//     setEditIndex(index);
//     setIsEditing(true);
//     setShowForm(true);
//   };

//   const handleDelete = async (index) => {
//     const leaveId = leaveType[index].leaveType;
//     if (window.confirm('Are you sure you want to delete this leave type?')) {
//       try {
//         await axiosInstance.delete(`hrmsapplication/leaves/${leaveId}`);
//         setLeaveTypes((prev) => prev.filter((_, i) => i !== index));
//       } catch (error) {
//         console.error('Error deleting leave type:', error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setShowForm(false);
//     setIsEditing(false);
//     setErrors({});
//     setForm({
//       leaveType: '',
//       count: '',
//       carryForward: false,
//       description: '',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">

//       <div className="p-4">
//         <NavLink
//           to='/admindashboard'
//           className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5"
//         >
//           <FaLessThan className="text-orange-500 mr-2" />
//           <button>
//             <span className="text font-semibold text-orange-500">Previous Page</span>
//           </button>
//         </NavLink>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           + Add Leave
//         </button>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
//           {leaveType.map((leave, index) => (
//             <div key={index} className="bg-white p-4 border rounded shadow hover:shadow-lg relative">
//               <div className="absolute top-2 right-2 space-x-2">
//                 <button
//                   onClick={() => handleEdit(index)}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   <FaPencilAlt className='mr-2' />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//               <h3 className="font-semibold text-lg">{formatLeaveType(leave.leaveType)}</h3>
//               <p>Total Leave Count: {leave.count}</p>
//               {leave.carryForward && <p>Carry Forward: Yes</p>}
//               <p className="text-gray-700 mt-2">{leave.description}</p>
//             </div>
//           ))}
//         </div>
//         {showForm && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
//               <h2 className="text-lg font-semibold mb-4">
//                 {isEditing ? 'Edit Leave Type' : 'Add Leave Type'}
//               </h2>
//               <form onSubmit={handleAddOrEditLeave} className="space-y-4">
//                 <div>
//                   <label className="block font-medium">Leave Type</label>
//                   <select
//                     id="leaveType"
//                     name="leaveType"
//                     value={form.leaveType}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                   >
//                     <option value="">Select Leave Type</option>
//                     {leaveType.map((option) => (
//                       <option key={option.leaveType} value={option.leaveType}>
//                         {formatLeaveType(option.leaveType)}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.leaveType && <p className="text-red-500">{errors.leaveType}</p>}
//                 </div>

//                 <div>
//                   <label className="block font-medium">Count </label>
//                   <input
//                     type="text"
//                     name="count"
//                     value={form.count}
//                     onChange={handleChange}
//                     maxLength={2}
//                     className="w-full p-2 border rounded"
//                   />
//                   {errors.count && <p className="text-red-500">{errors.count}</p>}
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="carryForward"
//                     checked={form.carryForward}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   <label className="font-medium">Carry Forward</label>
//                 </div>

//                 <div>
//                   <label className="block font-medium">Description</label>
//                   <textarea
//                     name="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                   />
//                   {errors.description && <p className="text-red-500">{errors.description}</p>}
//                 </div>

//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                   >
//                     {isEditing ? 'Save Changes' : 'Add Leave'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LeaveForm;


