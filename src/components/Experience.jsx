import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import axiosInstance from './axiosConfig';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DialogueBox from "../components/uploadDoc/DocumentUpload";
import { useParams, Link } from "react-router-dom";
function ExperiencePage() {
  const initialData = {
    organisationName: "",
    experienceId: "",
    designation: "",
    doj: "",
    doe: "",
    Experience: "",
    state: "",
    country: "",
    Attachment: "",
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [dialogueBoxData, setDialogueBoxData] = useState(null);
  // const [ImageTableData, setImageTableData] = useState(null);
  const { employeeId } = useParams();
  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const nameRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
  const employRegex = /^[a-zA-Z0-9\-/]*$/;
  const regex = /^[A-Za-z][A-Za-z\s]*$/;
  const [imageTableData, setImageTableData] = useState([]);  


  const userRole = localStorage.getItem("UserRole");
  const organizationId = localStorage.getItem("organizationId")
  // const ROLE_EMPLOYEE = "ROLE_EMPLOYEE"; 
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/documents/list`,
          {
            params: {
              organizationId,
              employeeId,
              category: "EXPERIENCE",
            },
          }
        );

        setImageTableData(response.data);
        console.log("Fetched Image Table Data:", response.data);  // Log the response data
        toast.success("Data successfully fetched!");
      } catch (error) {
        console.error("Error fetching table data:", error);
        toast.error("Access denied to view documents");
      }
    };

    fetchTableData();
  }, [organizationId, employeeId]);



  useEffect(() => {
    const fetchCurrentDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/experience/${employeeId}`
        );
        const data = response.data;
        setTableData(data)
        setFormData({
          organisationName: data.organisationName,
          experienceId: data.experienceId,
          designation: data.designation,
          doj: data.doj,
          doe: data.doe,
          Experience: data.experience,
          state: data.state,
          country: data.country,
          Attachment: "",
        });
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching Current Experience Details:", error);
        toast.error("kindly recheck the Form");
      }
    };
    fetchCurrentDetails();
  }, [employeeId]);

  const validateForm = () => {
    let newError = {};
    if (formData.organisationName === "") {
      newError.organisationName = "Required Org.name";
    } else if (formData.organisationName.length < 4) {
      newError.organisationName = "Min 4 Characters";
    } else if (formData.organisationName.length > 40) {
      newError.organisationName = "Max 40 Characters";
    } else if (!nameRegex.test(formData.organisationName)) {
      newError.organisationName = "Must start with a Character";
    }
    if (formData.experienceId === "") {
      newError.experienceId = "Required id";
    } else if (formData.experienceId.length < 4) {
      newError.experienceId = "Min 4 Characters";
    } else if (formData.experienceId.length > 20) {
      newError.experienceId = "Max 20 Characters";
    } else if (!employRegex.test(formData.experienceId)) {
      newError.experienceId = "Enter Valid Emp.Id, spaces not allowed";
    }
    if (formData.doj === "") {
      newError.doj = "Date of Joining is required";
    }
    if (formData.doe === "") {
      newError.doe = "Date of Exit is required";
    }
    if (formData.Experience === "") {
      newError.Experience = "Experience is required";
    }
    if (formData.state === "") {
      newError.state = "Required state";
    } else if (formData.state.length < 2) {
      newError.state = "Min 2 Characters";
    } else if (formData.state.length > 40) {
      newError.state = "Max 40 Characters";
    } else if (!regex.test(formData.state)) {
      newError.state = "Enter only Characters";
    }
    if (formData.country === "") {
      newError.country = "country is required";
    } else if (formData.country.length < 1) {
      newError.country = "Min 1 Character";
    } else if (formData.country.length > 40) {
      newError.country = "Max 40 Characters";
    } else if (!regex.test(formData.country)) {
      newError.country = "Enter Only Characters";
    }

    if (formData.designation === "") {
      newError.designation = "Choose any one";
    }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const calculateExperience = (dateOfJoining, dateOfExit) => {
    const joinDate = new Date(dateOfJoining);
    const exitDate = new Date(dateOfExit);

    if (exitDate <= joinDate) {
      return "Invalid dates";
    }
    const diffTime = exitDate - joinDate;
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );
    const diffDays = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );

    return `${diffYears} years, ${diffMonths} months, ${diffDays} days`;
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
  const handleClosePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
  };
  const preventManualInput = (e) => {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };
  const formatPostDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Check form validation
    if (!validateForm()) {
      console.log("Failed to submit: Form validation failed.");
      return;
    }
    // Format the necessary date fields using the pre-declared formatPostDate function
    const updatedFormData = {
      ...formData,
      doj: formatPostDate(formData.doj),
      doe: formatPostDate(formData.doe),
      employeeId: employeeId,
    };
    // Log the updated form data to inspect the changes
    console.log("Form Data being sent after formatting:", updatedFormData);

    // Check if we're editing an existing record or creating a new one
    if (editIndex !== null) {
      const employeeId = tableData[editIndex]?.experienceId; // Retrieve the employee ID
      if (!employeeId) {
        console.error("No valid employee ID found for the PATCH request.");
        return;
      }

      // Perform the PATCH request wrapped in try-catch
      try {
        const response = await axiosInstance.patch(
          `hrmsapplication/experience/`,
          updatedFormData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log("Data successfully updated:", response.data);

        // Update the table data with the new information
        const updatedTableData = tableData.map((row, index) =>
          index === editIndex ? { ...row, ...updatedFormData } : row
        );
        setTableData(updatedTableData);
      } catch (error) {
        console.error("Error during PATCH request:", error.response?.data || error.message);
        toast.error("kindly recheck the Form");
        return;
      }
    } else {
      // Perform the POST request wrapped in try-catch
      try {
        const response = await axiosInstance.post(
          `hrmsapplication/experience/createExperienceDetails?employeeId=${employeeId}`,
          updatedFormData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log("Data successfully posted:", response.data);

        // Add the newly created row to the table data
        setTableData([...tableData, { ...updatedFormData, employeeId: response.data.employeeId }]);
      } catch (error) {
        console.error("Error during POST request:", error.response?.data || error.message);
        toast.error("kindly recheck the Form");

        return;
      }
    }

    // Reset form data after successful submission
    setFormData({
      orgName: '',
      experienceId: '',
      designation: '',
      doj: '',
      doe: '',
      experience: '',
      state: '',
      country: '',
      attachment: '',
    });

    // Reset editIndex and close the popup
    setEditIndex(null);
    handleClosePopup();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date();
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (updatedData.doj && updatedData.doe) {
        const joinDate = new Date(updatedData.doj);
        const exitDate = new Date(updatedData.doe);
        const MINIMUM_DAYS = 10;
        const diffTime = exitDate - joinDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (exitDate > today) {
          updatedData.Experience = "";
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: "Date of Exit cannot be a future date",
          }));
        } else if (joinDate < exitDate && diffDays >= MINIMUM_DAYS) {
          updatedData.Experience = calculateExperience(
            updatedData.doj,
            updatedData.doe,
          );
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: "",
          }));
        } else if (joinDate >= exitDate) {
          updatedData.Experience = "";
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: "Date of Exit must be after Date of Joining",
          }));
        } else {
          updatedData.Experience = "";
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: `Experience must be at least ${MINIMUM_DAYS} days`,
          }));
        }
      } else {
        updatedData.Experience = "";
      }
      return updatedData;
    });
  };
  const handleEmployeeIdChange = (e) => {
    const { name, value } = e.target;
    if (employRegex.test(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, id: "" }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id: "Spaces not allowed",
      }));
    }
  };
  const handleNameChar = (e) => {
    const key = e.key;
    const value = e.target.value;

    if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
      e.preventDefault();
    }
  };
  const handleName = (e) => {
    const key = e.key;
    if (!/[a-zA-Z]/.test(key)) {
      e.preventDefault();
    }
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }
  const handleDelete = async (index) => {
    try {
      if (tableData[index] && tableData[index].experienceId) {
        const idToDelete = tableData[index].experienceId;
        console.log(`Attempting to delete ID: ${idToDelete}`);
        const response = await axiosInstance.delete(`hrmsapplication/experience/deleteexperience?pastId=${idToDelete}&employeeId=${employeeId}`, {
          headers: {
            // Include any necessary headers, e.g., Authorization
            // 'Authorization': 'Bearer your-token-here', // Uncomment if needed
          },
        });
        if (response.status === 200) {
          setTableData((prevTableData) => prevTableData.filter((_, i) => i !== index));  // After successful deletion, update the state by removing the deleted row
          console.log(`experience detail for ID ${idToDelete} deleted successfully.`);
        } else {
          console.error(`Failed to delete. Status: ${response.status}`);
          alert(`Failed to delete experience detail. Please try again.`);
        }
      } else {
        throw new Error('Invalid index or experience field is missing.');
      }
    } catch (error) {
      // Log the full error response for debugging
      console.error("Error deleting experience details:", error.response ? error.response.data : error.message);
      toast.error("kindly recheck the Form");
    }
  };
  const handleAddRow = () => {
    handleOpenPopup();
  };

  const handleUploadClick = () => {
    setShowFileUploadDialog(true)
  };

  const handleCloseDialog = () => {
    setShowFileUploadDialog(false);
  };

  const handleDialogueBoxSubmit = (data) => {
    setDialogueBoxData(data); // Store the submitted data in the state
    setShowFileUploadDialog(false); // Close the dialog after submission
  };

  return (
    <div>

      <div>
        <div className="mr-10 ml-6">
          <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5">
            <Link to={`/dashboard/${employeeId}`}>
              <div className="flex items-center">
                <FaLessThan className="text-white mr-2" />
                <button className="text font-semibold text-white">Previous Page</button>
              </div>
            </Link>
          </div>
        </div>
        <div>
          <div className="pt-5 mt-5 ml-3 md:ml-20 lg:ml-40 mx-auto mr-3 md:mr-20 lg:mr-40">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse border-2 border-black">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left bg-blue-950 text-white " colSpan="12">
                      Experience
                    </th>
                  </tr>
                  <tr className="border border-black">
                    <th className="py-2 px-4 text-left" colSpan="8">Experience</th>

                    {userRole === 'ROLE_ADMIN' && (
                      <th className="py-2 px-4 text-right" colSpan="2">
                        <div className="flex space-x-2 justify-end">
                          <button
                            type="button"
                            className="cursor-pointer py-1 px-4 bg-green-600 text-white rounded-md"
                            onClick={handleAddRow}
                          >
                            Add
                          </button>

                          <button
                            type="button"
                            className="cursor-pointer py-1 px-4 bg-green-600 text-white rounded-md"
                            onClick={handleUploadClick}
                          >
                            Upload
                          </button>
                        </div>
                      </th>
                    )}
                  </tr>

                </thead>
                <tbody className="border border-black border-collapse">
                  <tr>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black w-1/4 text-center">Org Name</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/5">Employee Id</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center">Designation</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/3">Date of Joining</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/3">Date of Exit</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/4">Experience</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/4">State</th>
                    <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/4">Country</th>
                    {(userRole === 'ROLE_ADMIN') && (
                      <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/4">
                        Actions
                      </th>
                    )}

                  </tr>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] truncate">{row.organisationName}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] truncate">{row.experienceId}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] truncate">{row.designation}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-x-auto">{row.doj}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-x-auto">{row.doe}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] truncate">{calculateExperience(row.doj, row.doe)}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] truncate">{row.state}</td>
                      <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[60px] truncate">{row.country}</td>
                      {(userRole === 'ROLE_ADMIN') && (
                        <td className="py-1 px-2 border-b border-gray-900 text-center">
                          <div className="flex flex-row justify-center items-center space-x-2">
                            <TiPencil className="cursor-pointer text-black-500 text-center sm:text-sm" onClick={() => handleOpenPopup(index)} />
                            {index !== 0 && userRole === 'ROLE_ADMIN' && (
                              <RiDeleteBin6Line
                                className="cursor-pointer text-black-500 text-xs sm:text-sm"
                                onClick={() => handleDelete(index)}
                              />
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <thead>
                  <tr className="border border-black" colSpan="9">
                    <th className="py-2 px-4 text-left w-1/4">FileName</th>
                  </tr>
                </thead>

                <tbody>
                  {imageTableData?.length > 0 ? (
                    imageTableData.map((data, index) => (
                      <tr key={index} className="border border-black">
                        <td className="py-2 px-4 text-left">{data.fileName || "No file name"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-2">No Data Available</td>
                    </tr>
                  )}
                </tbody>          </table>
            </div>
          </div>
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div
                className="bg-gray-200 p-2 sm:p-4 rounded-lg shadow-lg w-[95%] max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4 bg-blue-950 p-2 rounded-t-md">
                  <h2 className="text-lg text-white font-semibold">
                    {editIndex !== null ? "Edit Experience Details" : "Add New Experience"}
                  </h2>
                  <MdCancelPresentation
                    className="text-xl cursor-pointer text-white"
                    onClick={handleClosePopup} />
                </div>
                <form onSubmit={handleFormSubmit} onKeyDown={handleEnter}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Organization Name:</label>
                      <input
                        type="text"
                        name="organisationName"
                        value={formData.organisationName}
                        onKeyDown={handleNameChar}
                        onChange={handleChange}
                        className="p-1 border border-gray-300 rounded-lg"
                        minLength={4}
                        maxLength={40} />
                      {errors.organisationName && (<p className="text-red-500">{errors.organisationName}</p>)}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Employee ID:</label>
                      <input
                        type="text"
                        name="experienceId"
                        value={formData.experienceId}
                        onChange={handleEmployeeIdChange}
                        minLength={4}
                        maxLength={20}
                        className="p-1 border border-gray-300 rounded-lg" />
                      {errors.experienceId && <p className="text-red-500">{errors.experienceId}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Designation:</label>
                      <select
                        className="p-1 border border-gray-300 rounded-lg"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}>
                        <option value="" disabled hidden>Select designation</option>
                        <option value="Front-end Developer">Front-end Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="FullStack Developer">FullStack Developer</option>
                        <option value="Tester">Tester</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Product Manager">Product Manager</option>

                      </select>
                      {errors.designation && <p className="text-red-500">{errors.designation}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Date of Joining:</label>
                      <input
                        type="date"
                        name="doj"
                        value={formData.doj}
                        onChange={handleChange}
                        onKeyDown={preventManualInput}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
                        className="p-1 border border-gray-300 rounded-lg" />
                      {errors.doj && <p className="text-red-500">{errors.doj}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Date of Exit:</label>
                      <input
                        type="date"
                        name="doe"
                        value={formData.doe}
                        onChange={handleChange}
                        onKeyDown={preventManualInput}
                        max={new Date().toISOString().split("T")[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
                        className="p-1 border border-gray-300 rounded-lg" />
                      {errors.doe && <p className="text-red-500">{errors.doe}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Experience:</label>
                      <input
                        type="text"
                        name="Experience"
                        value={formData.Experience}
                        readOnly
                        className="p-1 border border-gray-300 rounded-lg" />
                      {errors.Experience && <p className="text-red-500">{errors.Experience}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">State:</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onKeyDown={handleNameChar}
                        minLength={2}
                        maxLength={40}
                        className="p-1 border border-gray-300 rounded-lg" />
                      {errors.state && <p className="text-red-500">{errors.state}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Country:</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onKeyDown={handleName}
                        minLength={2}
                        maxLength={40}
                        className="p-1 border border-gray-300 rounded-lg" />
                      {errors.country && <p className="text-red-500">{errors.country}</p>}
                    </div>
                    {/* <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Attachment:</label>
                      <input
                        type="file"
                        name="Attachment"
                        onChange={handleChange}
                        className="p-1 border border-gray-300 rounded-lg"/>
                    </div> */}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3 mb-2">
                      Save
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-2">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>)}
          {showFileUploadDialog && <DialogueBox
            employeeId={employeeId}
            category="EXPERIENCE"
            onClose={handleCloseDialog}
            onSubmit={handleDialogueBoxSubmit}
            outevent={(data) => console.log("Callback Data:", data)}
          />}
        </div>
      </div>
    </div>
  );
}
export default ExperiencePage;