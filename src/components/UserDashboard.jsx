import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";
import {
  FaUser,
  FaClipboardCheck,
  FaCalendarAlt,
  FaChartLine,
  FaFileAlt,
  FaSuitcase,
  FaClipboard,
  FaCalendar,
  FaTrophy,
  FaSitemap,
  FaMoneyBill,
  FaSignInAlt,
  FaCheckSquare,
  FaProjectDiagram,
  FaMedal,
  FaIdBadge,
  FaUserCheck,
} from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { HiMiniNewspaper } from "react-icons/hi2";
import { useState, useEffect } from "react"; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("EmpId");
  const userRole = localStorage.getItem("UserRole");
  const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
  const ROLE_ADMIN = "ROLE_ADMIN";
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState({ firstname: "", lastname: "",});



  useEffect(() => {
    const hours = new Date().getHours();

    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/employee/getEmployeeProfile/${employeeId}`
      );
      const data = response.data;
      console.log(data);
      

      setName({
        firstname: data.firstname,
        lastname: data.lastname
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employeeId]);
  const handleCardClick = (title) => {
    switch (title) {
      case "My Projects":
        if (userRole === ROLE_EMPLOYEE) {
          navigate("/Assignments");
        } else {
          navigate("/projects");
        }
        break;
      case "Holidays":
        navigate("/holidays");
        break;
      case "Attendance":
        navigate(`/attendenceSheet/${employeeId}`);
        break;
      case "Careers":
        navigate(`/careers`);
        break;
      case "Associate 360":
        navigate("/associate360");
        break;
      // case "MyPay":
      //   navigate(`/payrolluser/${employeeId}`);
      //   break;
        case "MyPay":
          if (userRole === ROLE_ADMIN) {
            navigate(`/payrollSection/${employeeId}`);
          } else {
            navigate(`/payrolluser/${employeeId}`);
          }
          break;

      case "On Boarding":
        navigate("/onboardingDocuments");
        break;
      case "Assignments":
        navigate("/Assignments");
        break;
      case "Approvals":
        navigate("/ApprovalMaster");
        break;
      case "Employee Profile":
        navigate(`/dashboard/${employeeId}`);
        break;
      case "Employee ID":
        navigate(`/EmployeeId/${employeeId}`);
        break;
        case "Timesheet":
          navigate(`/entrypage/${employeeId}`);
          break;
      case "Leave Balance":
        navigate("/LeaveRequest");
        break;
      case "Organisation Chart":
        navigate(`/Organization/${employeeId}`);
        break;

      case "Employee Performance":
        navigate(`/Deliverables/${employeeId}`);

        break;
      case "Interview":
        navigate("/interviewtable");
        break;
      case "Exams":
        navigate(`/selfexam/${employeeId}`);
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { title: "Employee Profile", icon: <FaUser /> },
    { title: "Employee ID", icon: <FaIdBadge /> },
    { title: "Attendance", icon: <FaCheckSquare /> },
    { title: "Employee Performance", icon: <FaTrophy /> },
    { title: "Leave Balance", icon: <FaFileAlt /> },
    ...(userRole !== "ROLE_EMPLOYEE"
      ? [{ title: "My Projects", icon: <FaClipboardCheck /> }]
      : []),
    { title: "Timesheet", icon: <FaFileAlt /> },
    { title: "Holidays", icon: <FaCalendarAlt /> },   
    { title: "Careers", icon: <FaChartLine /> },
    { title: "Associate 360", icon: <FaMedal /> },
    { title: "MyPay", icon: <FaMoneyBill /> },
    ...(userRole === "ROLE_HR"
      ? [{ title: "On Boarding", icon: <FaSignInAlt /> }]
      : []),
   
    { title: "Organisation Chart", icon: <FaSitemap /> },
    
    { title: "Approvals", icon: <FaCircleCheck /> },
    { title: "Assignments", icon: <FaClipboardCheck /> },
    ...(userRole !== "ROLE_EMPLOYEE" && userRole !== "ROLE_MANAGER"
      ? [{ title: "Interview", icon: <FaUserCheck /> }]
      : []),
      { title: "Exams", icon: <HiMiniNewspaper /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
  <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">Welcome, Have A Good Day!</h1>
        <p className="text-base sm:text-lg text-gray-700">{name.firstname} {name.lastname}</p>
      </div>
    </div>

    <div className="p-20 sm:p-40 bg-gradient-to-r from-blue-400 to-purple-400 text-4xl sm:text-7xl font-cursive font-extrabold text-center text-white shadow-xl rounded-lg mb-4 sm:mb-6">
      {greeting}
    </div>

    <div className="mb-4">
      {/* This section is intentionally left commented */}
    </div>

    <hr className="my-6 sm:my-8 border-t border-gray-300" />

    <div className="mb-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-6 sm:mb-9 text-center">
        Quick Masters
      </h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-6 md:gap-8 lg:gap-10">
          {menuItems.map((menuItem) => (
            <MenuCard
              key={menuItem.title}
              title={menuItem.title}
              icon={menuItem.icon}
              onClick={() => handleCardClick(menuItem.title)}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

const MenuCard = ({ title, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white text-gray-800 p-3 w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] h-[80px] rounded-lg shadow-md flex flex-col items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 hover:text-white hover:bg-gradient-to-r from-blue-400 to-blue-400"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <h2 className="text-sm font-semibold text-center">{title}</h2>
    </div>
  );
};

MenuCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UserDashboard;


// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
//   import {
//     FaUser,
//     FaClipboardCheck,
//     FaCalendarAlt,
//     FaCheckSquare,
//     FaChartLine,
//     FaFileAlt,
//     FaMedal,
//     FaMoneyBill,
//     FaSitemap,
//     FaSignInAlt,
//     FaUserCheck,
//     FaTrophy,
//       } from "react-icons/fa";
//   import { FaCircleCheck } from "react-icons/fa6";
// import videoMorning from "../components/Videos/morning.mp4"; // Video for morning
// // import videoAfternoon from "./videos/afternoon.mp4"; // Video for afternoon
// // import videoEvening from "../components/Videos/motivation2.mp4"; // Video for evening

// // Main UserDashboard Component
// const UserDashboard = () => {
//   const [greeting, setGreeting] = useState("Good Morning");
//   const [videoSource, setVideoSource] = useState(videoMorning);

//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("EmpId");
//   const userRole = localStorage.getItem("UserRole");

//   // Time-based greeting logic with background video
//   useEffect(() => {
//     const hours = new Date().getHours();
//     if (hours >= 5 && hours < 12) {
//       setGreeting("Good Morning");
//       setVideoSource(videoMorning);
//     } else if (hours >= 12 && hours < 18) {
//       setGreeting("Good Afternoon");
//       setVideoSource();
//     } else {
//       setGreeting("Good Evening");
//       setVideoSource();
//     }
//   }, []);
// const ROLE_EMPLOYEE = "ROLE_EMPLOYEE"
//   // Handling card clicks to navigate to different sections
//   const handleCardClick = (title) => {
//     switch (title) {
//       case "My Projects":
//         if (userRole === ROLE_EMPLOYEE) {
//           navigate("/Assignments");
//         } else {
//           navigate("/projects");
//         }
//         break;
//       case "Holidays":
//         navigate("/holidays");
//         break;
//       case "Attendance":
//         navigate(`/attendenceSheet/${employeeId}`);
//         break;
//       case "Careers":
//         navigate(`/careers`);
//         break;
//       case "Associate 360":
//         navigate("/associate360");
//         break;
//       case "MyPay":
//         navigate(`/payrollSection/${employeeId}`);
//         break;
//       case "On Boarding":
//         navigate("/onboardingDocuments");
//         break;
//       case "Assignments":
//         navigate("/Assignments");
//         break;
//       case "Approvals":
//         navigate("/ApprovalMaster");
//         break;
//       case "Employee Profile":
//         navigate(`/dashboard/${employeeId}`);
//         break;
//       case "Employee ID":
//         navigate(`/EmployeeId/${employeeId}`);
//         break;
//         case "Timesheet":
//           navigate("/to");
//           break;
//       case "Leave Balance":
//         navigate("/LeaveRequest");
//         break;
//       case "Organisation Chart":
//         navigate(`/Organization/${employeeId}`);
//         break;

//       case "Employee Performance":
//         navigate(`/Deliverables/${employeeId}`);

//         break;
//       case "Interview":
//         navigate("/interviewtable");
//         break;
//       default:
//         break;
//     }
//   };

//   // List of menu items to display on the dashboard
//   const menuItems = [
//     ...(userRole !== "ROLE_EMPLOYEE"
//       ? [{ title: "My Projects", icon: <FaClipboardCheck /> }]
//       : []),
//     { title: "Timesheet", icon: <FaFileAlt /> },
//     { title: "Holidays", icon: <FaCalendarAlt /> },
//     { title: "Attendance", icon: <FaCheckSquare /> },
//     { title: "Careers", icon: <FaChartLine /> },
//     { title: "Associate 360", icon: <FaMedal /> },
//     { title: "MyPay", icon: <FaMoneyBill /> },
//   ...(userRole === "ROLE_HR"
//       ? [{ title: "On Boarding", icon: <FaSignInAlt /> }]
//       : []),
//   // { title: "On Boarding", icon: <FaSignInAlt /> },
//     { title: "Leave Balance", icon: <FaFileAlt /> },
//     { title: "Organisation Chart", icon: <FaSitemap /> },
//     { title: "Employee Performance", icon: <FaTrophy /> },
//     { title: "Employee Profile", icon: <FaUser /> },
//     { title: "Employee ID", icon: < FaUser/> },
//     { title: "Approvals", icon: <FaCircleCheck /> },
//     { title: "Assignments", icon: <FaClipboardCheck /> },
//     ...(userRole !== "ROLE_EMPLOYEE" && userRole !== "ROLE_MANAGER"
//       ? [{ title: "Interview", icon: <FaUserCheck /> }]
//       : []),
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header Section with Time-Based Greeting and Video Background */}
//       <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
         
//         <video
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           autoPlay
//           loop
//           muted
//           src={videoSource}
//         />
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>
//         <div className="relative z-10 flex justify-center items-center h-full">
//           <h1 className="text-5xl font-bold text-white">{greeting}</h1>
//         </div>
        
//       </div>
//       <div className="mt-9">
//           <h2 className="text-lg font-semibold text-gray-700 mb-2">
//             Quick Masters
//           </h2>
//         </div>

//       {/* Grid of Menu Cards */}
//       <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//         {menuItems.map((menuItem) => (
//           <MenuCard
//             key={menuItem.title}
//             title={menuItem.title}
//             icon={menuItem.icon}
//             onClick={() => handleCardClick(menuItem.title)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // MenuCard Component
// const MenuCard = ({ title, icon, onClick }) => (
//   <div
//     onClick={onClick}
//     className="bg-white text-gray-800 p-3 rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer"
//   >
//     <div className="text-2xl mb-1">{icon}</div>
//     <h2 className="text-sm font-semibold text-center">{title}</h2>
//   </div>
// );

// // PropTypes to ensure correct props are passed
// MenuCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   icon: PropTypes.element.isRequired,
//   onClick: PropTypes.func.isRequired,
// };

// export default UserDashboard;
