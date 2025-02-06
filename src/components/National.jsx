import { useState, useEffect } from 'react';
import { FaPen, FaTrash, FaRegWindowClose, FaLessThan } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import axiosInstance from './axiosConfig';

const NationalIDDetails = () => {
  const { employeeId } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nationalIdType: '',
    name: '',
    nationalIDNum: '',
    country: '',
    isPrimaryID: false,
    // unid: '',               
    // employeeId: '' 
  });


  const [formErrors, setFormErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const userRole = localStorage.getItem("UserRole");
  useEffect (()=>{
    console.log(formData,"useEffect");
  }, [formData])


  useEffect(() => {
    const fetchNationalID = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/nationalID/getNationalID/${employeeId}`);
        const data = response.data;
        setTableData(data)
        setFormData({
          nationalIdType: data.nationalIdType,
          name: data.name,
          nationalIDNum: data.nationalIDNum,
          country: data.country,
          isPrimaryID: data.primary,
          employeeId: data.employeeId,

          unid: data.unid,
        });
        console.log("Fetched data:", data);
      } catch (error) {
        console.error('Error fetching National ID Details:', error);
        toast.error("kindly recheck the Form");
      }
    };
    fetchNationalID();
  }, [employeeId]);


  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    // Handle checkbox type inputs (boolean values)
    if (type === 'checkbox') {
      newValue = checked; // This will be true or false, not "on" or "off"
    } else {
      // Handle other input types, including formatting for specific fields
      if (name === 'nationalIDNum') {
        if (formData.nationalIdType === 'PANCARD') {
          // For Pancard, allow only 5 letters, 4 digits, 1 letter
          newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only allow letters and numbers
          if (newValue.length <= 5) {
            newValue = newValue.replace(/[^A-Z]/g, ''); // First 5 should be letters
          } else if (newValue.length <= 9) {
            newValue = newValue.slice(0, 5) + newValue.slice(5).replace(/[^0-9]/g, ''); // Next 4 should be digits
          } else {
            newValue = newValue.slice(0, 9) + newValue.slice(9).replace(/[^A-Z]/g, ''); // Last 1 should be a letter
          }
        } else if (formData.nationalIdType === 'AADHAR') {
          newValue = newValue.replace(/\D/g, '').slice(0, 12); // Remove non-digits and limit to 12 digits
        } else if (formData.nationalIdType === 'VOTERID') {
          newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only allow letters and numbers
          if (newValue.length <= 3) {
            newValue = newValue.replace(/[^A-Z]/g, ''); // First 3 should be letters
          } else {
            newValue = newValue.slice(0, 3) + newValue.slice(3).replace(/[^0-9]/g, ''); // Next 7 should be digits
          }
        }
      }
    }

    setFormData({ ...formData, [name]: newValue });
    setFormErrors({ ...formErrors, [name]: '' });
  };



  const validateForm = () => {
    const errors = {};

    // Validate National ID Number based on selected type
    if (!formData.nationalIDNum) {
      errors.nationalIDNum = "National ID Number is required.";
    } else {
      if (formData.nationalIdType === 'AADHAR' && !/^\d{12}$/.test(formData.nationalIDNum)) {
        errors.nationalIDNum = "AADHAR must be 12 digits.";
      } else if (formData.nationalIdType === 'PANCARD' && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.nationalIDNum)) {
        errors.nationalIDNum = "PANCARD must be in the format ABCDE1234E.";
      } else if (formData.nationalIdType === 'VOTERID' && !/^[A-Z]{3}[0-9]{7}$/.test(formData.nationalIDNum)) {
        errors.nationalIDNum = "VOTERID must be in the format ABC1234567.";
      }
    }

    return errors;
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    const isIdTypeExists = tableData.some((item) => item.nationalIdType === formData.nationalIdType);

    if (isIdTypeExists && !isEditMode) {
      setFormErrors({ ...errors, nationalIdType: 'This ID Type already exists in the table.' });
      return;
    }

    if (Object.keys(errors).length === 0) {
      let updatedTableData = [...tableData];

      if (formData.isPrimaryID) {
        updatedTableData = updatedTableData.map(item => ({ ...item, isPrimaryID: false }));
      }

      try {
        const payload = {
          nationalIdType: formData.nationalIdType,
          name: formData.name,
          nationalIDNum: formData.nationalIDNum,
          country: formData.country,
          primary: formData.isPrimaryID,  // This should now be a boolean (true or false)
          employeeId: formData.employeeId,
          unid: formData.unid,
        };

        if (isEditMode) {
          const response = await axiosInstance.patch(
            `hrmsapplication/nationalID/updateNationalID`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("PATCH Response Data:", response.data);

          // Update formData to reflect the updated nationalIdType and other details
          setFormData({
            ...formData,
            nationalIdType: response.data.nationalIdType, // Ensure the ID type is updated from response
            name: response.data.name,
            nationalIDNum: response.data.nationalIDNum,
            country: response.data.country,
            isPrimaryID: response.data.primary,
          });

          // Update the tableData with new data after patch
          const updatedTableData = tableData.map((item) =>
            item.employeeId === formData.employeeId && item.unid === formData.unid
              ? { ...item, ...payload }
              : item
          );

          setTableData(updatedTableData);
        } else {
          const response = await axiosInstance.post(
            `hrmsapplication/nationalID/createNationalID?employeeId=${employeeId}`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("POST Response Data:", response.data);
          const newnationalID = { ...payload, employeeId: response.data.employeeId, unid: response.data.unid };
          setTableData([...tableData, newnationalID]);
        }

        setIsPopupOpen(false);
        setIsEditMode(false);
        setFormErrors({});
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
    } else {
      setFormErrors(errors);
    }
  };


  const handleDelete = async (employeeId, nationalIdType, index) => {
    try {
      console.log('Deleting ID for employee:', employeeId, 'with National ID type:', nationalIdType);

      // Send DELETE request to the API, ensuring the URL format is correct
      const response = await axiosInstance.delete(
        `hrmsapplication/nationalID/delete/${employeeId}?nationalIdType=${nationalIdType}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("DELETE Response:", response.data);

      // Remove the deleted entry from the tableData
      let updatedTableData = tableData.filter((_, i) => i !== index);

      // Ensure there is always a primary ID
      if (updatedTableData.length > 0 && !updatedTableData.some(item => item.isPrimaryID)) {
        updatedTableData[0].isPrimaryID = true;
      }

      // Update the state with the updated data
      setTableData(updatedTableData);

      console.log("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting entry:", error.response?.data || error.message);
      toast.error("kindly recheck the Form");

    }
  };




  const handleEdit = (index) => {
    setFormData({ ...tableData[index], index });
    setIsPopupOpen(true);
    setIsEditMode(true);
    console.log({ ...tableData[index], index })
    console.log(formData)
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setFormData({
      nationalIdType: '',
      name: '',
      nationalIDNum: '',
      country: '',
      isPrimaryID: false
    });
    setFormErrors("")
  };

  return (
    <>

      <div className="flex items-center justify-start p-2 overflow-x-auto border-2 border-gray-800 bg-blue-950 rounded-md w-40 ml-4 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/dashboard/${employeeId}`}>
          <button><span className="font-semibold text-white">Previous Page</span></button>
        </Link>
      </div>

      <div className="mx-4 md:mx-16 lg:mx-48 border border-black  relative">
        <div className="bg-blue-950 text-white p-2 flex justify-between items-center">
          <h2 className="font-semibold">National ID Details</h2>
          {userRole === 'ROLE_ADMIN' && (
            <button
              className="absolute top-12 right-2 flex items-center text-white font-bold bg-green-500 px-3 py-1 rounded shadow-lg hover:bg-green-600"
              onClick={() => setIsPopupOpen(true)}
            >
              Add
            </button>
          )}
        </div>

        <div className="bg-white p-3 border-t border-black flex justify-between items-center">
          <span className="font-semibold">National ID Details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-gray-400 px-4 py-2 w-1/6">ID Type</th>
                <th className="border border-gray-400 px-4 py-2 w-1/6">Name</th>
                <th className="border border-gray-400 px-4 py-2 w-1/6">ID Number</th>
                <th className="border border-gray-400 px-4 py-2 w-1/6">Country</th>
                {userRole === 'ROLE_ADMIN' && (
                  <th className="border border-gray-400 px-4 py-2 w-1/6">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No National ID Details Added
                  </td>
                </tr>
              ) : (
                tableData.map((data, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.nationalIdType}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.name}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.nationalIDNum}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.country}</td>
                    {userRole === 'ROLE_ADMIN' && (
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <FaPen
                            size={17}
                            className="inline cursor-pointer"
                            onClick={() => handleEdit(index)}
                          />
                          {index > 0 && (
                            <FaTrash
                              size={17}
                              className="inline cursor-pointer"
                              onClick={() =>
                                handleDelete(data.employeeId, data.nationalIdType, index)
                              }
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isPopupOpen && (
          <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
              <div className="flex justify-between items-center mb-8 bg-blue-950 rounded-lg pl-2 pr-2 w-full p-2">
                <h2 className="text-lg text-white w-full">
                  {isEditMode ? 'Edit' : 'Add'} National ID Details
                </h2>
                <button
                  className="text-white cursor-pointer"
                  onClick={handleCancel}
                >
                  <FaRegWindowClose size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                  {/* ID Type */}
                  <div className="col-span-1">
                    <label className="block mb-1">ID Type:</label>
                    <select
                      name="nationalIdType"
                      value={formData.nationalIdType}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded-lg"
                      disabled={isEditMode}
                    >
                      <option value="">Select ID</option>
                      <option value="AADHAR">AADHAR</option>
                      <option value="PANCARD">PANCARD</option>
                      <option value="VOTERID">VOTERID</option>
                    </select>
                    {isEditMode && (
                      <p className="text-red-600 text-sm mt-1">
                        ID Type cannot be changed in edit mode.
                      </p>
                    )}
                    {formErrors.nationalIdType && !isEditMode && (
                      <p className="text-red-600 text-sm mt-1">
                        {formErrors.nationalIdType}
                      </p>
                    )}
                  </div>
                  {/* Name */}
                  <div className="col-span-1">
                    <label className="block mb-1">Name as per Doc:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                          setFormData({ ...formData, name: value });
                          setFormErrors({ ...formErrors, name: '' });
                        }
                      }}
                      className="w-full p-1 border border-gray-300 rounded-lg"
                    />
                    {formErrors.name && (
                      <p className="text-red-600 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  {/* National ID Number */}
                  <div className="col-span-1">
                    <label className="block mb-1">National ID Number:</label>
                    <input
                      type="text"
                      name="nationalIDNum"
                      value={formData.nationalIDNum}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded-lg"
                      placeholder={
                        formData.nationalIdType === 'PANCARD'
                          ? 'ABCDE1234E'
                          : formData.nationalIdType === 'AADHAR'
                            ? '1234 5678 9012'
                            : formData.nationalIdType === 'VOTERID'
                              ? 'ABC1234567'
                              : 'Enter ID Number'
                      }
                      maxLength={
                        formData.nationalIdType === 'AADHAR'
                          ? 12
                          : formData.nationalIdType === 'VOTERID'
                            ? 10
                            : 10
                      }
                    />
                    {formErrors.nationalIDNum && (
                      <p className="text-red-600 text-sm mt-1">
                        {formErrors.nationalIDNum}
                      </p>
                    )}
                  </div>
                  {/* Country */}
                  <div className="col-span-1">
                    <label className="block mb-1">Country:</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                          setFormData({ ...formData, country: value });
                          setFormErrors({ ...formErrors, country: '' });
                        }
                      }}
                      className="w-full p-1 border border-gray-300 rounded-lg"
                    />
                    {formErrors.country && (
                      <p className="text-red-600 text-sm mt-1">
                        {formErrors.country}
                      </p>
                    )}
                  </div>
                </div>
                {/* Submit & Cancel */}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    {isEditMode ? 'Update' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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

export default NationalIDDetails;