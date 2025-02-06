// import React from 'react';
// import { NavLink,Link} from 'react-router-dom';
// import { FaHome } from 'react-icons/fa';
// import EditPersonalDetails from './createEmply';

// const Navbar = ({ defaultTab }) => {
//   return (
//     <div>
//       <div className="flex items-center justify-start px-2 py-2 border-2 border-gray-800 rounded-md h-20 ml-3 mb-5">
//         <FaHome className="text-black-500 mr-2" />
//         <Link to='/MainDashboard'><NavLink to="/MainDashboard">
//           <span className="text font-semibold text-black-500">Home</span>
//         </NavLink></Link>
      

//       <div className="flex items-center justify-center space-x-10 px-2 py-2 rounded-md w-full ml-3 mb-5 mt-5">
//         <NavLink
//           to="/interview"
//           className={({ isActive }) => (isActive || defaultTab === 'interview' ? 'text-orange-500' : 'text-black-500')}
//         >
//           <span className="text font-semibold">Interview Details Section</span>
//         </NavLink>
//         <NavLink
//           to="/onboardingDocuments"
//           className={({ isActive }) => (isActive || defaultTab === 'onboarding' ? 'text-orange-500' : 'text-black-500')}
//         >
//           <span className="text font-semibold">Onboarding Documents Section</span>
//         </NavLink>
//         <NavLink
//           to="/dd"
//           className={({ isActive }) => (isActive ? 'text-orange-500' : 'text-black-500')}
//         >
//           <span className="text font-semibold">Profile Creation</span>
//         </NavLink>
//         <NavLink
//           to="/payroll-section"
//           className={({ isActive }) => (isActive ? 'text-orange-500' : 'text-black-500')}
//         >
//           <span className="text font-semibold">Payroll Section</span>
//         </NavLink>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Navbar;
