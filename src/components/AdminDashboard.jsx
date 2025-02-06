// import PropTypes from 'prop-types'; 
// import { useNavigate } from 'react-router-dom';
// import {
//   FaUser,
//   FaFileAlt,
//   FaSuitcase,
//   FaChartLine,
//   FaClipboard,
//   FaCalendar,
//   FaSitemap,
//   FaUserCheck
// } from 'react-icons/fa';
// import { useState, useEffect } from 'react';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [greeting, setGreeting] = useState('');

//   const handleCreateDesignation = () => {
//     navigate('/designations');
//   };
//   const handleCreateOrganization = () => {
//     navigate('/createorganization');
//   };

//   const handleDepartment = () => {
//     navigate('/department');
//   };

//   const employeeId = localStorage.getItem('EmpId');

//   const handleCardClick = (title) => {
//     if (title === 'Profile') navigate('/allEmployee');
//     if (title === 'Approvals') navigate('/approvals');
//     if (title === 'Leaves') navigate('/LeaveForm');
//     if (title === 'Attendance') navigate('/attendenceSheet');
//     if (title === 'OnBoarding') navigate('/onboardingDocuments');
//     if (title === 'Careers') navigate('/careers');
//     if (title === 'Assignment') navigate('/projects');
//     if (title === 'Holidays') navigate('/holidays');
//     if (title === 'Employee Performance') navigate('/employeePerformance');
//     if (title === 'Organisation Chart') navigate(`/Organization/${employeeId}`);
//     if (title === 'Interview') navigate('/interviewtable');  
//   };

//   // Function to determine the greeting based on time of day
//   const getGreeting = () => {
//     const hour = new Date().getHours();

//     if (hour < 12) {
//       return 'Good Morning';
//     } else if (hour < 18) {
//       return 'Good Afternoon';
//     } else {
//       return 'Good Evening';
//     }
//   };

//   useEffect(() => {
//     setGreeting(getGreeting());
//     // Update greeting every minute (60000 ms)
//     const interval = setInterval(() => {
//       setGreeting(getGreeting());
//     }, 60000);
    
//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">
//       <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
//           <div className="mb-4 md:mb-0">
//             <h1 className="text-lg md:text-xl font-bold">Welcome Admin!</h1>
//             <p className="text-sm text-gray-500">Dashboard</p>
//           </div>
//           <div className="flex space-x-2 md:space-x-4">
//             <button
//               className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm md:text-base"
//               onClick={handleCreateDesignation}
//             >
//               Set DesignationForm
//             </button>
//             <button
//               className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm md:text-base"
//               onClick={handleCreateOrganization}
//             >
//               Create Organization
//             </button>
//             <button
//               className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm md:text-base"
//               onClick={handleDepartment}
//             >
//               Department
//             </button>
//           </div>
//         </div>

//         <div className="p-10 md:p-40 bg-gradient-to-r from-blue-400 to-purple-400 text-2xl md:text-7xl font-extrabold font-cursive text-center text-white shadow-xl rounded-lg mb-4 md:mb-6">
//           {greeting}
//         </div>

//         <div className="mb-4">
//           <h2 className="text-md md:text-lg font-semibold text-gray-700 mb-2">Quick Masters</h2>

//           {/* Adjusted grid layout for responsiveness */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             <DashboardCard title="Profile" icon={<FaUser />} onClick={() => handleCardClick('Profile')} color="bg-white" />
//             <DashboardCard title="Leaves" icon={<FaFileAlt />} onClick={() => handleCardClick('Leaves')} color="bg-white" />
//             <DashboardCard title="On Boarding" icon={<FaSuitcase />} onClick={() => handleCardClick('OnBoarding')} color="bg-white" />
//             <DashboardCard title="Careers" icon={<FaChartLine />} onClick={() => handleCardClick('Careers')} color="bg-white" />
//             <DashboardCard title="Assignment" icon={<FaClipboard />} onClick={() => handleCardClick('Assignment')} color="bg-white" />
//             <DashboardCard title="Holidays" icon={<FaCalendar />} onClick={() => handleCardClick('Holidays')} color="bg-white" />
//             <DashboardCard title="Organisation Chart" icon={<FaSitemap />} onClick={() => handleCardClick('Organisation Chart')} color="bg-white" />
//             <DashboardCard title="Interview" icon={<FaUserCheck />} onClick={() => handleCardClick('Interview')} color="bg-white" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DashboardCard = ({ title, icon, color, onClick }) => {
//   return (
//     <div
//       className={`${color} text-white p-3 w-full h-[120px] rounded-lg shadow-md flex flex-col items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1`}
//       onClick={onClick}
//     >
//       <div className="text-3xl mb-2 text-black">{icon}</div>
//       <h2 className="text-sm text-black font-semibold text-center">{title}</h2>
//     </div>
//   );
// };

// DashboardCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   icon: PropTypes.element.isRequired,
//   color: PropTypes.string.isRequired,
//   onClick: PropTypes.func.isRequired,
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { FaUser, FaFileAlt, FaSuitcase, FaChartLine, FaClipboard, FaCalendar, FaSitemap, FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [thought, setThought] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const employeeId = localStorage.getItem('EmpId');

  // Thought list for different hours
  const thoughts = [
    "Believe in yourself and all that you are. 🌱",
    "The future belongs to those who believe in the beauty of their dreams. 💫",
    "Success is not the key to happiness. Happiness is the key to success. 🌟",
    "The only way to do great work is to love what you do. 💼",
    "Your limitation—it’s only your imagination. 🌈",
    "Push yourself, because no one else is going to do it for you. 🚀",
    "Great things never come from comfort zones. 💪",
    "Dream it. Wish it. Do it. ✨",
    "Success doesn’t just find you. You have to go out and get it. 🏆",
    "The harder you work for something, the greater you’ll feel when you achieve it. 🏅"
  ];

  useEffect(() => {
    // Set greeting based on time of the day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌞");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");

    // Update thought every hour
    const updateThought = () => {
      const hourOfDay = new Date().getHours();
      setThought(thoughts[hourOfDay % thoughts.length]);
    };

    // Call once initially
    updateThought();

    // Update thought every hour
    const intervalId = setInterval(updateThought, 3600000); // 3600000ms = 1 hour

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Updated quickActions with path information for navigation
  const quickActions = [
    { title: "Profile", icon: <FaUser />, bg: "bg-orange-200", path: "/allEmployee" },
    { title: "Leaves", icon: <FaFileAlt />, bg: "bg-green-200", path: "/LeaveForm" },
    { title: "On Boarding", icon: <FaSuitcase />, bg: "bg-yellow-200", path: "/onboardingDocuments" },
    { title: "Careers", icon: <FaChartLine />, bg: "bg-purple-200", path: "/careers" },
    { title: "Assignment", icon: <FaClipboard />, bg: "bg-red-200", path: "/projects" },
    { title: "Holidays", icon: <FaCalendar />, bg: "bg-pink-200", path: "/holidays" },
    // { title: "Organization Chart", icon: <FaSitemap />, bg: "bg-purple-200", path: `/Organization/${employeeId}` },
    { title: "Interviews", icon: <FaUserCheck />, bg: "bg-orange-200", path: "/interviewtable" },
  ];

  // Handle card click to navigate
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Handle button click for creating designation, department, and organization
  const handleCreateDesignation = () => {
    navigate("/designations");
  };

  const handleCreateDepartment = () => {
    navigate("/department");
  };

  const handleAddOrganization = () => {
    navigate("/createorganization");
  };

  const handleCreateExams = () => {
    navigate("/createexam");
  }

  return (
   <div className="absolute min-h-screen w-full bg-gradient-to-br from-blue-200 to-gray-200 p-6 overflow-x-hidden">
  {/* Top Section */}
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out transform hover:text-blue-600">
        Welcome, Admin!
      </h1>
      <p className="text-sm sm:text-base text-gray-500">{greeting}</p>
    </div>
    {/* Button group */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 lg:mt-0 lg:flex lg:flex-wrap lg:justify-end">
      <button
        className="btn-secondary bg-blue-300 text-sm sm:text-base p-2 sm:px-4 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
        onClick={handleAddOrganization}
      >
        Add Organization
      </button>
      <button
        className="btn-primary bg-blue-300 text-sm sm:text-base p-2 sm:px-4 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
        onClick={handleCreateDesignation}
      >
        Create Designation
      </button>
      <button
        className="btn-secondary bg-blue-300 text-sm sm:text-base p-2 sm:px-4 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
        onClick={handleCreateDepartment}
      >
        Create Department
      </button>
      <button
        className="btn-secondary bg-blue-300 text-sm sm:text-base p-2 sm:px-4 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
        onClick={handleCreateExams}
      >
        Create Exams
      </button>
    </div>
  </div>

  {/* Scrolling Message Section */}
  <div className="scroll-message animate-scroll-text mb-4 text-lg text-gray-800">
    🎉 Welcome to the new HRMS platform! 🚀 New features coming soon. Stay tuned for updates. 📅 Holiday schedule released for next year.
  </div>

  {/* Thoughts Section */}
  <div className="bg-white text-center shadow-xl rounded-lg p-6 mb-8 transition-all transform">
    <p className="text-lg text-gray-600 italic font">{thought}</p>
  </div>

  {/* Main Dashboard Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Dynamic Cards */}
    {quickActions.map((action, index) => (
      <div
        key={index}
        className={`p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all ${action.bg}`}
        onClick={() => handleCardClick(action.path)}
      >
        <div className="flex items-center space-x-4">
          <div className="text-4xl text-gray-800">{action.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
            <p className="text-sm text-gray-500">View or manage {action.title}</p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Announcements & Links */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
    {/* Announcements */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Latest Announcements
      </h3>
      <ul className="space-y-3 text-gray-600">
        <li>🎉 Welcome to the new HRMS platform!</li>
        <li>🚀 Quarterly goals have been updated.</li>
        <li>📅 Holiday schedule released for next year.</li>
      </ul>
    </div>

    {/* Quick Links */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Links
      </h3>
      <div className="flex flex-wrap gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-700 transform hover:scale-105">
          Settings
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-green-700 transform hover:scale-105">
          Reports
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-red-700 transform hover:scale-105">
          Alerts
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { FaUser, FaFileAlt, FaSuitcase, FaChartLine, FaClipboard, FaCalendar, FaSitemap, FaUserCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

// const Dashboard = () => {
//   const [greeting, setGreeting] = useState("");
//   const [thought, setThought] = useState("");
//   const navigate = useNavigate(); // Initialize the navigate function
//   const employeeId = localStorage.getItem('EmpId');

//   // Thought list for different hours
//   const thoughts = [
//     "Believe in yourself and all that you are. 🌱",
//     "The future belongs to those who believe in the beauty of their dreams. 💫",
//     "Success is not the key to happiness. Happiness is the key to success. 🌟",
//     "The only way to do great work is to love what you do. 💼",
//     "Your limitation—it’s only your imagination. 🌈",
//     "Push yourself, because no one else is going to do it for you. 🚀",
//     "Great things never come from comfort zones. 💪",
//     "Dream it. Wish it. Do it. ✨",
//     "Success doesn’t just find you. You have to go out and get it. 🏆",
//     "The harder you work for something, the greater you’ll feel when you achieve it. 🏅"
//   ];

//   useEffect(() => {
//     // Set greeting based on time of the day
//     const hour = new Date().getHours();
//     if (hour < 12) setGreeting("Good Morning 🌞");
//     else if (hour < 18) setGreeting("Good Afternoon 🌤️");
//     else setGreeting("Good Evening 🌙");

//     // Update thought every hour
//     const updateThought = () => {
//       const hourOfDay = new Date().getHours();
//       setThought(thoughts[hourOfDay % thoughts.length]);
//     };

//     // Call once initially
//     updateThought();

//     // Update thought every hour
//     const intervalId = setInterval(updateThought, 3600000); // 3600000ms = 1 hour

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   // Updated quickActions with path information for navigation
//   const quickActions = [
//     { title: "Profile", icon: <FaUser />, bg: "bg-orange-200", path: "/allEmployee" },
//     { title: "Leaves", icon: <FaFileAlt />, bg: "bg-green-200", path: "/LeaveForm" },
//     { title: "On Boarding", icon: <FaSuitcase />, bg: "bg-yellow-200", path: "/onboardingDocuments" },
//     { title: "Careers", icon: <FaChartLine />, bg: "bg-purple-200", path: "/careers" },
//     { title: "Assignment", icon: <FaClipboard />, bg: "bg-red-200", path: "/projects" },
//     { title: "Holidays", icon: <FaCalendar />, bg: "bg-pink-200", path: "/holidays" },
//     { title: "Organization Chart", icon: <FaSitemap />, bg: "bg-purple-200", path: `/Organization/${employeeId}` },
//     { title: "Interviews", icon: <FaUserCheck />, bg: "bg-orange-200", path: "/interviewtable" },
//   ];

//   // Handle card click to navigate
//   const handleCardClick = (path) => {
//     navigate(path);
//   };

//   // Handle button click for creating designation, department, and organization
//   const handleCreateDesignation = () => {
//     navigate("/designations");
//   };

//   const handleCreateDepartment = () => {
//     navigate("/department");
//   };

//   const handleAddOrganization = () => {
//     navigate("/createorganization");
//   };

//   const handleCreateExams = () => {
//     navigate("/createexam");
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 to-gray-200 p-6">
//       {/* Top Section */}
//       <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out transform hover:text-blue-600">
//             Welcome, Admin!
//           </h1>
//           <p className="text-gray-500">{greeting}</p>
//         </div>
//         <div className="flex justify-end gap-3 mt-4 lg:mt-0">
//           <button
//             className="btn-secondary bg-blue-300 p-2 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
//             onClick={handleAddOrganization}
//           >
//             Add Organization
//           </button>
//           <button
//             className="btn-primary bg-blue-300 p-2 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
//             onClick={handleCreateDesignation}
//           >
//             Create Designation
//           </button>
//           <button
//             className="btn-secondary bg-blue-300 p-2 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
//             onClick={handleCreateDepartment}
//           >
//             Create Department
//           </button>
//           <button
//             className="btn-secondary bg-blue-300 p-2 rounded-md shadow-md transition-all hover:bg-blue-400 transform hover:scale-105"
//             onClick={handleCreateExams}
//           >
//             Create Exams
//           </button>
//         </div>
//       </div>

//       {/* Scrolling Message Section */}
//       <div className="scroll-message animate-scroll-text mb-4">
//         🎉 Welcome to the new HRMS platform! 🚀 New features coming soon. Stay tuned for updates. 📅 Holiday schedule released for next year.
//       </div>

//       {/* Thoughts Section */}
//       <div className="bg-white text-center shadow-xl rounded-lg p-6 mb-8 transition-all transform">
//         {/* <h3 className="text-xl font-semibold text-gray-800 mb-2">Today's Thought</h3> */}
//         <p className="text-lg text-gray-600 italic font">{thought}</p>
//       </div>

//       {/* Main Dashboard Content */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Dynamic Cards */}
//         {quickActions.map((action, index) => (
//           <div
//             key={index}
//             className={`p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all ${action.bg}`}
//             onClick={() => handleCardClick(action.path)}
//           >
//             <div className="flex items-center space-x-4">
//               <div className="text-4xl text-gray-800">{action.icon}</div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
//                 <p className="text-sm text-gray-500">View or manage {action.title}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Announcements & Links */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//         {/* Announcements */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             Latest Announcements
//           </h3>
//           <ul className="space-y-3 text-gray-600">
//             <li>🎉 Welcome to the new HRMS platform!</li>
//             <li>🚀 Quarterly goals have been updated.</li>
//             <li>📅 Holiday schedule released for next year.</li>
//           </ul>
//         </div>

//         {/* Quick Links */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             Quick Links
//           </h3>
//           <div className="flex flex-wrap gap-4">
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-700 transform hover:scale-105">
//               Settings
//             </button>
//             <button className="bg-green-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-green-700 transform hover:scale-105">
//               Reports
//             </button>
//             <button className="bg-red-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-red-700 transform hover:scale-105">
//               Alerts
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

