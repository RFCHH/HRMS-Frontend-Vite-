import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import axiosInstance from "./axiosConfig";
import { Link, useParams } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Laxman() {

  const initialData = {
    education: "",
    institutionName: "",
    universityName: "",
    degree: "",
    majors: "",
    yearOfPass: "",
    certificationDate: "",
    percentage: "",
    state: "",
    country: "",
    //attachments: "",
  };
  const { employeeId } = useParams();
  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const percentage = String(formData.percentage).trim();
  const [EducateLabel, setEducateLabel] = useState({
    institutionName: "InstitutionName",
    universityName: "UniversityName",
    degree: "Degree",
    majors: "Majors",
  });

  const educationOptions = ["SSC", "Inter", "Diploma", "Graduation", "PostGraduation"];
  const userRole = localStorage.getItem("UserRole");



  // const formatPostDate = (date) => {
  //   const d = new Date(date);
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const year = d.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/education/${employeeId}`);
        const data = response.data
        setTableData(data)
        //setFormData(data)

        console.log(data);
        setFormData({

          education: data.education,
          institutionName: data.institutionName,
          universityName: data.universityName,
          degree: data.degree,
          majors: data.majors,
          yearOfPass: data.yearOfPass,
          certificationDate: data.certificationDate,
          percentage: data.percentage,
          state: data.state,
          country: data.country,

        })

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("kindly Recheck the Form");
      }
    };

    fetchData();
  }, [employeeId]);



  useEffect(() => {
    if (formData.education) {
      switch (formData.education) {
        case "SSC":
          setEducateLabel({
            institutionName: "School Name",
            universityName: "Board Name",
            degree: "degree",
            majors: "majors",
          });
          break;
        case "Inter":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "Board Name",
            degree: "degree",
            majors: "majors",
          });
          break;
        case "Diploma":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "University Name",
            degree: "degree",
            majors: "majors",
          });
          break;
        case "Graduation":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "University Name",
            degree: "degree",
            majors: "majors",
          });
          break;
        case "PostGraduation":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "University Name",
            degree: "degree",
            majors: "majors",
          });
          break;
        default:
          setEducateLabel({
            institutionName: "School Name",
            universityName: "universityName",
            degree: "degree",
            majors: "majors",
          });
      }
    }
  }, [formData.education]);

  const validateForm = () => {
    let newErrors = {};
    const currentYe = new Date().getFullYear();
    const previousYear = currentYe - 100;

    if (formData.education === '') {
      newErrors.education = 'Select One'
    }

    if (!formData.institutionName.match(/^[A-Za-z\s]{2,40}$/)) {
      newErrors.institutionName = `${EducateLabel.institutionName} must be 4-40 characters and contain only letters.`;
    }

    if (!formData.universityName.match(/^[A-Za-z\s]{2,40}$/)) {
      newErrors.universityName = `${EducateLabel.universityName} must be 4-40 characters and contain only letters.`;
    }

    if (!formData.degree.match(/^[A-Za-z\s]{3,40}$/)) {
      newErrors.degree =
        "degree must be 3-40 characters and contain only letters.";
    }

    if (!formData.majors.match(/^[A-Za-z\s]{3,40}$/)) {
      newErrors.majors =
        "majors must be 3-40 characters and contain only letters.";
    }

    if (!formData.yearOfPass) {
      newErrors.yearOfPass = 'Year of passing is required';
    } else if (isNaN(formData.yearOfPass)) {
      newErrors.yearOfPass = 'Year of passing must be a valid number';
    } else if (formData.yearOfPass < previousYear || formData.yearOfPass > currentYe) {
      newErrors.yearOfPass = `Year of passing must be between ${previousYear} and ${currentYe}`;
    }

    if (!formData.certificationDate) {
      newErrors.certificationDate = "Certification Issue Date is required.";
    } else {
      const certYear = new Date(formData.certificationDate).getFullYear();
      if (certYear !== parseInt(formData.yearOfPass, 10)) {
        newErrors.certificationDate = "Year of Pass and Certification Date must be same.";
      }
    }

    if (
      !percentage.match(/^\d{1,3}(\.\d{0,1})?$/) ||
      parseFloat(percentage) < 0 ||
      parseFloat(percentage) > 100
    ) {
      newErrors.percentage =
        "percentage/Grade must be a number between 0 and 100";
    }

    if (!formData.state.match(/^[A-Za-z\s]{3,40}$/)) {
      newErrors.state =
        "state must be 3-40 characters and contain only letters.";
    }

    if (!formData.country.match(/^[A-Za-z\s]{4,40}$/)) {
      newErrors.country =
        "country must be 4-40 characters and contain only letters.";
    }

    /*   if (!formData.Attachments) {
        newErrors.Attachments = "Attachments is required.";
      }
   */
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formatPostDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      try {
        const updatedFormData = {
          ...formData,
          //certificationDate: formatPostDate(formData.certificationDate),
          employeeId: employeeId
        };
        console.log("Updated Form Data: ", updatedFormData);

        if (editIndex !== null) {
          console.log("Edit Index: ", editIndex);
          const patchResponse = await axiosInstance.patch(
            `hrmsapplication/education/updateEducationDetails`,
            updatedFormData
          );
          console.log("Patch response: ", patchResponse);

          const updatedTableData = tableData.map((row, index) =>
            index === editIndex ? updatedFormData : row
          );
          console.log("Updated Table Data: ", updatedTableData);
          setTableData(updatedTableData);

        } else {
          const response = await axiosInstance.post(
            `hrmsapplication/education/createEducationDetails?employeeId=${employeeId}`,
            updatedFormData
          );
          const data = response.data;
          setTableData([...tableData, data]);
          setFormData({

            education: data.education,
            institutionName: data.institutionName,
            universityName: data.universityName,
            degree: data.degree,
            majors: data.majors,
            yearOfPass: data.yearOfPass,
            certificationDate: data.certificationDate,
            percentage: data.percentage,
            state: data.state,
            country: data.country,
          });
        }
        handleClosePopup();
      } catch (error) {
        console.error("Error submitting data:", error.response ? error.response.data : error.message);
        toast.error("kindly recheck the Form");
      }
    }
  };

  const handleCertification = (e) => {
    e.preventDefault()
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDelete = async (index) => {
    try {
      if (tableData[index] && tableData[index].education) {
        const educationToDelete = tableData[index].education;

        await axiosInstance.delete(`hrmsapplication/education/delete/${employeeId}?education=${educationToDelete}`);

        setTableData((prevTableData) => prevTableData.filter((_, i) => i !== index));

        console.log(`Education detail for ${educationToDelete} deleted successfully.`);
      } else {
        throw new Error('Invalid index or education field is missing.');
      }
    } catch (error) {
      console.error("Error deleting education details:", error);
      // alert(`Failed to delete education detail. Please try again.`);
      toast.error("kindly recheck the Form");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleAddRow = () => {
    handleOpenPopup();
  };

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });


    setErrors({ ...errors, [name]: '' });



    if (name === "percentage") {

      if (/^\d*\.?\d{0,1}$/.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (
      ["SchoolName", "universityName", "degree", "majors", "state", "country"].includes(
        name
      )
    ) {

      if (/^[a-zA-Z].*[\s\.]*$/.test(value) || value === "") {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
  };

  const handleYearChange = (e) => {
    const inputYear = e.target.value;


    if (/^\d{0,4}$/.test(inputYear)) {
      setFormData({ ...formData, yearOfPass: inputYear });
    }

    // Clear the error while typing
    setErrors({ ...errors, yearOfPass: '' });
  };
  return (
    <>

      <div className="flex flex-wrap items-center justify-start p-2 border-2 border-gray-800  bg-blue-950 rounded-md w-[150px] mb-3 mt-5 ml-5 ">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/dashboard/${employeeId}`}>
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </Link>

      </div>
      <div className="ml-4 mr-4 md:ml-10 md:mr-10">
        <div>
          <div className="overflow-x-auto">
            <table className="table-auto bg-white border-collapse border mt-4 border-black border-solid w-full  md:text-sm">
              <thead>
                <tr className="sticky top-0 z-10 border-black border-2 border-solid bg-blue-950">
                  <th
                    className="py-2 px-4 border-b  text-white border-gray-300 text-left"
                    colSpan="12"
                  >
                    Education Details
                  </th>
                </tr>
                <tr className="sticky top-[36px] z-10 border-2 border-solid border-black bg-white">
                  <th className="py-2 px-4 text-left" colSpan="10">
                    Education Details
                  </th>
                  {userRole === 'ROLE_ADMIN' && (
                    <th
                      className="inline-block cursor-pointer  py-1 px-4 text-right bg-green-600 m-2 text-white "
                      onClick={handleAddRow}
                    >
                      <button type="button">Add+</button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="border border-black border-collapse">
                <tr>
                  <th className="py-2 px-4 border-black border-2 border-solid">Education</th>
                  <th className="py-2 px-4 border-black border-2 border-solid"> Institution Name  </th>
                  <th className="py-2 px-4 border-black border-2 border-solid"> University Name </th>
                  <th className="py-2 px-4 border-black border-2 border-solid">Degree</th>
                  <th className="py-2 px-4 border-black border-2 border-solid">Majors</th>
                  <th className="py-2 px-4 border-black border-2 border-solid"> Year of Passing </th>
                  <th className="py-2 px-4 border-black border-2 border-solid"> Certificate Issue Date </th>
                  <th className="py-2 px-4 border-black border-2 border-solid">Percentage/Grade</th>
                  <th className="py-2 px-4 border-black border-2 border-solid">State</th>
                  <th className="py-2 px-4 border-black border-2 border-solid">Country</th>
                  {(userRole === 'ROLE_ADMIN') && (
                    <th className="py-2 px-4 border-black border-2 border-solid">
                      Actions
                    </th>
                  )}
                </tr>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.education}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.institutionName}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.universityName}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.degree}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.majors}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.yearOfPass}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.certificationDate}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.percentage}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.state}
                    </td>
                    <td className="py-2 px-4 border-black border-2 text-center max-w-[50px] sm:max-w-[100px] truncate">
                      {row.country}
                    </td>
                    {(userRole === 'ROLE_ADMIN') && (
                      <td className="py-2 px-4 border-black border-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <TiPencil
                            className="cursor-pointer text-lg"
                            onClick={() => handleOpenPopup(index)}
                          />
                          {index !== 0 && (
                            <RiDeleteBin6Line
                              className="cursor-pointer text-lg"
                              onClick={() => handleDelete(index)}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showPopup && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 mx-auto">
              <div className="bg-gray-200 w-3/4 h-auto max-h-[90vh]  overflow-y-auto border-2 p-4 rounded-md relative">
                <div className="flex items-center justify-between mb-4 bg-blue-950 m-2 rounded-lg">
                  <h2 className="p-1 m-1 text-lg text-white">
                    {editIndex !== null ? "Edit education Details" : "Add education Details"}
                  </h2>
                  <MdCancelPresentation
                    className="text-xl text-white mr-2 cursor-pointer"
                    onClick={handleClosePopup}
                  />
                </div>
                <form
                  onSubmit={handleFormSubmit}
                  onKeyDown={handleEnter}
                  className="text-left rounded-lg"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 p-4 lg:-mt-4">
                    <div>
                      <label htmlFor="education" className="mb-1 text-gray-700 font-medium">
                        Education
                      </label>
                      <select
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      >
                        <option value="">Select Education</option>
                        {educationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.education && (
                        <p className="text-red-500 text-xs">{errors.education}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="institutionName" className="mb-1 text-gray-700 font-medium">
                        {EducateLabel.institutionName}
                      </label>
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.institutionName && (
                        <p className="text-red-500 text-xs">{errors.institutionName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="universityName" className="mb-1 text-gray-700 font-medium">
                        {EducateLabel.universityName}
                      </label>
                      <input
                        type="text"
                        name="universityName"
                        value={formData.universityName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.universityName && (
                        <p className="text-red-500 text-xs">{errors.universityName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="degree" className="mb-1 text-gray-700 font-medium">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.degree && (
                        <p className="text-red-500 text-xs">{errors.degree}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="majors" className="mb-1 text-gray-700 font-medium">
                        Majors
                      </label>
                      <input
                        type="text"
                        name="majors"
                        value={formData.majors}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.majors && (
                        <p className="text-red-500 text-xs">{errors.majors}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="yearOfPass" className="mb-1 text-gray-700 font-medium">
                        Year Of Passing
                      </label>
                      <input
                        type="text"
                        name="yearOfPass"
                        value={formData.yearOfPass}
                        onChange={handleYearChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                        placeholder={`${minYear} - ${currentYear}`}
                      />
                      {errors.yearOfPass && (
                        <p className="text-red-500 text-sm mt-1">{errors.yearOfPass}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="certificationDate" className="mb-1 text-gray-700 font-medium">
                        Certificate Issue Date
                      </label>
                      <input
                        type="date"
                        name="certificationDate"
                        value={formData.certificationDate}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                          .toISOString()
                          .split("T")[0]}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.certificationDate && (
                        <p className="text-red-500 text-xs">{errors.certificationDate}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="percentage" className="mb-1 text-gray-700 font-medium">
                        Percentage/Grade
                      </label>
                      <input
                        type="text"
                        name="percentage"
                        maxLength={4}
                        value={formData.percentage}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.percentage && (
                        <p className="text-red-500 text-xs">{errors.percentage}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="mb-1 text-gray-700 font-medium">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="country" className="mb-1 text-gray-700 font-medium">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs">{errors.country}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end lg:-mt-16 mr-4">
                    <button
                      type="submit"
                      className="bg-gray-500 text-white lg:px-4 lg:py-2 px-2 py-1 rounded-md hover:bg-gray-600 mr-3 mb-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="bg-gray-500 text-white lg:px-4 lg:py-2 px-2 py-1 rounded-md hover:bg-gray-600 mb-2"
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

    </>
  );
}

export default Laxman;