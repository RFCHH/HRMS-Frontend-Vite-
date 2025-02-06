// import React, { useState } from 'react';
// // import axios from 'axios';
// import axiosInstance from '../axiosConfig';

// const FileUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);


//   const staticData = {
//     employeeId: 'EMP123',
//     organizationId: 'ORG456',
//     fileCategory: 'Profile Documents', 
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     // formData.append('employeeId', staticData.employeeId);
//     // formData.append('organizationId', staticData.organizationId);
//     // formData.append('fileName', selectedFile.name); 
//     // formData.append('fileCategory', staticData.fileCategory);

//     try {
//       const response = await axiosInstance.post('https://hrms-application-a6vr.onrender.com/hrmsapplication/documents/upload?organizationId=hrms&employeeId=HRMS1&fileName=TEST&category=EDUCATION', formData, {
//         // headers: {
//         //   'Content-Type': 'multipart/form-data',
//         // },
//       });      
//       console.log('File uploaded successfully:', response.data);    
//     } catch (error) {
//       console.error('Error uploading file:', error);     
//     }
//   };

//   return (
//     <div className="container mx-auto mt-10">
//       <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//         <div>
//           <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
//             Upload File
//           </label>
//           <input
//             type="file"
//             id="fileUpload"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FileUpload;
