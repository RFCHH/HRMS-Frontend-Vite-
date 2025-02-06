import React, { useState, useEffect } from "react";
import { MdCancelPresentation } from "react-icons/md";
import axiosInstance from "./axiosConfig"; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  


const EditFamilyDetails = ({ member, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({
    prefix: "",
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
    maritialStatus: "",
    dob: "",
    gender: "",
    fatherName: "",
    doj: "",
    bloodGroup: "",
  });

  const [errors, setErrors] = useState({});
   const [validationErrors, setValidationErrors] = useState({});
  const [backendError, setBackendError] = useState(""); 

  useEffect(() => {
    if (member) {
      setFormValues(member); 
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z].*[\s]*$/;

    if (["firstname", "email", "lastname", "fatherName"].includes(name)) {
      if (value === "" || regex.test(value)) {
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        setErrors({
          ...errors,
          [name]: "Only letters are allowed, with a single space between words.",
        });
        return;
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }

    if (name === "prefix") {
      if (value === "Mr ") {
        setFormValues({ ...formValues, [name]: value, gender: "Male", maritialStatus: "" });
      } else if (value === "Ms ") {
        setFormValues({ ...formValues, [name]: value, gender: "Female", maritialStatus: "Single" });
      } else if (value === "Mrs ") {
        setFormValues({ ...formValues, [name]: value, gender: "Female", maritialStatus: "Married" });
      } else {
        setFormValues({ ...formValues, [name]: value });
      }
    }
  };

  const validatephoneNumber = (phoneNumber, countryCode) => {
    let error = "";
    const phoneLengthByCountry = {
      "+91": 10,
      "+1": 10,
      "+44": 10,
      "+61": 9,
      "+64": 9,
      "+27": 9,
      "+977": 10,
      "+94": 9,
      "+60": 9,
      "+65": 8,
    };
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const nonIndianPhoneRegex = /^[1-9]\d+$/;
    const phoneLength = phoneLengthByCountry[countryCode] || 10;

    if (!phoneNumber) {
      error = "Number is required.";
    } else if (phoneNumber.length !== phoneLength) {
      error = `Number must be exactly ${phoneLength} digits for ${countryCode}.`;
    } else if (countryCode === "+91" && !indianPhoneRegex.test(phoneNumber)) {
      error = "Number must start with 6, 7, 8, or 9 and be 10 digits.";
    } else if (!nonIndianPhoneRegex.test(phoneNumber)) {
      error = `Number must not start with 0 and should be exactly ${phoneLength} digits.`;
    }
    return error;
  };

  const handleMobileInput = (e) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/\D/g, "");
    setFormValues({ ...formValues, phoneNumber: sanitizedValue });
  };

  const validateForm = () => {
    let validationErrors = {};
    const currentDate = new Date();

    if (!formValues.prefix) {
      validationErrors.prefix = "Prefix is required.";
    }

    ["firstname", "lastname", "fatherName"].forEach((field) => {
      if (!formValues[field]) {
        validationErrors[field] = `${field} is required.`;
      } else if (!/^[A-Za-z ]+$/.test(formValues[field])) {
        validationErrors[field] = "Only characters are allowed.";
      } else if (formValues[field].length < 2) {
        validationErrors[field] = `${field} must be at least 2 characters.`;
      } else if (formValues[field].length > 25) {
        validationErrors[field] = `${field} must be at most 25 characters.`;
      }
    });

    const phoneError = validatephoneNumber(formValues.phoneNumber, formValues.countryCode);
    if (phoneError) {
      validationErrors.phoneNumber = phoneError;
    }

    if (!formValues.maritialStatus) {
      validationErrors.maritialStatus = "Marital status is required.";
    }

    const dobDate = new Date(formValues.dob);
    if (!formValues.dob) {
      validationErrors.dob = "Date of Birth is required.";
    } else if (dobDate > currentDate) {
      validationErrors.dob = "Date of Birth cannot be in the future.";
    } else {
      let age = currentDate.getFullYear() - dobDate.getFullYear();
      const monthDifference = currentDate.getMonth() - dobDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 18) {
        validationErrors.dob = "You must be at least 18 years old.";
      } else if (age > 100) {
        validationErrors.dob = "DOB should not exceed 100 years in the past.";
      }
    }

    if (!formValues.gender) {
      validationErrors.gender = "Gender is required.";
    }

    const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  
  const past50Years = new Date(today.setFullYear(today.getFullYear() - 50));
  const future6Months = new Date(new Date().setMonth(new Date().getMonth() + 6));

  const past50YearsString = past50Years.toISOString().split("T")[0]; 
  const future6MonthsString = future6Months.toISOString().split("T")[0]; 

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.doj) {
      errors.doj = "Date of Joining is required.";
    } else {
      const joiningDate = new Date(formValues.doj);

      if (joiningDate < past50Years) {
        errors.doj = "Date of Joining should not be older than 50 years.";
      } else if (joiningDate > future6Months) {
        errors.doj = "Date of Joining should not be more than 6 months in the future.";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
    if (!formValues.doj) {
      validationErrors.doj = "Date is required.";
    } 
    if (!formValues.bloodGroup) {
      validationErrors.bloodGroup = "Blood group is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (validateForm()) {
      try {
        const response = await axiosInstance.post("hrmsapplication/employee/create", formValues);
        console.log("Form submitted successfully", response.data);
        onSave(formValues); 
        toast.success("created sucessfully");
      } catch (error) {
        if (error.response && error.response.data) {
          setBackendError(error.response.data.message);   
          // toast.error("Kindly Re-check entire form")
          toast.error(error.response.data.toString())
        } else {
          setBackendError("An error occurred while submitting the form.");
        }
      }
    } else {
      console.log("Form submission failed due to validation errors");
    }
  };

  return (
   
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-2">
        <div className="bg-gray-200 p-4 rounded-md shadow-md w-full sm:max-w-lg md:w-3/4 lg:w-2/3 max-h-[80vh] md:max-h-none overflow-y-auto md:overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-950 rounded-md p-2 mb-4 flex items-center justify-between">
            <h2 className="text-lg  text-white pl-2">Add Personal Details</h2>
            <button className="text-white pr-1 hover:text-gray-700" onClick={onCancel}>
              <MdCancelPresentation size={24} />
            </button>
          </div>
      
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Prefix */}
              <div>
                <label className="block text-gray-700">Prefix</label>
                <select name="prefix" value={formValues.prefix} onChange={handleChange} className="w-full p-2 border-gray-300 rounded-md">
                  <option value="" disabled>Select</option>
                  <option value="Mr ">Mr.</option>
                  <option value="Ms ">Ms.</option>
                  <option value="Mrs ">Mrs.</option>
                </select>
                {errors.prefix && <span className="text-red-800 block">{errors.prefix}</span>}
              </div>
      
              {/* First Name */}
              <div>
                <label className="block text-gray-700">First Name</label>
                <input type="text" name="firstname" value={formValues.firstname} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.firstname && <span className="text-red-800 block">{errors.firstname}</span>}
              </div>
      
              {/* Middle Name */}
              <div>
                <label className="block text-gray-700">Middle Name</label>
                <input type="text" name="middlename" value={formValues.middlename} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
      
              {/* Last Name */}
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input type="text" name="lastname" value={formValues.lastname} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.lastname && <span className="text-red-800 block">{errors.lastname}</span>}
              </div>
            {/* </div> */}
      
            {/* Second Row */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> */}
      
              {/* Email */}
              <div>
                <label className="block text-gray-700">Email</label>
                <input type="email" name="email" value={formValues.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.email && <span className="text-red-800 block">{errors.email}</span>}
              </div>
      
              {/* Phone Number */}
              <div>
                <label className="block text-gray-700">Phone Number</label>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* Country Code */}
                  <select name="countryCode" value={formValues.countryCode} onChange={handleChange} className="p-2 border border-gray-300 rounded-md">
                    <option value="+code">Select</option>
                    <option value="+91">+91 (India)</option>
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
                  {errors.countryCode && <p className="text-red-800">{errors.countryCode}</p>}
      
                  {/* Phone Number */}
                  <input type="text" name="phoneNumber" value={formValues.phoneNumber} onChange={handleMobileInput} maxLength="10" className="w-full p-2 border border-gray-300 rounded-md" />
                  {errors.phoneNumber && <span className="text-red-800 block">{errors.phoneNumber}</span>}
                </div>
              </div>
      
              {/* Marital Status */}
              <div>
                <label className="block text-gray-700">Marital Status</label>
                <select name="maritialStatus" value={formValues.maritialStatus} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                </select>
                {errors.maritialStatus && <span className="text-red-800 block">{errors.maritialStatus}</span>}
              </div>
      
              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700">Date of Birth</label>
                <input type="date" name="dob" max={new Date().toISOString().split("T")[0]} value={formValues.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.dob && <span className="text-red-800 block">{errors.dob}</span>}
              </div>
            {/* </div> */}
      
            {/* Third Row */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> */}
              
              {/* Gender */}
              <div>
                <label className="block text-gray-700">Gender</label>
                <select name="gender" value={formValues.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <span className="text-red-800 block">{errors.gender}</span>}
              </div>
      
              {/* Father's Name */}
              <div>
                <label className="block text-gray-700">Father's Name</label>
                <input type="text" name="fatherName" value={formValues.fatherName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
      
              {/* Date of Joining */}
              <div>
                <label className="block text-gray-700">Date of Joining</label>
                <input type="date" name="doj" value={formValues.doj} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
      
              {/* Blood Group */}
              <div>
                <label className="block text-gray-700">Blood Group</label>
                <select name="bloodGroup" value={formValues.bloodGroup} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Select bloodGroup</option>
                <option value="O +ve">O+</option>
                <option value="O -ve">O-</option>
                <option value="A +ve">A+</option>
                <option value="A -ve">A-</option>
                <option value="B +ve">B+</option>
                <option value="B -ve">B-</option>
                <option value="AB +ve">AB+</option>
                <option value="AB -ve">AB-</option>
                </select>
              </div>
            </div>
      
            {/* Buttons */}
            <div className="flex justify-end">
              <button type="submit" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3">Save</button>
              <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditFamilyDetails;