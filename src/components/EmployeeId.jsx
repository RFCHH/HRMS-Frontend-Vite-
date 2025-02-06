import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosConfig";
import { NavLink } from "react-router-dom";
import { FaLessThan } from 'react-icons/fa';
import DialogueBox from "../components/uploadDoc/DocumentUpload";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const IdCardPreview = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [image, setImage] = useState(null);
  const [isDialogueBoxOpen, setIsDialogueBoxOpen] = useState(false);
  const employeeId = localStorage.getItem("EmpId");
  const organizationId = localStorage.getItem("organizationId"); // Get organizationId from localStorage
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Fetch employee data for ID card preview
        const response = await axiosInstance.get(
          `hrmsapplication/employee/getIdCard?employeeId=${employeeId}`
        );
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Error something went wrong ");
      }
    };


    const fetchIdCardImage = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/documents/id-card-pic?organizationId=${organizationId}&employeeId=${employeeId}`
        );
        setImage(response.data);
      } catch (error) {
        console.error("Error fetching ID card image:", error);
        toast.error("Error something went wrong ");
      }
    };

    if (employeeId && organizationId) {
      fetchEmployeeData();
      fetchIdCardImage(); // Fetch the ID card image 
    }
  }, [employeeId, organizationId]);

  const onFileUploadSuccesfull = (data) => {
    setImage(data);
  };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  const { employeeName = "N/A", contactNumber = "N/A", designation = "N/A" } = employeeData || {};

  const handleOpenDialogueBox = () => {
    setIsDialogueBoxOpen(true);
  };

  const handleCloseDialogueBox = () => {
    setIsDialogueBoxOpen(false);
  };

  const handleDialogueBoxSubmit = (formData) => {
    console.log("Submitted data:", formData);
    setIsDialogueBoxOpen(false);
    setUploadedFileUrl(formData.url);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
        <NavLink
          className="absolute top-5 left-5 flex items-center px-2 py-2 border-2 bg-blue-950 rounded-md w-40"
          to="/userdashboard"
        >
          <FaLessThan className="text-white mr-2" />
          <span className="text font-semibold text-white">Previous Page</span>
        </NavLink>
        <div className="relative w-80 bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-center text-2xl font-semibold text-gray-700 mb-5">
            ID Card Preview
          </h2>
          <img
            src="/rfchh.jpg"
            alt="Company Logo"
            className="mx-auto w-24 h-auto"
          />
          <div className="text-center mb-6">
            <div
              className="relative w-36 h-36 bg-gray-100 mx-auto mt-4 rounded-full flex items-center justify-center shadow-inner cursor-pointer"
              onClick={handleOpenDialogueBox}
            >
              {image ? (
                <img
                  src={image || "/rfchh.jpg"}
                  alt="Uploaded"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-lg">150 x 150</span>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800">{employeeName}</h3>
            <p className="text-base text-indigo-600 font-medium">{designation}</p>

            <div className="mt-4 text-sm text-gray-600 leading-6">
              <p>
                <strong>ID No.:</strong> {employeeId || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {contactNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isDialogueBoxOpen && (
        <DialogueBox
          onClose={handleCloseDialogueBox}
          onSubmit={handleDialogueBoxSubmit}
          category="ID_CARD"
          employeeId={employeeId}
          outevent={onFileUploadSuccesfull}
        />
      )}
    </>
  );
};

export default IdCardPreview;
