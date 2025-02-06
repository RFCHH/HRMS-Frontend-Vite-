import React, { useState, useEffect } from "react";
import { FaEdit, FaLessThan } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosConfig";
import EditFamilyDetails from "./EditPersonalDetails";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

const PersonalInfo = () => {
  const { employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
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

  const userRole = localStorage.getItem("UserRole");

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/employee/getEmployeeProfile/${employeeId}`
      );
      const data = response.data;

      setPersonalDetails({
        prefix: data.prefix || "",
        firstname: data.firstname || "",
        middlename: data.middlename || "",
        lastname: data.lastname || "",
        email: data.email || "",
        countryCode: data.countryCode || "",
        phoneNumber: data.phoneNumber || 0,
        maritialStatus: data.maritialStatus || "",
        dob: data.dob || "",
        gender: data.gender || "",
        fatherName: data.fatherName || "",
        doj: data.doj || "",
        bloodGroup: data.bloodGroup || "",
      });

      // toast.success("Data loaded successfully!"); // Show success toast for data fetch
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data!"); // Show error toast for data fetch failure
    }
  };

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (updatedDetails) => {
    try {
      const dataToUpdate = {
        employeeId,
        ...updatedDetails,
      };

      const response = await axiosInstance.patch(
        "hrmsapplication/employee/update",
        dataToUpdate
      );

      console.log("Update successful:", response.data);

      fetchData();

      setIsModalOpen(false);
      toast.success("Personal details updated successfully!"); // Show success toast for update
    } 
    // catch (error) {
    //   console.log(error.response.data.toString());
    //   toast.error("kindly recheck the Form"); // Show error toast for update failure
    // }
    catch (error) {
      console.error("Error adding the job:", error);

      // Extract error details
      let errorMessage = "Failed to add the job. Please try again.";
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error(errorMessage); // Show extracted error in toast
    }
  };

  return (
    <div className="p-2 sm:p-4">
  {/* ToastContainer to display toasts */}
  <div className="flex items-center justify-start p-2 border-2 border-gray-800  bg-blue-950 rounded-md  lg:w-[150px] w-[150px] mb-3 mt-5 ml-2 sm:ml-5">
          <FaLessThan className="text-white mr-2" />
    <Link to={`/dashboard/${employeeId}`}>
      <button>
        <span className="font-semibold text-white">Previous Page</span>
      </button>
    </Link>
  </div>

  <div className="flex flex-col items-center p-3 sm:p-5 mt-5 sm:mt-16">
    <div className="w-full sm:w-2/3 bg-white shadow-lg rounded-lg relative">
      <div className="bg-blue-950 text-white p-4 sm:p-6 rounded-t-lg"></div>
      <div className="p-4 sm:p-8 border border-gray-300 rounded-b-lg relative">
        <div className="absolute top-3 right-3 sm:top-9 sm:right-9 flex space-x-2">
          {userRole === "ROLE_ADMIN" && (
            <button
              className="text-black hover:text-orange-700"
              onClick={handleEditClick}
            >
              <FaEdit size={20} />
            </button>
          )}
        </div>

        <div className="bg-gray-100 p-3 sm:p-5 rounded-md border border-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Prefix", value: personalDetails.prefix },
              { label: "First Name", value: personalDetails.firstname },
              { label: "Last Name", value: personalDetails.lastname },
              { label: "Middle Name", value: personalDetails.middlename },
              { label: "Email", value: personalDetails.email },
              {
                label: "Phone Number",
                value: `${personalDetails.countryCode} ${personalDetails.phoneNumber}`,
              },
              { label: "Marital Status", value: personalDetails.maritialStatus },
              { label: "Date of Birth", value: personalDetails.dob },
              { label: "Gender", value: personalDetails.gender },
              { label: "Date of Joining", value: personalDetails.doj },
              { label: "Father's Name", value: personalDetails.fatherName },
              { label: "Blood Group", value: personalDetails.bloodGroup },
            ].map((detail, index) => (
              <div key={index} className="flex flex-col">
                <p className="font-bold">{detail.label}</p>
                <p className="break-words">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    {isModalOpen && (
      <EditFamilyDetails
        member={personalDetails}
        onSave={handleSave}
        onCancel={handleModalClose}
      />
    )}
  </div>
</div>

  );
};

export default PersonalInfo;
