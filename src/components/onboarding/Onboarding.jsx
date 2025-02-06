import { useState } from "react";
import { validateOnboardingDocuments } from "./Onboardingvalidations";
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaLessThan } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  
const OnboardingDocuments = () => {
  
  const [formValues, setFormValues] = useState({
    aadharName: "",
    aadharNumber: "",
    panName: "",
    panNumber: "",
    panDocument: null,
    aadharDocument: null,
    higherEducationFile: null,
    intermediateFile: null,
    sscFile: null,
  });

  const [errors, setErrors] = useState({});
  const userRole = localStorage.getItem("UserRole");
const employeeId = localStorage.getItem('EmpId')
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z].*[\s]*$/;

    if (["aadharName", "panName", "panNumber"].includes(name)) {
      if (value === "" || regex.test(value)) {
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        setErrors({
          ...errors,
          [name]: "Only characters, with space between words.",
        });
        return;
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateOnboardingDocuments(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted Successfully", formValues);
    } else {
      console.log("Form contains errors");
      toast.error("kindly recheck the Form");
    }
  };

  return (
    <div className="container mx-auto w-full max-w-7xl text-center bg-gray-200 p-6">
        
      <NavLink
            to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
            className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-white mr-2" />
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </NavLink>
      {/* Navigation Links Grouped in a single div */}
      <div className="flex justify-center space-x-10 mb-6 flex-wrap">
  {/* Home Section - Icon and Text in Same Div */}
  <div className="flex items-center space-x-2">
    <FaHome className="text-black mr-2" />
    <Link to='/admindashboard'>
      <button><span className="font-semibold text-black">Home</span></button>
    </Link>
  </div>

  {/* Other Links */}
  <Link to='/onboardingDocuments'>
    <button><span className="font-semibold text-black">Onboarding Documents</span></button>
  </Link>
  <Link to='/allEmployee'>
    <button><span className="font-semibold text-black">Profile Creation</span></button>
  </Link>
  <Link to={`/payrollSection/${employeeId}`}>
    <button><span className="font-semibold text-black">Payroll Section</span></button>
  </Link>
</div>


      <h2 className="text-2xl font-semibold mb-6 text-center">Onboarding Documents Section</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="bg-white text-black p-6 rounded-md shadow-md">
            <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Government ID</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="text-base">
                <label className="block mb-2">Person Name as per Aadhar</label>
                <input
                  type="text"
                  name="aadharName"
                  value={formValues.aadharName}
                  onChange={handleInputChange}
                  className="input-field border border-gray-800 rounded-md w-full p-2"
                />
                {errors.aadharName && <p className="text-red-500">{errors.aadharName}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2">Aadhar Card Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formValues.aadharNumber}
                  onChange={handleInputChange}
                  className="input-field border border-gray-800 rounded-md w-full p-2"
                />
                {errors.aadharNumber && <p className="text-red-500">{errors.aadharNumber}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2">Aadhar Document</label>
                <input
                  type="file"
                  name="aadharDocument"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
                {errors.aadharDocument && <p className="text-red-500">{errors.aadharDocument}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2">Person Name as per PAN</label>
                <input
                  type="text"
                  name="panName"
                  value={formValues.panName}
                  onChange={handleInputChange}
                  className="input-field border border-gray-800 rounded-md w-full p-2"
                />
                {errors.panName && <p className="text-red-500">{errors.panName}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2">PAN Card Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formValues.panNumber}
                  onChange={handleInputChange}
                  className="input-field border border-gray-800 rounded-md w-full p-2"
                />
                {errors.panNumber && <p className="text-red-500">{errors.panNumber}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2">PAN Document</label>
                <input
                  type="file"
                  name="panDocument"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
                {errors.panDocument && <p className="text-red-500">{errors.panDocument}</p>}
              </div>

            </div>
          </div>

          <div className="bg-white text-black p-6 rounded-md shadow-md">
            <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Educational Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-base">
                <label className="block mb-2 text-left ml-2">Higher Education</label>
                <input
                  type="file"
                  name="higherEducationFile"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
                {errors.higherEducationFile && <p className="text-red-500">{errors.higherEducationFile}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2 text-left ml-2">Intermediate / Diploma</label>
                <input
                  type="file"
                  name="intermediateFile"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
                {errors.intermediateFile && <p className="text-red-500">{errors.intermediateFile}</p>}
              </div>

              <div className="text-base">
                <label className="block mb-2 text-left ml-2">SSC</label>
                <input
                  type="file"
                  name="sscFile"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
                {errors.sscFile && <p className="text-red-500">{errors.sscFile}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white text-black p-6 rounded-md shadow-md">
            <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Experience Certificates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="text-base">
                <label className="block mb-2 text-left ml-2">Experience Letters</label>
                <input
                  type="file"
                  name="experienceLettersFile"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
              </div>

              <div className="text-base">
                <label className="block mb-2 text-left ml-2">Course/Training Certifications</label>
                <input
                  type="file"
                  name="courseCertificationsFile"
                  onChange={handleFileChange}
                  className="input-field rounded-md w-full p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#00246B] text-white p-3 rounded-md w-32"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingDocuments;

// import { useState } from "react";
// import axiosInstance from "../axiosConfig";
// import { validateOnboardingDocuments } from "./Onboardingvalidations";
// import { Link, NavLink } from "react-router-dom";
// import { FaHome, FaLessThan } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OnboardingDocuments = () => {
//   const [formValues, setFormValues] = useState({
//     aadharName: "",
//     aadharNumber: "",
//     panName: "",
//     panNumber: "",
//     panDocument: null,
//     aadharDocument: null,
//     higherEducationFile: null,
//     intermediateFile: null,
//     sscFile: null,
//     experienceLettersFile: null,
//     courseCertificationsFile: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const userRole = localStorage.getItem("UserRole");
//   const organizationId = localStorage.getItem("organizationId");
//   const employeeId = localStorage.getItem("EmpId");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const regex = /^[a-zA-Z].*[\s]*$/;

//     if (["aadharName", "panName", "panNumber"].includes(name)) {
//       if (value === "" || regex.test(value)) {
//         setFormValues({ ...formValues, [name]: value });
//         setErrors({ ...errors, [name]: "" });
//       } else {
//         setErrors({
//           ...errors,
//           [name]: "Only characters, with space between words.",
//         });
//         return;
//       }
//     } else {
//       setFormValues({ ...formValues, [name]: value });
//     }
//   };

//   const handleFileChange = async (e) => {
//     const { name, files } = e.target;
//     const file = files[0];
//     if (!file) return;

//     setFormValues({ ...formValues, [name]: file });
//   };

//   const uploadFile = async (file, category) => {
//     const fileName = encodeURIComponent(file.name);
//     const postUrl = `https://hrms-application-a6vr.onrender.com/hrmsapplication/documents/upload?organizationId=${organizationId}&employeeId=${employeeId}&fileName=${fileName}&category=${category}`;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axiosInstance.post(postUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (response.status === 200) {
//         toast.success(`${file.name} uploaded successfully`);
//         return true;
//       } else {
//         toast.error(`Failed to upload ${file.name}`);
//         return false;
//       }
//     } catch (error) {
//       console.error("File upload failed:", error);
//       toast.error(`Error uploading ${file.name}`);
//       return false;
//     }
//   };

//   const uploadAllFiles = async () => {
//     const fileCategories = {
//       aadharDocument: "NATIONAL_ID",
//       panDocument: "NATIONAL_ID",
//       higherEducationFile: "NATIONAL_ID",
//       intermediateFile: "EDUCATION",
//       sscFile: "EDUCATION",
//       experienceLettersFile: "EXPERIENCE",
//       courseCertificationsFile: "EXPERIENCE",
//     };

//     const uploadPromises = Object.entries(fileCategories).map(([key, category]) => {
//       const file = formValues[key];
//       if (file) {
//         return uploadFile(file, category);
//       }
//       return Promise.resolve(true); // Skip if no file provided
//     });

//     const uploadResults = await Promise.all(uploadPromises);
//     return uploadResults.every((result) => result); // Ensure all files are uploaded successfully
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const validationErrors = validateOnboardingDocuments(formValues);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       const filesUploaded = await uploadAllFiles();
//       if (filesUploaded) {
//         toast.success("All files and details submitted successfully!");
//         console.log("Form Submitted Successfully:", formValues);
//       } else {
//         toast.error("Some files failed to upload. Please try again.");
//       }
//     } else {
//       toast.error("Kindly recheck the form.");
//       console.log("Form contains errors:", validationErrors);
//     }

//     setIsSubmitting(false);
//   };

//   return (
//     <div className="container mx-auto w-full max-w-7xl text-center bg-gray-200 p-6">
//        
//       <NavLink
//         to={userRole === "ROLE_ADMIN" ? "/admindashboard" : "/userdashboard"}
//         className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5"
//       >
//         <FaLessThan className="text-white mr-2" />
//         <button>
//           <span className="text font-semibold text-white">Previous Page</span>
//         </button>
//       </NavLink>

//       <h2 className="text-2xl font-semibold mb-6 text-center">Onboarding Documents Section</h2>

//       <form onSubmit={handleSubmit}>
//       <div className="space-y-8">
//        <div className="bg-white text-black p-6 rounded-md shadow-md">
//                    <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Government ID</h3>
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
//               <div className="text-base">
//                <label className="block mb-2">Person Name as per Aadhar</label>
//                 <input
//                   type="text"
//                   name="aadharName"
//                   value={formValues.aadharName}
//                   onChange={handleInputChange}
//                   className="input-field border border-gray-800 rounded-md w-full p-2"
//                 />
//                 {errors.aadharName && <p className="text-red-500">{errors.aadharName}</p>}
//               </div>

//               <div className="text-base">
//                 <label className="block mb-2">Aadhar Card Number</label>
//                 <input
//                   type="text"
//                   name="aadharNumber"
//                   value={formValues.aadharNumber}
//                   onChange={handleInputChange}
//                   className="input-field border border-gray-800 rounded-md w-full p-2"
//                 />
//                 {errors.aadharNumber && <p className="text-red-500">{errors.aadharNumber}</p>}
//               </div>

//               <div className="text-base">
//                 <label className="block mb-2">Aadhar Document</label>
//                 <input
//                   type="file"
//                   name="aadharDocument"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//                 {errors.aadharDocument && <p className="text-red-500">{errors.aadharDocument}</p>}
//               </div>

//               <div className="text-base">
//                 <label className="block mb-2">Person Name as per PAN</label>
//                 <input
//                   type="text"
//                   name="panName"
//                   value={formValues.panName}
//                   onChange={handleInputChange}
//                   className="input-field border border-gray-800 rounded-md w-full p-2"
//                 />
//                 {errors.panName && <p className="text-red-500">{errors.panName}</p>}
//               </div>

//               {/* <div className="text-base">
//               //   <label className="block mb-2">PAN Card Number</label>
//               //   <input
//               //     type="text"
//               //     name="panNumber"
//               //     value={formValues.panNumber}
//               //     onChange={handleInputChange}
//               //     className="input-field border border-gray-800 rounded-md w-full p-2"
//               //   />
//               //   {errors.panNumber && <p className="text-red-500">{errors.panNumber}</p>}
//               // </div> */}

//               <div className="text-base">
//                 <label className="block mb-2">PAN Document</label>
//                 <input
//                   type="file"
//                   name="panDocument"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//                 {errors.panDocument && <p className="text-red-500">{errors.panDocument}</p>}
//               </div>

//             </div>
//           </div>

//           <div className="bg-white text-black p-6 rounded-md shadow-md">
//             <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Educational Documents</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="text-base">
//                 <label className="block mb-2">Higher Education</label>
//                 <input
//                   type="file"
//                   name="higherEducationFile"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//                 {errors.higherEducationFile && <p className="text-red-500">{errors.higherEducationFile}</p>}
//               </div>

//               <div className="text-base">
//                 <label className="block mb-2">Intermediate / Diploma</label>
//                 <input
//                   type="file"
//                   name="intermediateFile"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//                 {errors.intermediateFile && <p className="text-red-500">{errors.intermediateFile}</p>}
//               </div>

//               <div className="text-base">
//                 <label className="block mb-2">SSC</label>
//                 <input
//                   type="file"
//                   name="sscFile"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//                 {errors.sscFile && <p className="text-red-500">{errors.sscFile}</p>}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white text-black p-6 rounded-md shadow-md">
//             <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Experience Certificates</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//               <div className="text-base">
//                 <label className="block mb-2">Experience Letters</label>
//                 <input
//                   type="file"
//                   name="experienceLettersFile"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//               </div>

//               <div className="text-base">
//                 <label className="block mb-2">Course/Training Certifications</label>
//                 <input
//                   type="file"
//                   name="courseCertificationsFile"
//                   onChange={handleFileChange}
//                   className="input-field rounded-md w-full p-2"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className={`bg-[#00246B] text-white p-3 rounded-md w-32 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default OnboardingDocuments;


// import { useState } from "react";
// import axiosInstance from "../axiosConfig";
// import { validateOnboardingDocuments } from "./Onboardingvalidations";
// import { NavLink } from "react-router-dom";
// import { FaLessThan } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { API_CONFIG, FILE_CATEGORIES } from "../api's/ApiConfig";

// const OnboardingDocuments = () => {
//   const [formValues, setFormValues] = useState({
//     aadharName: "",
//     aadharNumber: "",
//     panName: "",
//     panNumber: "",
//     panDocument: null,
//     aadharDocument: null,
//     higherEducationFile: null,
//     intermediateFile: null,
//     sscFile: null,
//     experienceLettersFile: null,
//     courseCertificationsFile: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const userRole = localStorage.getItem("UserRole");
//   const organizationId = localStorage.getItem("organizationId");
//   const employeeId = localStorage.getItem("EmpId");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const regex = /^[a-zA-Z].*[\s]*$/;

//     if (["aadharName", "panName", "panNumber"].includes(name)) {
//       if (value === "" || regex.test(value)) {
//         setFormValues({ ...formValues, [name]: value });
//         setErrors({ ...errors, [name]: "" });
//       } else {
//         setErrors({
//           ...errors,
//           [name]: "Only characters, with space between words.",
//         });
//         return;
//       }
//     } else {
//       setFormValues({ ...formValues, [name]: value });
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     const file = files[0];
//     if (!file) return;

//     setFormValues({ ...formValues, [name]: file });
//   };

//   const uploadFile = async (file, category) => {
//     const fileName = encodeURIComponent(file.name);
//     const postUrl = API_CONFIG.uploadFile(organizationId, employeeId, fileName, category);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axiosInstance.post(postUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (response.status === 200) {
//         toast.success(`${file.name} uploaded successfully`);
//         return true;
//       } else {
//         toast.error(`Failed to upload ${file.name}`);
//         return false;
//       }
//     } catch (error) {
//       console.error("File upload failed:", error);
//       toast.error(`Error uploading ${file.name}`);
//       return false;
//     }
//   };

//   const uploadAllFiles = async () => {
//     const uploadPromises = Object.entries(FILE_CATEGORIES).map(([key, category]) => {
//       const file = formValues[key];
//       if (file) {
//         return uploadFile(file, category);
//       }
//       return Promise.resolve(true); // Skip if no file provided
//     });

//     const uploadResults = await Promise.all(uploadPromises);
//     return uploadResults.every((result) => result); // Ensure all files are uploaded successfully
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const validationErrors = validateOnboardingDocuments(formValues);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       const filesUploaded = await uploadAllFiles();
//       if (filesUploaded) {
//         toast.success("All files and details submitted successfully!");
//         console.log("Form Submitted Successfully:", formValues);
//       } else {
//         toast.error("Some files failed to upload. Please try again.");
//       }
//     } else {
//       toast.error("Kindly recheck the form.");
//       console.log("Form contains errors:", validationErrors);
//     }

//     setIsSubmitting(false);
//   };

//   return (
//     <div className="container mx-auto w-full max-w-7xl text-center bg-gray-200 p-6">
//        
//       <NavLink
//         to={userRole === "ROLE_ADMIN" ? "/admindashboard" : "/userdashboard"}
//         className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5"
//       >
//         <FaLessThan className="text-white mr-2" />
//         <button>
//           <span className="text font-semibold text-white">Previous Page</span>
//         </button>
//       </NavLink>

//       <h2 className="text-2xl font-semibold mb-6 text-center">Onboarding Documents Section</h2>

//       <form onSubmit={handleSubmit}>
//       <div className="space-y-8">
//         <div className="bg-white text-black p-6 rounded-md shadow-md">
//                     <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Government ID</h3>
//  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
//                <div className="text-base">
//                 <label className="block mb-2">Person Name as per Aadhar</label>
//                  <input
//                    type="text"
//                    name="aadharName"
//                    value={formValues.aadharName}
//                    onChange={handleInputChange}
//                    className="input-field border border-gray-800 rounded-md w-full p-2"
//                  />
//                  {errors.aadharName && <p className="text-red-500">{errors.aadharName}</p>}
//                </div>

//                <div className="text-base">
//                  <label className="block mb-2">Aadhar Card Number</label>
//                  <input
//                    type="text"
//                    name="aadharNumber"
//                    value={formValues.aadharNumber}
//                    onChange={handleInputChange}
//                    className="input-field border border-gray-800 rounded-md w-full p-2"
//                  />
//                  {errors.aadharNumber && <p className="text-red-500">{errors.aadharNumber}</p>}
//                </div>

//                <div className="text-base">
//                  <label className="block mb-2">Aadhar Document</label>
//                  <input
//                    type="file"
//                    name="aadharDocument"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                  {errors.aadharDocument && <p className="text-red-500">{errors.aadharDocument}</p>}
//                </div>

//                <div className="text-base">
//                  <label className="block mb-2">Person Name as per PAN</label>
//                  <input
//                    type="text"
//                    name="panName"
//                    value={formValues.panName}
//                    onChange={handleInputChange}
//                    className="input-field border border-gray-800 rounded-md w-full p-2"
//                  />
//                  {errors.panName && <p className="text-red-500">{errors.panName}</p>}
//                </div>

//                <div className="text-base">
//                   <label className="block mb-2">PAN Card Number</label>
//                   <input
//                     type="text"
//                     name="panNumber"
//                     value={formValues.panNumber}
//                     onChange={handleInputChange}
//                     className="input-field border border-gray-800 rounded-md w-full p-2"
//                   />
//                   {errors.panNumber && <p className="text-red-500">{errors.panNumber}</p>}
//                 </div>

//                <div className="text-base">
//                  <label className="block mb-2">PAN Document</label>
//                  <input
//                    type="file"
//                    name="panDocument"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                  {errors.panDocument && <p className="text-red-500">{errors.panDocument}</p>}
//                </div>

//              </div>
//            </div>

//            <div className="bg-white text-black p-6 rounded-md shadow-md">
//              <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Educational Documents</h3>
//              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                <div className="text-base">
//                  <label className="block mb-2">Higher Education</label>
//                  <input
//                    type="file"
//                    name="higherEducationFile"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                  {errors.higherEducationFile && <p className="text-red-500">{errors.higherEducationFile}</p>}
//                </div>

//                <div className="text-base">
//                  <label className="block mb-2">Intermediate / Diploma</label>
//                  <input
//                    type="file"
//                    name="intermediateFile"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                  {errors.intermediateFile && <p className="text-red-500">{errors.intermediateFile}</p>}
//                </div>

//                <div className="text-base">
//                  <label className="block mb-2">SSC</label>
//                  <input
//                    type="file"
//                    name="sscFile"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                  {errors.sscFile && <p className="text-red-500">{errors.sscFile}</p>}
//                </div>
//              </div>
//            </div>

//            <div className="bg-white text-black p-6 rounded-md shadow-md">
//              <h3 className="text-lg bg-blue-950 text-white p-2 rounded-md font-semibold mb-4">Experience Certificates</h3>
//              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//                <div className="text-base">
//                  <label className="block mb-2">Experience Letters</label>
//                  <input
//                    type="file"
//                    name="experienceLettersFile"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                </div>

//                <div className="text-base">
//                  <label className="block mb-2">Course/Training Certifications</label>
//                  <input
//                    type="file"
//                    name="courseCertificationsFile"
//                    onChange={handleFileChange}
//                    className="input-field rounded-md w-full p-2"
//                  />
//                </div>
//              </div>
//            </div>
//          </div>
//          <div className="flex justify-end mt-6">
//            <button
//              type="submit"
//              className={`bg-[#00246B] text-white p-3 rounded-md w-32 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//              disabled={isSubmitting}
//            >
//              {isSubmitting ? "Submitting..." : "Submit"}
//            </button>
//          </div>
//       </form>
//     </div>
//   );
// };

// export default OnboardingDocuments;
