import { useState, useEffect } from "react";

import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from 'react-router-dom'

import axiosInstance from "./axiosConfig";
import { useParams } from "react-router-dom";
import * as XLSX from 'xlsx'; // Import the xlsx library

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const FamilyDetails = () => {
  // State variables
  const { employeeId } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Relation: "",
    Phonenumber: "",
    CountryCode: "+91",
    memberId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const userRole = localStorage.getItem("UserRole");
  // const ROLE_EMPLOYEE = "ROLE_EMPLOYEE"; 

  const exportToExcel = () => {
    // Create a worksheet from tableData
    const worksheet = XLSX.utils.json_to_sheet(tableData.length ? tableData : [{
      Name: '',
      Relation: '',
      Phonenumber: '',
      CountryCode: '',
    }]);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Family Details');

    // Export the workbook to a file
    XLSX.writeFile(workbook, `FamilyDetails_${employeeId}.xlsx`);
  };
  const fetchFamilyDetails = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      console.log(`Fetching data for employeeId: ${employeeId}`); // Debugging employeeId

      // Fetch family details from API
      const response = await axiosInstance.get(
        `hrmsapplication/familyDetails/${employeeId}`
      );

      console.log("API Response:", response.data); // Check API response

      const data = response.data;

      if (data && Array.isArray(data)) {
        const familyData = data.map((item) => ({
          memberId: item.memberId,
          Name: item.name,
          Relation: item.relation,
          Phonenumber: item.phoneNumber,
          CountryCode: item.countryCode,
        }));

        setTableData(familyData);
      } else {
        setApiError("No family details found.");
      }
    } catch (error) {
      console.error("Error fetching Family Details:", error);
      toast.error("kindly recheck the Form");
      setApiError("Failed to fetch family details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    if (employeeId) {
      fetchFamilyDetails(); // Trigger only if employeeId is valid
    }
  }, [employeeId]);
  // Validation Functions

  // Validate the Name field
  const validateName = (name) => {
    let error = "";
    if (!name) {
      error = "Name is required.";
    } else if (name.length < 3 || name.length > 40) {
      error = "Name should be between 3 and 40 characters.";
    } else if (/^\s/.test(name)) {
      error = "Name should not start with a space.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      error = "Name should contain only alphabets and spaces.";
    }

    return error;
  };

  // Validate the Relation field
  const validateRelation = (relation) => {
    let error = "";

    if (!relation) {
      error = "Relation is required.";
    } else if (relation.length < 3 || relation.length > 40) {
      error = "Relation should be between 3 and 40 characters.";
    } else if (/^\s/.test(relation)) {
      error = "Relation should not start with a space.";
    } else if (!/^[A-Za-z\s-]+$/.test(relation)) {
      error = "Relation should contain only alphabets, spaces, and hyphens (-).";
    }

    return error;
  };

  // Validate the Phonenumber field
  const validatePhonenumber = (phonenumber, countryCode, tableData) => {
    let error = "";

    if (!countryCode) {
      error = "Country code is required.";
      return error; // Return early since phone number cannot be validated without country code
    }

    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const nonIndianPhoneRegex = /^[1-9]\d{9}$/;

    if (!phonenumber) {
      error = "Phone number is required.";
    } else if (countryCode === "+91") {
      if (!indianPhoneRegex.test(phonenumber)) {
        error =
          "Phone number for India must start with 6, 7, 8, or 9 and be exactly 10 digits.";
      }
    } else {
      if (!nonIndianPhoneRegex.test(phonenumber)) {
        error =
          "Phone number must not start with 0 and should be exactly 10 digits.";
      }
    }

    // Check for duplicate phone numbers excluding the current member in edit mode
    const isDuplicatePhone = tableData.some(
      (member) =>
        member.Phonenumber === phonenumber &&
        member.memberId !== formData.memberId
    );
    if (isDuplicatePhone) {
      error = "This phone number already exists.";
    }

    return error;
  };

  // Handle input changes and perform real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Perform validation based on the input field
    if (name === "Name") {
      const error = validateName(value);
      setFormErrors({ ...formErrors, Name: error });
    } else if (name === "Relation") {
      const error = validateRelation(value);
      setFormErrors({ ...formErrors, Relation: error });
    } else if (name === "Phonenumber" || name === "CountryCode") {
      const phonenumber =
        name === "Phonenumber" ? value : formData.Phonenumber;
      const countryCode =
        name === "CountryCode" ? value : formData.CountryCode;
      const error = validatePhonenumber(phonenumber, countryCode, tableData);
      setFormErrors({ ...formErrors, Phonenumber: error });
    }
  };

  // Validate the entire form before submission
  const validateForm = () => {
    const errors = {};

    const nameError = validateName(formData.Name);
    if (nameError) {
      errors.Name = nameError;
    }

    const relationError = validateRelation(formData.Relation);
    if (relationError) {
      errors.Relation = relationError;
    }

    const phonenumberError = validatePhonenumber(
      formData.Phonenumber,
      formData.CountryCode,
      tableData
    );
    if (phonenumberError) {
      errors.Phonenumber = phonenumberError;
    }

    return errors;
  };

  // Handle form submission for adding or editing a family member
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    // Check if the relation already exists (only when adding, not editing)
    const isRelationExists = tableData.some(
      (item) => item.Relation.toLowerCase() === formData.Relation.toLowerCase()
    );

    if (isRelationExists && !isEditMode) {
      setFormErrors({
        ...errors,
        Relation: "This relation already exists in the table.",
      });
      return;
    }

    // Check if the maximum family member limit is reached (limit: 8)
    if (!isEditMode && tableData.length >= 8) {
      alert("You can only add up to 8 family members.");
      return;
    }

    // Proceed only if there are no validation errors
    if (Object.keys(errors).length === 0) {
      try {
        const payload = {
          employeeId: employeeId,
          name: formData.Name.trim(),
          relation: formData.Relation,
          phoneNumber: formData.Phonenumber,
          countryCode: formData.CountryCode,
        };

        console.log("Submitting Payload:", payload);

        if (isEditMode) {

          console.log("Sending PATCH request to update family member");
          const response = await axiosInstance.patch(`hrmsapplication/familyDetails/updateFamilyDetails`, {
            ...payload,
            memberId: formData.memberId,
          });

          const updatedTableData = tableData.map((item) =>
            item.memberId === formData.memberId
              ? { ...item, ...payload }
              : item
          );
          setTableData(updatedTableData);
          fetchFamilyDetails();
          // Optimistically update the state immediately with the updated data
        } else {
          // POST request to add a new family member
          console.log("Sending POST request to add family member");

          const response = await axiosInstance.post(
            `hrmsapplication/familyDetails/createFamilyDetails?employeeId=${employeeId}`,
            payload
          );

          console.log("POST Response:", response.data);

          // Ensure the response contains the new family member's data
          if (!response.data || !response.data.memberId) {
            throw new Error("Invalid response from server: memberId missing.");
          }

          // Create a new family member object based on the response
          const newFamilyMember = {
            memberId: response.data.memberId,  // Using the memberId from the response
            ...payload,
          };

          // Optimistically update the table data with the new family member
          // setTableData((prevTableData) => [...prevTableData, newFamilyMember]);

          console.log("New Family Member Added:", newFamilyMember);
          fetchFamilyDetails();
        }

        // Close the popup and reset the form
        setIsPopupOpen(false); // Close the form popup
        setIsEditMode(false);  // Reset edit mode
        setFormData({
          Name: "",
          Relation: "",
          Phonenumber: "",
          CountryCode: "+91",
          memberId: "",
        });
        setFormErrors({});  // Clear any form errors

      } catch (error) {
        // Handle error gracefully with error logs and potential UI feedback
        console.error("Error saving family details:", error);
        toast.error("kindly recheck the Form");
      }
    } else {
      setFormErrors(errors); // Set validation errors if any
    }
  };








  const handleDelete = async (index) => {
    const familyMember = tableData[index];
    const { memberId, Name } = familyMember;

    if (window.confirm(`Are you sure you want to delete ${Name}?`)) {
      try {
        await axiosInstance.delete(`hrmsapplication/familyDetails/delete?employeeId=${employeeId}&memberId=${memberId}`);

        // Optimistically remove the deleted member from the table data
        const updatedTableData = tableData.filter((_, i) => i !== index);
        setTableData(updatedTableData); // Remove the family member immediately from the state
      } catch (error) {
        toast.error("kindly recheck the Form");
      }
    }
  };


  const handleEdit = (index) => {
    const member = tableData[index];
    setFormData({
      Name: member.Name,
      Relation: member.Relation,
      Phonenumber: member.Phonenumber,
      CountryCode: member.CountryCode,
      memberId: member.memberId,
    });
    setIsPopupOpen(true);
    setIsEditMode(true);
    setFormErrors({});
  };


  const handleAdd = () => {
    setIsPopupOpen(true);
    setIsEditMode(false);
    setFormData({
      Name: "",
      Relation: "",
      Phonenumber: "",
      CountryCode: "+91",
      memberId: "",
    });
    setFormErrors({});
  };


  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setFormData({
      Name: "",
      Relation: "",
      Phonenumber: "",
      CountryCode: "+91",
      memberId: "",
    });
    setFormErrors({});
  };

  return (
    <div>

      <div className="flex justify-between">
        <div className="flex items-center justify-start px-2 py-2 overflow-x-auto bg-blue-950 border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
                <FaLessThan className="text-white mr-2" />
                <Link to={`/dashboard/${employeeId}`}>
                  <button>
                    <span className="text font-semibold text-white">Previous Page</span>
                  </button>
                </Link>
              </div>
        <div onClick={exportToExcel} className="bg-blue-950 text-white hover:bg-gray-200 font-semibold text-center px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 mr-5 mb-5 mt-5">


          Export

        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mr-0 ml-0 md:mr-24 md:ml-24">
          <div className="bg-blue-950 text-white p-2 rounded-t-md flex justify-between items-center">
            <h2 className="font-semibold">Family Details</h2>
            {userRole === 'ROLE_ADMIN' && (
              <button className="flex items-center font-bold bg-green-500 px-3 py-1 rounded ml-2" onClick={handleAdd}>
                Add
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-400 text-center">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border border-gray-400 px-4 w-[33%] py-2">Name</th>
                  <th className="border border-gray-400 px-4 w-[33%] py-2">Relation</th>
                  <th className="border border-gray-400 px-4 w-[33%] py-2">Phone Number</th>
                  {userRole === 'ROLE_ADMIN' && (
                    <th className="border border-gray-400 px-4 py-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((data, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-4 py-2">{data.Name}</td>
                      <td className="border border-gray-400 px-4 py-2">{data.Relation}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        {data.CountryCode} {data.Phonenumber}
                      </td>
                      {userRole === 'ROLE_ADMIN' && (
                        <td className="py-3 px-4 border-b border-gray-400 text-center flex justify-center items-center space-x-4">
                          <TiPencil className="text-black cursor-pointer text-lg" onClick={() => handleEdit(index)} />
                          {index > 0 && (
                            <RiDeleteBin6Line className="text-black cursor-pointer text-lg" onClick={() => handleDelete(index)} />
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No Family Details Added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isPopupOpen && (
            <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
              <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto">

                <div className="flex justify-between items-center mb-6 bg-blue-950 rounded-lg px-3 py-2">
                  <h2 className="text-lg sm:text-base lg:text-lg  text-white  w-full">
                    {isEditMode ? "Edit Family Details" : "Enter Family Details"}
                  </h2>
                  <button onClick={handleCancel}>
                    <MdCancelPresentation size={24} className="text-white cursor-pointer" />
                  </button>
                </div>


                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    <div className="col-span-1">
                      <label className="block text-xs sm:text-sm mb-1">Name</label>
                      <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        minLength={3}
                        maxLength={40}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                      />
                      {formErrors.Name && <p className="text-red-600 text-xs mt-1">{formErrors.Name}</p>}
                    </div>


                    <div className="col-span-1">
                      <label className="block text-xs sm:text-sm mb-1">Relation</label>
                      <input
                        type="text"
                        name="Relation"
                        value={formData.Relation}
                        onChange={handleInputChange}
                        minLength={3}
                        maxLength={40}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                      />
                      {formErrors.Relation && <p className="text-red-600 text-xs mt-1">{formErrors.Relation}</p>}
                    </div>


                    <div className="col-span-2">
                      <label className="block text-xs sm:text-sm mb-1">Phone Number</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="CountryCode"
                          value={formData.CountryCode}
                          onChange={handleInputChange}
                          className={`border border-gray-300 rounded-lg text-xs sm:text-sm ${formErrors.CountryCode ? "border-red-500" : ""
                            }`}
                        >
                          <option value="">Select Code</option>
                          <option value="+91">+91 (INDIA)</option>
                          <option value="+1">+1 (USA)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (AUSTRALIA)</option>
                          <option value="+64">+64 (NEW ZEALAND)</option>
                          <option value="+27">+27 (SOUTH AFRICA)</option>
                          <option value="+977">+977 (NEPAL)</option>
                          <option value="+94">+94 (SRILANKA)</option>
                          <option value="+60">+60 (MALAYSIA)</option>
                          <option value="+65">+65 (SINGAPORE)</option>
                        </select>

                        <input
                          type="text"
                          name="Phonenumber"
                          value={formData.Phonenumber}
                          onChange={handleInputChange}
                          maxLength="10"
                          className={`w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm ${formErrors.Phonenumber ? "border-red-500" : ""
                            }`}
                        />
                      </div>
                      {formErrors.Phonenumber && (
                        <p className="text-red-600 text-xs mt-1">{formErrors.Phonenumber}</p>
                      )}
                    </div>
                  </div>


                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-xs sm:text-sm"
                    >
                      {isEditMode ? "Save" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FamilyDetails;