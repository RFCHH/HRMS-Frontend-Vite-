import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { FaLessThan } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';

const InterviewTable = () => {
  const [activePage,] = useState("interviewDetails");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [newInterview, setNewInterview] = useState({
    fullName: "", emailId: "", mobileNumber: "", countryCode: "", roleApplied: "", location: "", interviewDate: "", interviewerId: "", interViewerEmailId: "", modeOfInterview: "", interviewStatus: "", comments: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const userRole = localStorage.getItem("UserRole");

  useEffect(() => {
    fetchAllInterviews();
  }, [currentPage]);

  const fetchAllInterviews = async () => {
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/interview/getAllInterviewDetails?pageNumber=${currentPage}&size=40`
      );
      setInterviews(response.data || []);
      toast.success("Data loaded successfully!");
    } catch (error) {
      console.error('Error fetching all interviews:', error);
      setInterviews([]);
      toast.error("kindly recheck the Form");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInterview({ ...newInterview, [name]: value });
  };

  const validateFields = () => {
    const { fullName, emailId, mobileNumber, roleApplied, location, interviewerId, interViewerEmailId, countryCode } = newInterview;
    let errorObj = {};
    if (!fullName) {
      errorObj.fullName = "Name is required.";
    } else if (fullName.length < 3 || fullName.length > 40) {
      errorObj.fullName = "Name should be between 3 and 40 characters.";
    } else if (/^\s/.test(fullName)) {
      errorObj.fullName = "Name should not start with a space.";
    } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
      errorObj.fullName = "Name should contain only alphabets and spaces.";
    }
    const emailPattern = /^(?!\d)[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@(gmail|yahoo|outlook|hotmail|example|sai)\.(com|net|org|in|edu|gov|mil|us|info|org\.in)$/;
    if (!emailId || !interViewerEmailId) {
      errorObj.emailId = "Both email fields are required.";
    } else if (!emailPattern.test(emailId) || !emailPattern.test(interViewerEmailId)) {
      errorObj.emailId = "Invalid email format.";
    }
    if (!mobileNumber) {
      errorObj.mobileNumber = "Phone number is required.";
    } else if (!/^[1-9]\d{9}$/.test(mobileNumber)) {
      errorObj.mobileNumber = "Phone number must not start with 0 and be exactly 10 digits.";
    }
    if (!interviewerId) {
      errorObj.interviewerId = "Interviewer ID is required.";
    } else if (!/^[a-zA-Z0-9@.]+$/.test(interviewerId)) {
      errorObj.interviewerId = "Invalid Interviewer ID.";
    }
    if (!roleApplied) {
      errorObj.roleApplied = "Role applied is required.";
    }
    if (!location) {
      errorObj.location = "Location is required.";
    }
    if (!countryCode) {
      errorObj.countryCode = "Country code is required.";
    }
    setErrors(errorObj);
    return Object.keys(errorObj).length === 0;
  };

  const handleInterviewSubmit = async () => {
    if (validateFields()) {
      try {
        const response = await axiosInstance.post(
          `hrmsapplication/interview/create`,
          newInterview,
        );

        if (response.status === 200) {
          console.log('Interview submitted successfully:', response.data);
          setInterviews((prevInterviews) => [
            ...prevInterviews,
            { ...newInterview, interviewId: response.data.interviewId }
          ]);
          setCurrentPage(0);
          fetchAllInterviews();
          resetForm();
          setShowModal(false);
          toast.success("Data loaded successfully!");
        } else {
          console.error('Unexpected response:', response);
          setErrors({ apiError: 'Failed to add interview. Please try again later.' });
          toast.error("kindly recheck the Form");
        }
      } catch (error) {
        console.error('Error adding interview:', error);
        setErrors({ apiError: error.response?.data?.message || 'Failed to add interview.' });
        let errorMessage = "Failed to add the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        toast.error(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setNewInterview({
      fullName: "", emailId: "", mobileNumber: "", countryCode: "", roleApplied: "", location: "", interviewDate: "", interviewerId: "", interViewerEmailId: "", modeOfInterview: "", interviewStatus: "", comments: "",
    });
    setErrors({});
  };

  const handleEditClick = (interview) => {
    setNewInterview(interview);
    setShowModal(true);
  };
  const fetchInterviewerEmail = async (interviewerId) => {
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/employee/getEmployeeEmail/${interviewerId}`
      );

      if (response.status === 200 && response.data) {
        setNewInterview((prev) => ({
          ...prev,
          interViewerEmailId: response.data,
        }));
      } else {
        toast.error("Error fetching Interviewer's email!");
      }
    } catch (error) {
      console.error('Error fetching interviewer email:', error);
      toast.error("Failed to fetch Interviewer's email. Please try again.");
    }
  };


  const handleDeleteClick = async (id) => {
    try {
      const response = await axiosInstance.delete(`hrmsapplication/interview/deleteInterview/${id}`);
      if (response.status === 200) {
        toast.success("Interview deleted successfully!");
        fetchAllInterviews();
      } else {
        toast.error("Error deleting interview!");
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      let errorMessage = "Failed to add the job. Please try again.";
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

  const handleUpdateInterview = async () => {
    if (validateFields()) {
      try {
        const response = await axiosInstance.patch(
          'hrmsapplication/interview/update',
          newInterview
        );

        if (response.status === 200) {
          toast.success("Interview updated successfully!");
          fetchAllInterviews();
          resetForm();
          setShowModal(false);
        } else {
          toast.error("Error updating interview!");
        }
      } catch (error) {
        console.error('Error updating interview:', error);
        let errorMessage = "Failed to add the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        toast.error(errorMessage);
      }
    }
  };

  const filteredInterviews = interviews.filter((interview) =>
    interview.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <NavLink
          to={userRole === 'ROLE_ADMIN' ? '/admindashboard' : '/userdashboard'}
          className="flex items-center justify-start p-2 overflow-x-auto  bg-blue-950 border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-white mr-2" />
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </NavLink>

        <div className="p-4">
          {activePage === "interviewDetails" && (
            <div className="container mx-auto">
              {/* Search Bar and Add Button */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="relative w-full md:w-1/3 mb-2 md:mb-0">
                  <input
                    type="text"
                    className="p-2 pl-10 pr-4 border border-gray-300 rounded w-full"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* Search Icon */}
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FiSearch className="w-5 h-5" />
                  </div>
                </div>

                <button
                  className="p-2 bg-blue-500 text-white rounded md:w-auto md:ml-4 md:self-auto self-end"
                  onClick={() => setShowModal(true)}
                >
                  + Add
                </button>
              </div>

              {/* Table with Horizontal Scroll */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border-2 border-black">
                  {/* Table Head */}
                  <thead>
                    <tr className="bg-gray-200  border-black border-b ">
                      {[
                        "Full Name",
                        "EmailId",
                        "Role Applied",
                        "Interview Date",
                        "Interviewer Id",
                        "Mode of Interview",
                        "Interview Status",
                        "Actions",
                      ].map((header, idx) => (
                        <th
                          key={idx}
                          className="text-left py-2 px-4 border-black border-r last:border-r-0"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInterviews.map((interview) => (
                      <tr key={interview.id} className="border-b border-black">
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.fullName}</td>
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.emailId}</td>
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.roleApplied}</td>
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.interviewDate}</td>
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.interviewerId}</td>
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.modeOfInterview}</td>
                        <td className="py-2 px-4 border-black border-r last:border-r-0">{interview.interviewStatus}</td>
                        <td className="py-2 px-4">
                          <div className="flex justify-center space-x-4">
                            <TiPencil
                              onClick={() => handleEditClick(interview)}
                              className="cursor-pointer text-lg text-blue-500"
                            />
                            <RiDeleteBin6Line
                              onClick={() => handleDeleteClick(interview.id)}
                              className="cursor-pointer text-lg text-red-500"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl mb-4">{newInterview.id ? "Edit Interview" : "Add Interview"}</h2>
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-9">
                  <div>
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newInterview.fullName}
                      min={3}
                      max={40}
                      onChange={handleInputChange}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.fullName ? "border-red-500" : ""}`}
                    />
                    {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label>Email Id</label>
                    <input
                      type="email"
                      name="emailId"
                      value={newInterview.emailId}
                      min={6}
                      max={40}
                      onChange={handleInputChange}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.emailId ? "border-red-500" : ""}`}
                    />
                    {errors.emailId && <p className="text-red-500">{errors.emailId}</p>}
                  </div>

                  <div>
                    <label>Country Code</label>
                    <select
                      name="countryCode"
                      value={newInterview.countryCode}
                      max={10}
                      onChange={handleInputChange}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.countryCode ? "border-red-500" : ""}`}>
                      <option value="">select code</option>
                      <option value="+91">+91 (INDIA)</option>
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
                    {errors.countryCode && <p className="text-red-500">{errors.countryCode}</p>}
                  </div>
                  <div>
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={newInterview.mobileNumber}
                      max={10}
                      onChange={handleInputChange}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.mobileNumber ? "border-red-500" : ""}`}
                    />
                    {errors.mobileNumber && <p className="text-red-500">{errors.mobileNumber}</p>}
                  </div>
                  <div>
                    <label>Role Applied</label>
                    <input
                      type="text"
                      name="roleApplied"
                      value={newInterview.roleApplied}
                      onChange={handleInputChange}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.roleApplied ? "border-red-500" : ""}`}
                    />
                    {errors.roleApplied && <p className="text-red-500">{errors.roleApplied}</p>}
                  </div>
                  <div>
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newInterview.location}
                      onChange={handleInputChange}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.location ? "border-red-500" : ""}`}
                    />
                    {errors.location && <p className="text-red-500">{errors.location}</p>}
                  </div>
                  <div>
                    <label>Interview Date</label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={newInterview.interviewDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label>Interviewer ID</label>
                    <input
                      type="text"
                      name="interviewerId"
                      value={newInterview.interviewerId}
                      onChange={handleInputChange}
                      onBlur={() => {
                        if (newInterview.interviewerId) {
                          fetchInterviewerEmail(newInterview.interviewerId);
                        }
                      }}
                      className={`border border-gray-300 rounded p-2 w-full ${errors.interviewerId ? "border-red-500" : ""}`}
                    />
                    {errors.interviewerId && <p className="text-red-500">{errors.interviewerId}</p>}
                  </div>

                  <div>
                    <label>Interviewer Email ID</label>
                    <input
                      type="email"
                      name="interViewerEmailId"
                      value={newInterview.interViewerEmailId}
                      readOnly
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                    {errors.interViewerEmailId && <p className="text-red-500">{errors.interViewerEmailId}</p>}
                  </div>
                  <div>
                    <label>Mode of Interview</label>
                    <select
                      name="modeOfInterview"
                      value={newInterview.modeOfInterview}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value="">select</option>
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                  <div>
                    <label>Interview Status</label>
                    <select
                      name="interviewStatus"
                      value={newInterview.interviewStatus}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value="">select</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="DISQUALIFIED">DISQUALIFIED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="RESCHEDULED">RESCHEDULED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div>
                    <label>Comments</label>
                    <textarea
                      name="comments"
                      value={newInterview.comments}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>
                </div>
              </form>
              <div className="flex justify-end">
                <button className="mr-2 bg-gray-400 text-white p-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="bg-blue-500 text-white p-2 rounded" onClick={newInterview.id ? handleUpdateInterview : handleInterviewSubmit}>
                  {newInterview.id ? "Update Interview" : "Add Interview"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default InterviewTable;
