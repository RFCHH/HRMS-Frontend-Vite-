import { useState, useEffect } from "react";
import { AiTwotoneHome, AiOutlinePlus, AiOutlineDownload,AiOutlineHome } from "react-icons/ai";
import { MdExpandMore, MdExpandLess, MdEdit, MdDelete, MdCancel } from "react-icons/md";
import EditCareerPopup from "./CareerPop";
import axiosInstance from "./axiosConfig";
import {Link,NavLink,useParams} from 'react-router-dom';
import { FaLessThan} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 



function Career() {
  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careers, setCareers] = useState([]); // Current page's job posts
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const jobsPerPage = 6;
  const {employeeId} = useParams()

  // Get user role from localStorage to restrict functionality
  const userRole = localStorage.getItem("UserRole");

  // Fetch job posts when the component mounts or currentPage changes
  useEffect(() => {
    fetchJobPosts();
  }, [currentPage]);

  // Function to fetch job posts based on currentPage and jobsPerPage
  const fetchJobPosts = async () => {
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/carrers/getJobPosts?pageNumber=${currentPage - 1}&size=${jobsPerPage}`
      );

      if (response.data.jobList && Array.isArray(response.data.jobList)) {
        const jobPosts = response.data.jobList.map((post) => ({
          jobId: post.jobId,
          jobTitle: post.jobTitle,
          status: post.status,
          publishDate: post.publishDate,
          expiryDate: post.expiryDate,
          jobLocation: null,
          experienceYear: null,
          experienceMonth: null,
          workMode: null,
          noOfRequirements: null,
          salaryFrom: null,
          salaryTo: null,
          jobType: null,
          skillSet: null,
          age: null,
          jobDescription: null,
        }));

        setCareers(jobPosts);
        // toast.success("Data loaded successfully!"); 
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else if (response.data.totalJobs) {
          setTotalPages(Math.ceil(response.data.totalJobs / jobsPerPage));
        } else {
          if (response.data.jobList.length === jobsPerPage) {
            setTotalPages(currentPage + 1);
          } else {
            setTotalPages(currentPage);
          }
        }
      } else {
        console.error("Expected an array in jobList but got:", response.data.jobList);
      }
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  // Handler to open the Add/Edit modal
  const handleAddClick = () => {
    if (userRole === "ROLE_ADMIN") {
      setIsModalOpen(true);
      // setSelectedCareer(null);
    }
  };

  // Handler to save career data (add or edit)
  const handleSaveCareer = async (careerData) => {
    if (selectedCareer !== null) {
      try {
        // PATCH request for updating career data
        await axiosInstance.patch(`hrmsapplication/carrers/update`, careerData, {
          params: { jobId: careerData.jobId },
        });
  
        const updatedCareers = careers.map((career) =>
          career.jobId === careerData.jobId ? careerData : career
        );
        setCareers(updatedCareers);
        setIsModalOpen(false);
        toast.success("Job updated successfully!"); // Success toast for PATCH
      } catch (error) {
        console.error("Error updating the job:", error);
  
        // Extract error details
        let errorMessage = "Failed to update the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
  
        toast.error(errorMessage); // Show extracted error in toast
      }
    } else {
      try {
        // POST request for creating a new career
        const response = await axiosInstance.post(`hrmsapplication/carrers/create`, careerData);
  
        setCareers([...careers, response.data]);
        setIsModalOpen(false);
        toast.success("Job added successfully!"); // Success toast for POST
      } catch (error) {
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
    }
  };
   

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to toggle the expansion of a card
  const toggleExpandCard = async (index) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null);
      return;
    }

    setExpandedCardIndex(index);

    const job = careers[index];
    if (!job.jobLocation) {
      try {
        const response = await axiosInstance.get(`hrmsapplication/carrers/${job.jobId}`);

        const detailedJob = response.data;

        const updatedCareers = [...careers];
        updatedCareers[index] = {
          ...updatedCareers[index],
          jobLocation: detailedJob.jobLocation,
          numberOfYears: detailedJob.numberOfYears,
          numberOfMonths: detailedJob.numberOfMonths,
          workMode: detailedJob.workMode,
          noOfRequirements: detailedJob.noOfRequirements,
          salaryFrom: detailedJob.salaryFrom,
          salaryTo: detailedJob.salaryTo,
          jobType: detailedJob.jobType,
          skillSet: detailedJob.skillSet,
          age: detailedJob.age,
          jobDescription: detailedJob.jobDescription,
        };
       
        setCareers(updatedCareers);
        // toast.success("Data loaded successfully!"); 
      } catch (error) {
        console.error("Error fetching job details:", error);
        alert("Failed to fetch job details. Please try again later.");
      }
    }
  };

  // Handler to open the Edit modal with selected career
  const handleEditClick = (career) => {
    if (userRole === "ROLE_ADMIN") {
      setSelectedCareer(career);
      setIsModalOpen(true);
    }
  };

  // Handler to delete a career
  const handleDeleteClick = async (career) => {
    if (userRole === "ROLE_ADMIN") {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the job "${career.jobTitle}"?`
      );
      if (!confirmDelete) return;

      try {
        await axiosInstance.delete(`hrmsapplication/carrers/deletecareers/${career.jobId}`);

        const updatedCareers = careers.filter((c) => c.jobId !== career.jobId);
        setCareers(updatedCareers);

        const newTotalPages = Math.ceil(updatedCareers.length / jobsPerPage) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        // alert(`Job "${career.jobTitle}" has been successfully deleted.`);
        toast.success("Deleted successfully!"); 
      } catch (error) {
        console.error("Error deleting job post:", error);
        alert("Failed to delete the job post. Please try again.");
      }
    }
  };

  // Handler to cancel a job by updating its status to 'cancelled'
  const handleCancelJob = async (career) => {
    if (userRole === "ROLE_ADMIN") {
      const confirmCancel = window.confirm(
        `Are you sure you want to cancel the job "${career.jobTitle}"?`
      );
      if (!confirmCancel) return;

      try {
        await axiosInstance.patch(`hrmsapplication/carrers/updateStatus?`, null, {
          params: {
            jobId: career.jobId,
            status: "cancelled",
          },
        });

        const updatedCareers = careers.map((c) =>
          c.jobId === career.jobId ? { ...c, status: "cancelled" } : c
        );
        setCareers(updatedCareers);

        alert(`Job "${career.jobTitle}" has been successfully cancelled.`);
        toast.success("Data updated successfully!"); 
      } catch (error) {
        console.error("Error cancelling the job:", error);
        // alert("Failed to cancel the job. Please try again.");
        toast.error("kindly recheck the Form");
      }
    }
  };

  // Handler for pagination button clicks
  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate an array of page numbers for pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
       
     <NavLink
            to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
            className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 bg-blue-950 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-white mr-2" />
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </NavLink>
      <div className="grid-col-4">
        <div className="w-full lg:w-10/12 xl:w-9/12 mx-auto mt-7 bg-white rounded-md border border-black/90 shadow-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AiTwotoneHome size={20} className="mr-2" />
              <h1 className="text-lg font-bold">Careers Masters</h1>
            </div>
            <div className="flex gap-3 items-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Export to Excel
              </button>
              {userRole === "ROLE_ADMIN" && (
              <button
                onClick={handleAddClick}
                className="w-[73px] h-[36px] rounded-[6px] bg-[#003179] text-white"
              >
                Add 
              </button>
                )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-10/12 xl:w-9/12 mx-auto mt-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {careers.length === 0 ? (
            // No Jobs Found Message
            <p className="text-center col-span-full">No job posts available.</p>
          ) : (
            careers.map((career, index) => (
              <div
                key={career.jobId} // Use unique identifier for key
                className={`p-6 bg-white rounded-lg shadow-md border cursor-pointer transition-all duration-300 ease-in-out 
                  ${expandedCardIndex === index ? "h-auto" : "h-40 overflow-hidden"}`}
                onClick={() => toggleExpandCard(index)} // Handle card click
              >
                <h2 className="text-lg font-bold">{career.jobTitle}</h2>
                <p className="text-base font-bold pb-2">
                  Published Date:
                  <span className="text-xs text-gray-700 mb-2 pl-2">
                    {career.publishDate}
                  </span>
                </p>
                <p className="text-sm font-bold">
                  Expired Date:
                  <span className="text-xs text-gray-700 pl-3">
                    {career.expiryDate}
                  </span>
                </p>

                {expandedCardIndex === index && career.jobLocation && (
  <p className="text-base font-bold mb-2">
    Location:
    <span className="text-xs text-gray-700 pl-3">
      {career.jobLocation}
    </span>
  </p>
)}


                <p className="text-base font-bold mt-5">
                  Status: {career.status}
                </p>

                {expandedCardIndex === index && (
                  <>
                  {expandedCardIndex === index && career.workMode && (
  <p className="text-sm font-bold">
    Work Mode:
    <span className="text-xs text-gray-700 pl-3">
      {career.workMode}
    </span>
  </p>
)}

{expandedCardIndex === index && career.noOfRequirements && (
  <p className="text-sm font-bold">
    Requirements:
    <span className="text-xs text-gray-700 pl-3">
      {career.noOfRequirements}
    </span>
  </p>
)}

{expandedCardIndex === index && (career.numberOfYears || career.numberOfYears === 0) && (
  <p className="text-sm font-bold">
    Experience:
    <span className="text-xs text-gray-700 pl-3">
      {career.numberOfYears} Years and {career.numberOfMonths} Months
    </span>
  </p>
)}

{expandedCardIndex === index && (career.salaryFrom || career.salaryFrom === 0) && (career.salaryTo || career.salaryTo === 0) && (
  <p className="text-sm font-bold">
    Salary:
    <span className="text-xs text-gray-700 pl-4">
      {career.salaryFrom} - {career.salaryTo}
    </span>
  </p>
)}



{expandedCardIndex === index && career.jobType && (
  <p className="text-sm font-bold">
    Role:
    <span className="text-xs text-gray-700 pl-3">
      {career.jobType}
    </span>
  </p>
)}

{expandedCardIndex === index && career.skillSet && (
  <p className="text-sm font-bold">
    Skill Set:
    <span className="text-xs text-gray-700 pl-3">
      {career.skillSet}
    </span>
  </p>
)}

{expandedCardIndex === index && career.age && (
  <p className="text-sm font-bold">
    Age:
    <span className="text-xs text-gray-700 pl-3">
      {career.age}
    </span>
  </p>
)}

{expandedCardIndex === index && career.jobDescription && (
  <p className="text-sm font-bold">
    Job Description:
    <span className="text-xs text-gray-700">
      {career.jobDescription}
    </span>
  </p>
)}


                    {userRole === "ROLE_ADMIN" && (
             <>
                    <div className="flex justify-end mt-4">
                    
                        <button
                        className="px-4 py-2 mr-2 bg-white text-black border border-[#003179] rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleDeleteClick(career);
                        }}>
                        Delete
                      </button>                 
                       <button
                       className="px-4 py-2 bg-[#003179] text-white rounded-lg"
                       onClick={(e) => {
                         e.stopPropagation(); // Prevent card click
                         handleEditClick(career);
                       }}>
                       Edit
                     </button>            
                               
                    </div> 
                     </>
                     )}
                     {userRole === "ROLE_ADMIN" && (
                    <div className="mt-4">
                      <button
                        className={`px-4 py-2 mt-2 w-full ${career.status.toLowerCase() === "cancelled"
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-red-600 text-white rounded-lg hover:bg-red-700"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          if (career.status.toLowerCase() !== "cancelled") {
                            handleCancelJob(career);
                          }
                        }}
                        disabled={career.status.toLowerCase() === "cancelled"}
                      >
                        {career.status.toLowerCase() === "cancelled"
                          ? "Job Cancelled"
                          : "Cancel This Job"}
                      </button>
                    </div>
                         )}
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageClick(number)}
                className={`px-4 py-2 mx-1 rounded-lg ${currentPage === number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EditCareerPopup
          onSave={handleSaveCareer}
          onClose={handleCloseModal}
          career={selectedCareer}
        />
      )}
    </>
  );
}

export default Career;
