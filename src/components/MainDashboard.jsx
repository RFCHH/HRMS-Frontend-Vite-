// import React from 'react';
// import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';  
// import {
//   FaUser, FaClipboardCheck, FaCalendarAlt, FaChartLine, FaFileAlt, FaSuitcase, FaClipboard, FaCalendar, FaTrophy, FaSitemap
// } from 'react-icons/fa';

// const MainDashboard = () => {
//   const navigate = useNavigate(); 
//   const handleCardClick = (title) => {
//     if (title === 'Profile') {navigate('/allEmployee');}
//     if (title === 'Approvals') { navigate ('/approvals')} ;
//     if (title === 'Leaves') { navigate ('/leaves')} ;
//     if (title === 'Attendance') { navigate ('/attendance')} ;
//     if (title === 'Approvals') { navigate ('/approvals')} ;
//     if (title === 'OnBoarding') {navigate('/interview')}
//     if (title === 'Careers') {navigate('/careers')}
//     if (title === 'Assignment') {navigate('/assignment')}
//     if (title === 'Holidays') {navigate('/holidays')}
//     if (title === 'Employee Performance') {navigate('/employeePerformance')}
//     if (title === 'Organisation Chart') {navigate('/Organization')}
//   };

//   return (
//     <div className="min-h-screen bg-gray-200 p-6">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h1 className="p-40 bg-gray-400 text-3xl font-bold text-center shadow-xl mb-6">Happy Morning</h1>
//         <div className="grid grid-cols-5 gap-8">
//           <DashboardCard title="Profile" icon={<FaUser />} onClick={handleCardClick}  />
//           <DashboardCard title="Approvals" icon={<FaClipboardCheck />} onClick={handleCardClick} />
//           <DashboardCard title="Leaves" icon={<FaFileAlt />} onClick={handleCardClick}/>
//           <DashboardCard title="Attendance" icon={<FaCalendarAlt />} onClick={handleCardClick}/>
//           <DashboardCard title="OnBoarding" icon={<FaSuitcase />} onClick={handleCardClick} />
//           <DashboardCard title="Careers" icon={<FaChartLine />} onClick={handleCardClick}/>
//           <DashboardCard title="Assignment" icon={<FaClipboard />} onClick={handleCardClick}/>
//           <DashboardCard title="Holidays" icon={<FaCalendar />} onClick={handleCardClick}/>
//           <DashboardCard title="Employee Performance" icon={<FaTrophy />} onClick={handleCardClick}/>
//           <DashboardCard title="Organisation Chart" icon={<FaSitemap />} onClick={handleCardClick}/>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DashboardCard = ({ title, icon, onClick }) => {
//   return (
//     <div
//       className="bg-blue-950 text-white p-4 rounded-lg shadow-md hover:bg-orange-500 transition duration-300"
//       onClick={() => onClick && onClick(title)}  
//     >
//       <div className="flex flex-col items-center justify-center">
//         <div className="text-4xl mb-3">{icon}</div>
//         <h2 className="text-lg font-semibold">{title}</h2>
//       </div>
//     </div>
//   );
// };

// DashboardCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   icon: PropTypes.element.isRequired,
//   onClick: PropTypes.func,  
// };

// export default MainDashboard;
