import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaLessThan } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const [formData, setFormData] = useState({
    employeeInfo: { employeeId: "", employeeName: "", department: "", designation: "", location: "" },
    salary: { employeeId: "", basicPay: "", netPay: "", grossPay: "", payFrequency: "", providentFund: "", professionalTax: "", insurance: "", federaltax: "", stateTax: "", localTax: "" },
    earnings: { employeeId: "", bonus: "", overtimePay: "", incentives: "" },
    bankDetails: { employeeId: "", bankname: "", bankaccountnumber: "", branch: "", nameasperthebankaccount: "", ifsccode: "", passbook: "", pancard: "" },

  });

  const [fieldErrors, setFieldErrors] = useState({});
  const { employeeId } = useParams()

  const sections = {
    employeeInfo: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 20, errorMessage: "Employee ID must be alphanumeric." },
      { name: "employeeName", label: "Employee Name", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Employee Name should only contain letters." },
      { name: "department", label: "Department", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Department must contain only letters." },
      { name: "designation", label: "Designation", type: "text", validation: /^[a-zA-Z]+( +[a-zA-Z]+)*$/, minLength: 1, maxLength: 20, errorMessage: "Job Title must contain only letters." },
      { name: "location", label: "Location", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Location must contain only letters." },
    ],
    salary: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 20, errorMessage: "Employee ID must be alphanumeric." },
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
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 20, errorMessage: "Employee ID must be alphanumeric." },
      { name: "bankAccountNumber", label: "Bank Account Number", validation: /^[0-9]*$/, minLength: 1, maxLength: 20, errorMessage: "Bank Account Number must be 10-20 digits long." },
      { name: "bankName", label: "Bank Name", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Bank Name should contain only letters." },
      { name: "branch", label: "Branch", type: "text", validation: /^[a-zA-Z\s]*$/, minLength: 1, maxLength: 20, errorMessage: "Branch must contain only letters." },
      { name: "nameAsPerBankAccount", label: "Name As Per The Bank Account", type: "text", minLength: 1, maxLength: 20, validation: /^[a-zA-Z\s]*$/, errorMessage: "Name should only contain letters." },
      { name: "ifscCode", label: "IFSC Code", validation: /^[A-Z]{4}0[A-Z0-9]{6}$/, minLength: 1, maxLength: 11, errorMessage: "IFSC Code must be in the format: 4 letters, 0, and 6 alphanumeric characters(SBIN0000300)." },
      // { name: "passbook", label:"Passbook/Cheque Photo",validation: /\.(png|jpg|pdf)$/i, type: "file", errorMessage: "Only .png, .jpg, and .pdf files are allowed." },
      // { name: "pancard", label:"Pancard Photo",validation: /\.(png|jpg|pdf)$/i, type: "file", errorMessage: "Only .png, .jpg, and .pdf files are allowed." },
    ],
    earnings: [
      { name: "employeeId", label: "Employee ID", validation: /^[a-zA-Z0-9]*$/, minLength: 1, maxLength: 20, errorMessage: "Employee ID must be alphanumeric." },
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
  };

  const isValidFile = (file) => {
    const allowedExtensions = /\.(png|jpg|pdf)$/i;
    return allowedExtensions.test(file.name);
  };

  const applyValidationPattern = (value, pattern) => {
    value = value.trim();
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


  const validateField = (value, criteria) => {
    if (!criteria) return "";

    if (typeof value !== 'string') return "";

    if (!value) {
      return "This field does not accept spaces";
    } else if (criteria.validation && !criteria.validation.test(value)) {
      return criteria.errorMessage;
    } else if (value.length < criteria.minLength) {
      return `Minimum length is ${criteria.minLength} characters.`;
    } else if (value.length > criteria.maxLength) {
      return `Maximum length is ${criteria.maxLength} characters.`;
    }

    return "";
  };
  const endpoints = {
    employeeInfo: {
      get: `hrmsapplication/employee/getOnboardingEmployeeInformation?employeeId=${employeeId}`,
    },
    salary: {
      get: `hrmsapplication/salary/${employeeId}`,
      // post: `hrmsapplication/salary/create`,
      // patch: `hrmsapplication/salary/update`,
      // delete: `hrmsapplication/salary/deleteSalary/${employeeId}`,
    },
    bankDetails: {
      get: `hrmsapplication/bankDetails/${employeeId}`,
      // post: `hrmsapplication/bankDetails/create`,
      // patch: `hrmsapplication/bankDetails/update`,
      // delete: `hrmsapplication/bankDetails/deleteBankAccountDetails/${employeeId}`,
    },

    earnings: {
      get: `hrmsapplication/earnings/${employeeId}`,
      // post: `hrmsapplication/earnings/create`,
      // patch: `hrmsapplication/earnings/update`,
      // delete: `hrmsapplication/earnings/deleteEarnings/${employeeId}`,
    },
  };


  const fetchSectionData = async (section) => {
    try {
      const response = await axiosInstance.get(endpoints[section].get);
      setFormData(prevData => ({
        ...prevData,
        [section]: response.data,
      }));
      toast.success("Data loaded successfully!");
    } catch (error) {
      console.error(`Error fetching ${section} data:`, error);
      toast.error("No Data in  the Form");
    }
  };

  const createSectionData = async (section, data) => {
    try {
      const response = await axiosInstance.post(endpoints[section].post, data);
      console.log(`${section} created:`, response.data);
      await fetchSectionData(section);
      toast.success("Data uploaded successfully!");
    } catch (error) {
      console.error(`Error creating ${section} data:`, error);
      toast.error("kindly recheck the Form");
    };
  }



  const updateSectionData = async (section, data) => {
    try {
      const response = await axiosInstance.patch(endpoints[section].patch, data);
      console.log(`${section} updated:`, response.data);
      await fetchSectionData(section);
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error(`Error updating ${section} data:`, error);
      toast.error("kindly recheck the Form");
    }
  };

  const deleteSectionData = async (section, id) => {
    try {
      await axiosInstance.delete(`${endpoints[section].delete}${id}`);
      toast.success("Deleted successfully!");
      console.log(`${section} deleted for ID:`, id);
      await fetchSectionData(section);
    } catch (error) {
      toast.error("kindly recheck the Form");
      console.error(`Error deleting ${section} data:`, error);
    }
  };

  useEffect(() => {
    fetchSectionData("employeeInfo");
    fetchSectionData("salary");
    fetchSectionData("bankDetails");
    fetchSectionData("earnings")
  }, []);

  //   useEffect(()=>{
  //   const select=localStorage.getItem('UserRole');
  //   if(select==='ROLE_ADMIN' && select==='ROLE_HR'){
  //     fetchSectionData(sections);
  //     createSectionData(sections);
  //     updateSectionData(sections);
  //     deleteSectionData(sections)

  //   }else if(select==='ROLE_MANAGER'){
  //     fetchSectionData("employeeInfo"); 
  //     fetchSectionData("salary");
  //     fetchSectionData("earnings");
  //     fetchSectionData("bankDetails");
  //   }

  // },[])


  // useEffect(() => {
  //   const select = localStorage.getItem('UserRole');
  //   const roleSections = {
  //     'ROLE_ADMIN': Object.keys(sections),
  //     'ROLE_HR': Object.keys(sections),
  //     'ROLE_MANAGER': ['employeeInfo', 'salary', 'earnings', 'bankDetails'],
  //   };

  //   const sectionsToFetch = roleSections[select] || [];
  //   sectionsToFetch.forEach(section => fetchSectionData(section));
  // }, []);


  const handleSave = () => {
    const errors = {};
    const currentSectionFields = sections[currentSection];

    currentSectionFields.forEach((field) => {
      if (!tempData[field.name]) {
        errors[field.name] = `${field.label} is required.`;
      }
    });

    setFieldErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors && currentSection) {
      const dataToSave = {
        employeeId: employeeId,
        ...tempData
      };

      const sectionDataExists = formData[currentSection] && Object.keys(formData[currentSection]).some(key => formData[currentSection][key]);

      if (!sectionDataExists) {
        createSectionData(currentSection, dataToSave);
      } else {
        updateSectionData(currentSection, dataToSave);
      }
      closePopup();
    }
  };



  return (
    <>
      <div className="flex items-center justify-start lg:p-2 md:px-2  md:py-1 bg-blue-950 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/userdashboard`}>
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </Link>
      </div>
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-48">
  <h2 className="lg:text-lg sm:text-base md:text-sm text-center mb-4 font-bold p-2 text-white bg-blue-950 rounded-md">
    Payroll Section
  </h2>

  {/* Display each section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6">
    {Object.keys(sections).map((sectionKey) => (
      <div
        key={sectionKey}
        className="p-3 sm:p-2 md:p-3 rounded-xl bg-gray-200 shadow cursor-pointer hover:shadow-lg overflow-auto sm:h-24 md:h-auto"
        onClick={() => openPopup(sectionKey)}
      >
        <h3 className="text-base sm:text-sm md:text-lg font-bold mb-2 uppercase">
          {sectionKey.replace(/([A-Z])/g, " $1").trim()}
        </h3>
        {sections[sectionKey].slice(0, 3).map((field, index) => (
          <p key={index} className="text-sm lg:text-lg sm:text-xs md:text-xs">
            <strong>{field.label}:</strong> {formData[sectionKey][field.name] || ""}
          </p>
        ))}
      </div>
    ))}
  </div>

  {popupVisible && currentSection && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:items-center sm:justify-center rounded shadow-lg">
    <div className="bg-gray-300 rounded-lg shadow-lg w-11/12 sm:w-5/6 lg:w-1/2 max-h-full sm:max-h-none overflow-y-auto sm:overflow-visible">
      <h1 className="text-base sm:text-sm md:text-xs mb-4  w-full p-2 flex items-center justify-center text-white bg-blue-950 rounded shadow-lg uppercase">
        {currentSection.replace(/([A-Z])/g, " $1").trim()} Details
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3 md:gap-4 p-4 sm:p-3 md:p-4 mb-4">
        {sections[currentSection].map((field, index) => (
          <div key={index}>
            <label className="block text-sm sm:text-xs  md:text-xs">{field.label}:</label>
            <input
              type={field.type === "file" ? "file" : field.type === "date" ? "date" : "text"}
              accept={field.type === "file" ? ".png,.jpg,.pdf" : undefined}
              minLength={field.type === "text" ? field.minLength || "" : undefined}
              maxLength={field.type === "text" ? field.maxLength || "" : undefined}
              pattern={field.validation ? field.validation.source : undefined}
              value={field.type === "file" ? undefined : tempData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e, field.type === "file")}
              className="w-full p-1 sm:p-1 md:p-2 border  border-gray-300 rounded-lg"
              readOnly
            />
            {fieldErrors[field.name] && (
              <p className="text-red-600 text-xs  sm:text-xs md:text-xs mt-1">{fieldErrors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 mb-4 flex justify-center sm:justify-end space-x-3 px-3 sm:px-3 md:px-4">
        <button
          onClick={handleSave}
          disabled={true}
          className="border border-black bg-gray-500 text-white px-3 sm:px-2 md:px-3 py-2 rounded-md hover:bg-gray-600 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          onClick={closePopup}
          className="border border-black bg-gray-500 text-white px-3 sm:px-2 md:px-3 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

</div>


    </>
  );
};


export default Test;

