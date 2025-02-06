
import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { NavLink } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Test = () => {
  const [isInitial, setIsInitial] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const [formData, setFormData] = useState({
    employeeInfo: { employeeId: "", employeeName: "", department: "", designation: "", location: "" },
    salary: { employeeId: "", basicPay: "", netPay: "", grossPay: "", payFrequency: "", providentFund: "", professionalTax: "", insurance: "", federaltax: "", stateTax: "", localTax: "" },
    earnings: { employeeId: "", bonus: "", overtimepay: "", incentives: "" },
    bankDetails: { employeeId: "", bankname: "", bankaccountnumber: "", branch: "", nameasperthebankaccount: "", ifsccode: "", passbook: "", pancard: "" },

  });
  const [fieldErrors, setFieldErrors] = useState({});

  const sections = {
    employeeInfo: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 15, errorMessage: "Employee ID must be alphanumeric." },
      { name: "employeeName", label: "Employee Name", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Employee Name should only contain letters." },
      { name: "department", label: "Department", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Department must contain only letters." },
      { name: "designation", label: "Designation", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Job Title must contain only letters." },
      { name: "location", label: "Location", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Location must contain only letters." },
    ],
    salary: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 15, errorMessage: "Employee ID must be alphanumeric." },
      { name: "basicPay", label: "Basic Pay", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Basic Pay must contain only numbers." },
      { name: "netPay", label: "Net Pay", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Net Pay must contain only numbers." },
      { name: "grossPay", label: "Gross Pay", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Gross Pay must contain only numbers." },
      { name: "payFrequency", label: "Pay Frequency", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Pay Frequency must contain only numbers." },
      { name: "providentFund", label: "Provident Fund", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Provident Fund must contain only numbers." },
      { name: "professionalTax", label: "Professional Tax", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Professional Taxmust contain only numbers." },
      { name: "insurance", label: "Insurance", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Insurance must contain only numbers." },
      { name: "federaltax", label: "Federal Tax", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: " Federal Tax must contain only numbers." },
      { name: "stateTax", label: "State Tax", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "State Tax must contain only numbers." },
      { name: "localTax", label: "Local Tax", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Local Tax must contain only numbers." },
    ],
    bankDetails: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 15, errorMessage: "Employee ID must be alphanumeric." },
      { name: "bankAccountNumber", label: "Bank Account Number", validation: /^[0-9]*$/, minLength: 9, maxLength: 18, errorMessage: "Bank Account Number must be 09-18 digits long." },
      { name: "bankName", label: "Bank Name", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Bank Name should contain only letters." },
      { name: "branch", label: "Branch", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Branch must contain only letters." },
      { name: "nameAsPerBankAccount", label: "Name As Per The Bank Account", type: "text", minLength: 1, maxLength: 20, validation: /^[a-zA-Z\s]*$/, errorMessage: "Name should only contain letters." },
      { name: "ifscCode", label: "IFSC Code", validation: /^[A-Z]{4}0[A-Z0-9]{6}$/, minLength: 1, maxLength: 11, errorMessage: "IFSC Code must be in the format: 4 letters, 0, and 6 alphanumeric characters(SBIN0000300)." },
      // { name: "passbook", label:"Passbook/Cheque Photo",validation: /\.(png|jpg|pdf)$/i, type: "file", errorMessage: "Only .png, .jpg, and .pdf files are allowed." },
      // { name: "pancard", label:"Pancard Photo",validation: /\.(png|jpg|pdf)$/i, type: "file", errorMessage: "Only .png, .jpg, and .pdf files are allowed." },
    ],
    earnings: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 15, errorMessage: "Employee ID must be alphanumeric.", },
      { name: "bonus", label: "Bonus-By project/By year", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: " Bonus-By project/By year must be 1-20 characters." },
      { name: "overtimePay", label: "Over time pay", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: " Over time pay must be 1-20 characters." },
      { name: "incentives", label: "Incentives", validation: /^[0-9]*$/, minLength: 1, maxLength: 10, errorMessage: "Incentives must be 1-20 characters." },
    ],
  };

  const openPopup = (section) => {
    setCurrentSection(section);
    setPopupVisible(true);
    setTempData({ ...formData[section] });
    setFieldErrors({});
  };
  const userRole = localStorage.getItem("UserRole");
  const closePopup = () => {
    setPopupVisible(false);
    setCurrentSection(null);
  };

  const handleInputChange = (field, e, isFile = false) => {
    let value = isFile ? e.target.files[0] : e.target.value;

    if (isFile) {
      if (!isValidFile(value)) {
        setFieldErrors({
          ...fieldErrors,
          [field]: "Only .png, .jpg, and .pdf files are allowed.",
        });
        return;
      }
    }

    const fieldCriteria = sections[currentSection]?.find((f) => f.name === field);

    if (fieldCriteria && !isFile) {
      value = applyValidationPattern(value, fieldCriteria.validation);
    }
    const error = isFile ? "" : validateField(value, fieldCriteria);

    setFieldErrors({ ...fieldErrors, [field]: error });
    setTempData({
      ...tempData,
      [field]: value,
    });
    setFormData({
      ...formData,
      employeeInfo: { ...formData.employeeInfo, [field]: value },
    });
  };

  const isValidFile = (file) => {
    const allowedExtensions = /\.(png|jpg|pdf)$/i;
    return allowedExtensions.test(file.name);
  };

  const applyValidationPattern = (value, pattern) => {
    //value = value.trim();
    value = value.replace(/^\s+/, '');
    if (!pattern) return value;

    if (pattern.source === "^[0-9]*$") {
      return value.replace(/[^0-9]/g, "");
    } else if (pattern.source === "^[a-zA-Z]*$") {
      return value.replace(/[^a-zA-Z\s]/g, "");
    } else if (pattern.source === "^[a-zA-Z0-9]*$") {
      return value.replace(/[^a-zA-Z0-9]/g, "");
    }
    return value;
  };



  // const validateField = (value, criteria, currentSection) => {
  //   if (!criteria) return "";

  //   if (typeof value !== 'string') return "";

  //   // if (!value) {
  //   //   return `Field is Required`;
  //   // } 
  //    if (criteria.validation && !criteria.validation.test(value)) {
  //     return criteria.errorMessage;
  //   } else if (value.length < criteria.minLength) {
  //     return `Minimum length is ${criteria.minLength} characters.`;
  //   } else if (value.length > criteria.maxLength) {
  //     return `Maximum length is ${criteria.maxLength} characters.`;
  //   }

  //   return "";
  // };
  const validateField = (value, criteria) => {
    if (!criteria) return "";

    if (!value) {
      return `${criteria.label} is required.`;
    }

    if (criteria.validation && !criteria.validation.test(value)) {
      return criteria.errorMessage;
    }

    if (value.length < criteria.minLength) {
      return `Minimum length is ${criteria.minLength} characters.`;
    } else if (value.length > criteria.maxLength) {
      return `Maximum length is ${criteria.maxLength} characters.`;
    }

    return ""; 
  };

  const handleInitialSubmit = async () => {
    try {
      const response = await axiosInstance.get(`hrmsapplication/payroll-section/get-payroll-section`, {
        params: { employeeId: formData.employeeInfo.employeeId },
      });

      setFormData(prevData => ({
        ...prevData,
        employeeInfo: response.data.onboardingEmployeeInformationDTO || prevData.employeeInfo,
        salary: response.data.getSalaryDTO || prevData.salary,
        earnings: response.data.getEarningsDetailsDTO || prevData.earnings,
        bankDetails: response.data.getBankDetailsDTO || prevData.bankDetails,
      }));
      setIsInitial(false);
      toast.success("Data loaded successfully!");
    }
    catch (error) {
      console.error("Error in adding data", error);

      let errorMessage = "Failed to add data. Please try again.";
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error(errorMessage); 
    }
  };

  const handleSave = async () => {
    const employeeId = tempData.employeeId;

    if (currentSection) {
      const newFieldErrors = {};
    sections[currentSection].forEach(field => {
      const value = tempData[field.name];
      const error = validateField(value, field);
        if (error) {
          newFieldErrors[field.name] = error;
        }
      
    });

    setFieldErrors(newFieldErrors);
      const isValid = Object.values(fieldErrors).every((error) => error === "") && Object.values(tempData).every((value) => value !== "");

      if (isValid) {
        try {
          var response;
          if (formData[currentSection]?.employeeId) {

            response = await axiosInstance.patch(`hrmsapplication/${currentSection}/update`, {
              ...tempData,
              employeeId,
            });
            toast.success("Data updated successfully!");
          } else {
            response = await axiosInstance.post(`hrmsapplication/${currentSection}/create`, {
              ...tempData,
              employeeId,
            });
            
            toast.success("Data successfully created!");
          }
          setFormData((prevData) => ({
            ...prevData,
            [currentSection]: response.data,
          }));

          closePopup();
        } 
        catch (error) {
          console.error("Error  in adding data:", error);
          let errorMessage = "Failed to add data. Please try again.";
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
    }
  };
  // const handleDelete = async (id) => {
  //   const employeeId = tempData.employeeId; 
  //   let deleteUrl;

  //   switch (currentSection) {
  //     case 'earnings':
  //       deleteUrl = `/earnings/deleteEarnings/${employeeId}`;
  //       break;
  //     case 'bankDetails':
  //       deleteUrl = `/bankDetails/deleteBankAccountDetails/${employeeId}`;
  //       break;
  //     case 'salary':
  //       deleteUrl = `/salary/deleteSalary/${employeeId}`;
  //       break;
  //     default:
  //       console.error("Invalid section specified for deletion.");
  //       return; 
  //   }
  //   try {
  //     const response = await axiosInstance.delete(deleteUrl, {
  //       data: { employeeId }, 
  //     });
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [currentSection]: prevData[currentSection].filter((item) => item.id !== id),
  //     }));
  //     console.log("Record deleted successfully:", response.data);
  //     closePopup();
  //   } catch (error) {
  //     console.error("Error deleting record:", error);
  //   }
  // };


  return (
    <div className=" mr-14 ml-14 ">

      <NavLink
        to={userRole === 'ROLE_ADMIN' ? '/onboardingDocuments' : '/userdashboard'}
        className="flex items-center justify-start  p-2 overflow-x-auto border-2 bg-blue-950  border-gray-800 rounded-md w-40 mr-[7rem] mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className=" font-semibold  text-white">Previous Page</span>
        </button>
      </NavLink>
      <h2 className="text-xl text-center mb-4 font-bold p-1 text-white bg-blue-950 rounded-lg">Payroll Section</h2>

      {isInitial ? (
        <div className="p-4 shadow-md rounded">
          <label className="block mb-2 font-semibold">Employee ID:</label>
          <input
            type="text"
            value={formData.employeeInfo.employeeId}

            placeholder="Enter your EmployeeId here..."
            onChange={(e) => handleInputChange("employeeId", e)}
            className="border p-2 w-full"
          />
          <button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={handleInitialSubmit}>
            Submit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8  p-10">
          {Object.keys(sections).map((sectionKey) => (
            <div key={sectionKey} className="p-4  rounded-xl bg-gray-200 shadow cursor-pointer hover:shadow-lg" onClick={() => openPopup(sectionKey)}>
              <h3 className="text-xl font-bold mb-2 uppercase">{sectionKey.replace(/([A-Z])/g, " $1").trim()}</h3>
              {sections[sectionKey].slice(0, 3).map((field, index) => (
                <p key={index}>
                  <strong>{field.label}:</strong> {formData[sectionKey][field.name] || ""}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      {userRole === 'ROLE_ADMIN' && popupVisible && currentSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded shadow-lg">
          <div className="bg-gray-300 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
            <h1 className="text-xl mb-4 w-full p-1 flex items-center text-white justify-center bg-blue-950 rounded shadow-lg uppercase">
              {currentSection.replace(/([A-Z])/g, " $1").trim()}
            </h1>
            <div className="grid grid-cols-3 gap-6 p-5 mb-4">
              {sections[currentSection].map((field, index) => (
                <div key={index}>
                  <label className="block">{field.label}:</label>
                  <input
                    type={field.type === "file" ? "file" : field.type === "date" ? "date" : "text"}
                    accept={field.type === "file" ? ".png,.jpg,.pdf" : undefined}
                    minLength={field.type === "text" ? field.minLength || "" : undefined}
                    maxLength={field.type === "text" ? field.maxLength || "" : undefined}
                    pattern={field.validation ? field.validation.source : undefined}
                    // value={
                    //   field.name === "employeeId"
                    //     ? formData.employeeInfo.employeeId
                    //     : field.type === "file"
                    //       ? undefined
                    //       : tempData[field.name] || ""
                    // }
                    value={field.type === "file" ? undefined : tempData[field.name] || ""}

                    onChange={(e) => handleInputChange(field.name, e, field.type === "file")}
                    className="w-full p-1 border border-gray-300 rounded-lg"
                    placeholder={field.name === "employeeId" ? "Enter Employeeid" : ""}
                  />
                  {fieldErrors[field.name] && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 mb-5 mr-5 flex justify-end space-x-4">
              <button onClick={handleSave} className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                Save
              </button>
              <button onClick={closePopup} className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



    </div>

  );
};

export default Test;