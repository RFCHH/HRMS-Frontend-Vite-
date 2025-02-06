import { useState, useEffect } from 'react';
import { FaPen, FaLessThan, FaRegWindowClose } from 'react-icons/fa';
// import { AiOutlineHome } from 'react-icons/ai';
import { useParams, Link } from "react-router-dom";
import axiosInstance from './axiosConfig';
import { toast,  } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TravelDetails = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    passportNumber: '',
    issueDate: '',
    expireDate: '',
    placeOfIssue: '',
    country: '',
    issuingAuthority: '',

  });
  const [formErrors, setFormErrors] = useState({});
  const [tableData, setTableData] = useState({});
  const { employeeId } = useParams();
  const [utid, setUtid] = useState(null);
  const userRole = localStorage.getItem("UserRole");

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/travel/${employeeId}`);
        const data = response.data;
        if (data) {
          setTableData([data]); 
        } else {
          setTableData([]); 
        } 
        setUtid(data.utid);
        setFormData({
          passportNumber: data.passportNumber,
          issueDate: data.issueDate,
          expireDate: data.expireDate,
          placeOfIssue: data.placeOfIssue,
          country: data.country,
          issuingAuthority: data.issuingAuthority,
          utid: data.utid,
        });
        console.log("Fetched data:", data);
      } catch (error) {
        console.error('Error fetching travel details:', error);
        toast.error("kindly recheck the Form");
      }
    };
    fetchTravel();
  }, [employeeId]);


  const validateDates = (issueDate, expireDate) => {
    const issue = new Date(issueDate);
    const expire = new Date(expireDate);
    const twentyYearsLater = new Date(issue);
    twentyYearsLater.setFullYear(twentyYearsLater.getFullYear() + 20);

    if (issue >= expire) {
      return "Issue date must be earlier than Expiry date.";
    }
    if (expire > twentyYearsLater) {
      return "Expiry date must not exceed 20 years from Issue date.";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'passportNumber') {
      const uppercaseValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData({ ...formData, [name]: uppercaseValue });
      setFormErrors({ ...formErrors, [name]: "" });
    } else {
      setFormData({ ...formData, [name]: value });
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  //     const isDuplicatePassport = (passportNumber) => {
  //       return tableData.some(entry => entry.passportNumber === passportNumber);
  //   }
  const isDuplicatePassport = (passportNumber) => {
    return Array.isArray(tableData) && tableData.some(entry => entry.passportNumber === passportNumber);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  const preventManualInput = (e) => {
    e.preventDefault();
  };

  const validateForm = () => {
    const errors = {};
    const passportNumberPattern = /^[A-Z]{1}[0-9]{7}$/;

    if (!formData.passportNumber) {
      errors.passportNumber = "Passport Number is required.";
    } else if (formData.passportNumber.length !== 8) {
      errors.passportNumber = "Passport Number must be 8 characters long.";
    } else if (!passportNumberPattern.test(formData.passportNumber)) {
      errors.passportNumber = "Passport Number should follow the format: A1234567.";
    } else if (isDuplicatePassport(formData.passportNumber) && !isEditMode) {
      errors.passportNumber = "Passport Number already exists.";
    }

    if (!formData.issueDate) errors.issueDate = "Issue Date is required.";
    if (!formData.expireDate) errors.expireDate = "Expiry Date is required.";


    if (!formData.placeOfIssue) {
      errors.placeOfIssue = "Place of Issue is required.";
    } else if (formData.placeOfIssue.length < 2 || formData.placeOfIssue.length > 40) {
      errors.placeOfIssue = "Place of Issue should be between 2 and 40 characters.";
    }

    if (!formData.country) {
      errors.country = "Country of Issue is required.";
    } else if (formData.country.length < 2 || formData.country.length > 40) {
      errors.country = "Country of Issue should be between 2 and 40 characters.";
    }


    if (!formData.issuingAuthority) {
      errors.issuingAuthority = "Issuing Authority is required.";
    } else if (formData.issuingAuthority.length < 2 || formData.issuingAuthority.length > 40) {
      errors.issuingAuthority = "Issuing Authority should be between 2 and 40 characters.";
    }

    const dateError = validateDates(formData.issueDate, formData.expireDate);

    if (dateError) {
      errors.expireDate = dateError;
    }

    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const payload = {
          passportNumber: formData.passportNumber,
          issueDate: formData.issueDate,
          expireDate: formData.expireDate,
          placeOfIssue: formData.placeOfIssue,
          country: formData.country,
          issuingAuthority: formData.issuingAuthority,
          utid: utid,
          employeeId: employeeId
        };

        if (isEditMode) {
          const response = await axiosInstance.patch(`hrmsapplication/travel/`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("PATCH Response Data:", response.data);
          const updatedTableData = tableData.map((item) =>
            item.utid === utid ? { ...item, ...payload } : item
          );
          setTableData(updatedTableData);
          setIsPopupOpen(false);
          setFormErrors({});
        } else {
          const response = await axiosInstance.post(`hrmsapplication/travel/createTravel?employeeId=${employeeId}`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("POST Response Data:", response.data);
          const newTravelEntry = { ...payload, employeeId: response.data.employeeId };
          setTableData([...tableData, newTravelEntry]);
          setIsEditMode(true);
          setIsPopupOpen(false);
        }

      } catch (error) {
        console.error("Error saving travel details:", error);
        toast.error("kindly recheck the Form");
      }
    } else {
      setFormErrors(errors);
    }
  };


  // const handleBackendErrors = (error) => {
  //     if (error.response && error.response.data) {
  //         const backendErrors = error.response.data;
  //         const formErrors = {};
  //         if (backendErrors.includes("InvalidExpireDate")) {
  //             formErrors.expireDate = "Invalid Expiry Date";
  //         }
  //         if (backendErrors.includes("InvalidIssueDate")) {
  //             formErrors.issueDate = "Invalid Issue Date";
  //         }
  //         setFormErrors(formErrors);
  //     }
  // };

  // const handleDelete = async (passportNumber) => {
  //     try {
  //         await axiosInstance.delete(`hrmsapplication/travel/delete/${employeeId}?passportNumber=${passportNumber}`, {
  //             headers: {
  //                 "Content-Type": "application/json",
  //             },
  //         });

  //         // Filter out the deleted item from the table data
  //         const updatedTableData = tableData.filter(item => item.passportNumber !== passportNumber);
  //         setTableData(updatedTableData);
  //         console.log("Deleted successfully!");
  //     } catch (error) {
  //         console.error('Error deleting travel details:', error);
  //     }
  // };


  const handleEdit = (index) => {
    setFormData({ ...tableData[index], index });
    setIsPopupOpen(true);
    setIsEditMode(true);
  };


  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setFormData({
      passportNumber: '',
      issueDate: '',
      expireDate: '',
      placeOfIssue: '',
      country: '',
      issuingAuthority: ''
    });
    setFormErrors({});
  };





  return (

    <>

      <div className="flex flex-wrap items-center justify-start p-2 bg-blue-950 border-2 border-gray-800 rounded-md w-[150px] mb-3 mt-5 ml-5">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/dashboard/${employeeId}`}>
          <button>
            <span className="font-semibold text-white">Previous Page</span>
          </button>
        </Link>
      </div>

      {/* <nav className="mt-2 flex p-1 bg-gray-200 shadow-md max-w-7xl mx-auto border border-black rounded-md">
        <div className="flex items-center space-x-1">
          <Link to={`/dashboard/${employeeId}`}>
            <AiOutlineHome className="text-xl" />
          </Link>
          <span className="text-lg justify-center font-bold">Travel Details</span>
        </div>
      </nav> */}

      <div className="mx-4 mt-4 sm:mx-10 lg:mx-48 border border-black rounded-t-md">
        <div>
          <div className="bg-blue-950 text-white p-2 rounded-t-md flex justify-between items-center">
            <h2 className="font-semibold text-base sm:text-lg">Travel Details</h2>
          </div>
          {userRole === "ROLE_ADMIN" && (
            <div className="bg-white p-2 border border-black flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">Travel Details</span>
              <button
                className={`flex items-center text-black bg-green-500 px-2 py-1 rounded text-sm sm:text-base ${tableData.length > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => setIsPopupOpen(true)}
                disabled={tableData.length > 0}
              >
                Add
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse border border-gray-400 text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border border-gray-400 px-2 py-2 sm:px-4">Passport Number</th>
                  <th className="border border-gray-400 px-2 py-2 sm:px-4">Issue Date</th>
                  <th className="border border-gray-400 px-2 py-2 sm:px-4">Expire Date</th>
                  <th className="border border-gray-400 px-2 py-2 sm:px-4">Place of Issue</th>
                  <th className="border border-gray-400 px-2 py-2 sm:px-4">Country of Issue</th>
                  <th className="border border-gray-400 px-2 py-2 sm:px-4">Issuing Authority</th>
                  {userRole === "ROLE_ADMIN" && (
                    <th className="border border-gray-400 px-2 py-2 sm:px-4">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData && tableData.length > 0 ? (
                  tableData.map((data, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 text-center px-2 py-2">{data.passportNumber}</td>
                      <td className="border border-gray-400 text-center px-2 py-2">{data.issueDate}</td>
                      <td className="border border-gray-400 text-center px-2 py-2">{data.expireDate}</td>
                      <td className="border border-gray-400 text-center px-2 py-2">{data.placeOfIssue}</td>
                      <td className="border border-gray-400 text-center px-2 py-2">{data.country}</td>
                      <td className="border border-gray-400 text-center px-2 py-2">{data.issuingAuthority}</td>
                      {userRole === "ROLE_ADMIN" && (
                        <td className="border border-gray-400 px-2 py-2">
                          <div className="flex justify-center items-center space-x-2">
                            <FaPen size={15} className="cursor-pointer" onClick={() => handleEdit(index)} />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={userRole === "ROLE_ADMIN" ? 7 : 6} className="text-center py-4">
                      No Travel Details Added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isPopupOpen && (
          <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 bg-blue-950 rounded-lg p-2 sticky top-0">
                <h2 className="text-lg text-white w-full">{isEditMode ? 'Edit Travel Details' : 'Add Travel Details'}</h2>
                <FaRegWindowClose size={24} className="text-white cursor-pointer" onClick={handleCancel} />
              </div>
              <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1">Passport Number</label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      minLength={8}
                      maxLength={8}
                      style={{ textTransform: 'uppercase' }}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {formErrors.passportNumber && <span className="text-red-600 text-sm">{formErrors.passportNumber}</span>}
                  </div>

                  <div>
                    <label className="block mb-1">Issue Date</label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      onKeyDown={preventManualInput}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {formErrors.issueDate && <span className="text-red-600 text-sm">{formErrors.issueDate}</span>}
                  </div>

                  <div>
                    <label className="block mb-1">Expire Date</label>
                    <input
                      type="date"
                      name="expireDate"
                      value={formData.expireDate}
                      onChange={handleInputChange}
                      onKeyDown={preventManualInput}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {formErrors.expireDate && <span className="text-red-600 text-sm">{formErrors.expireDate}</span>}
                  </div>

                  <div>
                    <label className="block mb-1">Place of Issue</label>
                    <input
                      type="text"
                      name="placeOfIssue"
                      value={formData.placeOfIssue}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {formErrors.placeOfIssue && <span className="text-red-600 text-sm">{formErrors.placeOfIssue}</span>}
                  </div>

                  <div>
                    <label className="block mb-1">Country of Issue</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {formErrors.country && <span className="text-red-600 text-sm">{formErrors.country}</span>}
                  </div>

                  <div>
                    <label className="block mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      name="issuingAuthority"
                      value={formData.issuingAuthority}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {formErrors.issuingAuthority && <span className="text-red-600 text-sm">{formErrors.issuingAuthority}</span>}
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button type="submit" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                    {isEditMode ? 'Update' : 'Save'}
                  </button>
                  <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
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

export default TravelDetails;