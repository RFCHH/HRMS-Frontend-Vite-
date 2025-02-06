import React, { useEffect, useState } from "react";
// import { EmployeeContext } from "./EmployeeProvider";
import { SlEnvolope } from "react-icons/sl";
import { IoNotifications, IoLogOutOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom"; 
import { IoPersonSharp, IoLocationOutline } from "react-icons/io5";
import { MdAssignment,MdSubtitles  } from "react-icons/md"
import { TiGroup } from "react-icons/ti";
import { TbTriangleSquareCircleFilled } from "react-icons/tb";
import { FaRegIdCard, FaBookReader ,FaCalendar,FaBalanceScaleRight,FaChartLine,FaProjectDiagram} from "react-icons/fa";
import { FcLeave ,FcApproval} from "react-icons/fc";
import { GoPaste,GoOrganization  } from "react-icons/go";
import { GiReceiveMoney,GiFamilyTree } from "react-icons/gi";
import { SiGooglesheets } from "react-icons/si";
import { CgAttachment } from "react-icons/cg";
import { PiSuitcaseSimpleFill, PiAirplaneTiltFill,PiExamFill   } from "react-icons/pi";
import DialogueBox from "../components/uploadDoc/DocumentUpload";
import axiosInstance from "./axiosConfig";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [isEnvelopeOpen, setEnvelopeOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [isDialogueBoxOpen, setIsDialogueBoxOpen] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const organizationId = localStorage.getItem("organizationId");
  const [envelopeClosed, setEnvelopeClosed] = useState(false);
  const [notificationClosed, setNotificationClosed] = useState(false);
  
  const toggleEnvelope = () => {
    setEnvelopeOpen(!isEnvelopeOpen);
    setEnvelopeClosed(false);  // Reset flag when toggling
    setTimeout(() => {
      setEnvelopeClosed(true); // Set flag after 3 seconds to allow closing
    }, 3000);
  };

  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
    setNotificationClosed(false); // Reset flag when toggling
    setTimeout(() => {
      setNotificationClosed(true); // Set flag after 3 seconds to allow closing
    }, 3000);
  };

  const employeeId = localStorage.getItem("EmpId") || sessionStorage.getItem("EmpId");

  const handleLogout = async () => {
    const logoutUrl = `hrmsapplication/authentication/logout?employeeid=${employeeId}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axiosInstance.post(logoutUrl, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem("Token");
        localStorage.removeItem("EmpId");
        localStorage.removeItem("UserRole");
        localStorage.removeItem("organizationId");
        sessionStorage.removeItem("Token");
        sessionStorage.removeItem("EmpId");
        sessionStorage.removeItem("UserRole");
        navigate("/");
      } else {
        console.error("Failed to log out:", response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getTitleAndIcon = (pathname) => {
    if (pathname.startsWith("/personalDetails")) {
      return {
        title: "Profile",
        icon: <IoPersonSharp  className=" text-white" size={24} />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } else if (pathname.startsWith("/Travel")) {
      return {
        title: "Travel Details",
        icon: <PiAirplaneTiltFill  className=" text-white"size={24} />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/educationDetails") ) {
      return {
        title: "Education Details",
        icon: <FaBookReader  className="text-white" size={24} />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/current") ) {
      return {
        title: "Current Experience Details",
        icon: <PiSuitcaseSimpleFill className="text-white" size={24} />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/familyDetails") ) {
      return {
        title: "Family Details",
        icon: <TiGroup size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/experience") ) {
      return {
        title: "Experience Details",
        icon: <PiSuitcaseSimpleFill size={24}  className="text-white"/>,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if(pathname.startsWith("/location") ) {
      return {
        title: "Address Details",
        icon: <IoLocationOutline size={24}  className="text-white"/>,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/National") ) {
      return {
        title: "National Details",
        icon: <FaRegIdCard size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/allEmployee")) {
      return {
        title: "All Employees",
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    
    } else if (pathname.startsWith("/employeePerformance")) {
      return {
        title: "All-Employees-Performance",
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } else if (pathname.startsWith("/Deliverables")) {
      return {
        title: "All Deliverables",
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } else if (pathname.startsWith("/associate360")) {
      return {
        title: "Associate 360",
        icon: <TbTriangleSquareCircleFilled size={24}  className="text-white"/>,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    
    } else if (pathname.startsWith("/holidays")) {
      return {
        title: "Holiday-List",
        icon: <FaCalendar size={24}  className="text-white"/>,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    
    } else if (pathname.startsWith("/careers")) {
      return {
        title: "Careers",
        icon: <FaChartLine size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } else if (pathname.startsWith("/attendenceSheet")) {
      return {
        title: "Attendance Sheet",
        icon: <FaRegIdCard size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    }
    else if (pathname.startsWith("/EmployeeId")) {
      return {
        title: "EmployeeId",
        icon: <FaRegIdCard size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } else if (pathname.startsWith("/Assignments")) {
      return {
        title: "Assignments",
        icon: <FaRegIdCard size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/ApprovalMaster")) {
      return {
        title: "Approval Master",
        icon: <FcApproval size={24}  className="text-white"/>,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 

    else if (pathname.startsWith("/interviewtable")) {
      return {
        title: "Interviews Section",
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/Organization")) {
      return {
        title: "Organization",
        icon: <GiFamilyTree size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/LeaveRequest")) {
      return {
        title: "Leave Request",
        icon: <GoPaste size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } 
    else if (pathname.startsWith("/payrolluser")) {
      return {
        title: "Payroll User",
        icon: <GiReceiveMoney size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/LeaveForm")) {
      return {
        title: "Leave Form", 
        icon: <FcLeave className="text-white" size={24} />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } 
    else if (pathname.startsWith("/LeaveBalance")) {
      return {
        title: "Leave Balance",
        icon: <FaBalanceScaleRight size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",

      };
    } 
    else if (pathname.startsWith("/onboardingDocument")) {
      return {
        title: "Documents",  
        icon: <CgAttachment size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/Projects")) {
      return {
        title: "Projects", 
        icon: <FaProjectDiagram size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
        
      };
    } 
    else if (pathname.startsWith("/Assignment")) {
      return {
        title: "Assignments",
        icon: <MdAssignment size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/payrollSection")) {
      return {
        title: "Payroll Sections",       
        icon: <GiReceiveMoney size={24} className="text-white" />,
        bgColor: "bg-blue-950",
        textColor: "white",
      };
    } 
    else if (pathname.startsWith("/admindashboard")) {
      return{
      title:"Admin Dashboard",
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/createorganization")) {
      return{
      title:"Organisation Section",
      icon: <GoOrganization  size={24} className="text-white" />,
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/designations")) {
      return{
      title:"Designations Section",
      icon: <MdSubtitles  size={24} className="text-white" />,
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/department")) {
      return{
      title:"Department Section",
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/projects")) {
      return{
      title:"Assignment Section",
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/createexam")) {
      return{
      title:"Exam Section",
      icon: <PiExamFill size={24} className="text-white" />,
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/selfexam")) {
      return{
      title:"Exam Section",
      icon: <PiExamFill size={24} className="text-white" />,
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
    else if (pathname.startsWith("/entrypage")) {
      return{
      title:"Timesheet",
      icon: <SiGooglesheets size={24} className="text-white" />,
      bgColor: "bg-blue-950",
      textColor: "white",
      };
    }
     else {
      return { title: "Dashboard" ,
        bgColor: "bg-blue-950",
      textColor: "white"
      };
    }
  };

  useEffect(() => {
    const fetchIdCardImage = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/documents/id-card-pic?organizationId=${organizationId}&employeeId=${employeeId}`
        );
        setImage(response.data); 
      } catch (error) {
        console.error("Error fetching ID card image:", error);
      }
    };
    fetchIdCardImage();
  }, [employeeId, organizationId]);

  // Get title and icon based on the current path
  const { title, icon, bgColor, textColor } = getTitleAndIcon(location.pathname);
  
  const onFileUploadSuccesfull = (data) => {
    setImage(data);
  };

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
    <div className={`flex justify-between items-center p-2 ${bgColor} shadow-md`}>
  {/* Left Section - Logo */}
  <div className="flex items-center">
    <img src="/rfchh.jpg" alt="Logo" className="h-11 w-12 object-cover rounded-xl" />
  </div>

  {/* Center Section - Title with Icon */}
  <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
    {icon}
    <h1 className={`text-base sm:text-lg md:text-xl font-bold ${textColor === "white" ? "text-white" : "text-black"}`}>
      {title}
    </h1>
  </div>

  {/* Right Section - Icons and Profile */}
  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
    <i onClick={toggleEnvelope} className={`cursor-pointer ${textColor === "white" ? "text-white" : "text-black"}`}>
      <SlEnvolope size={20} />
    </i>
    <i onClick={toggleNotification} className={`cursor-pointer ${textColor === "white" ? "text-white" : "text-black"}`}>
      <IoNotifications size={20} />
    </i>
    <div className="flex items-center space-x-2" onClick={handleOpenDialogueBox}>
      <img src={image || "/rfchh.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
      <span className={`text-sm sm:text-lg font-bold ${textColor === "white" ? "text-white" : "text-black"}`}>
        {employeeId || "Guest"}
      </span>
    </div>
    <i onClick={handleLogout} className={`cursor-pointer ${textColor === "white" ? "text-white" : "text-black"}`}>
      <IoLogOutOutline size={24} title="Logout" />
    </i>
  </div>

  {isEnvelopeOpen && !envelopeClosed && (
    <div className="absolute top-14 right-28 bg-white p-4 shadow-lg rounded-md z-10">
      <p>No new messages</p>
    </div>
  )}

  {isNotificationOpen && !notificationClosed && (
    <div className="absolute top-14 right-8 bg-white p-4 shadow-lg rounded-md z-10">
      <p>No new notifications</p>
    </div>
  )}

  {isDialogueBoxOpen && (
    <DialogueBox
      onClose={handleCloseDialogueBox}
      onSubmit={handleDialogueBoxSubmit}
      category="ID_CARD"
      employeeId={employeeId}
      outevent={onFileUploadSuccesfull}
    />
  )}
</div>
</>
  );
};

export default Navbar;
