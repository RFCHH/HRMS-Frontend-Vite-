import React from "react";
import { AiTwotoneHome } from "react-icons/ai";
import {
  IoPersonSharp,
  IoLocationOutline,
  IoNotifications,
} from "react-icons/io5";
import { FaRegIdCard, FaLaptop,FaBookReader  } from "react-icons/fa";
// import { MdCardTravel } from "react-icons/md";
import { PiSuitcaseSimpleFill,PiAirplaneTiltFill } from "react-icons/pi";
import { IoMdPersonAdd } from "react-icons/io";
import { SlEnvolope } from "react-icons/sl";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Navbar */}
     
      <div className="  mt-2 flex p-1  bg-gray-200 shadow-md max-w-7xl mx-auto  border  border-black  rounded-md">
        <AiTwotoneHome size={20} className="mt-1 mr-2" />
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Profile Section */}
      <div className="mt-4 p-3 bg-gray-200 border  border-black shadow-lg max-w-6xl mx-auto rounded-md">
        <div className="flex items-center space-x-4">
          <img
            src="/Rfchh logo"
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">Profile Name(E00001)</h2>
            <p>Software Developer</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-200 shadow-lg rounded-md max-w-7xl  border-black mx-auto border-2">
        {/* Tab Navigation */}
        <div className="mt-4 p-3 bg-white border  border-black shadow-md flex text-sm flex-nowrap space-x-4 mb-6 max-w-7xl mx-auto rounded-md overflow-x-auto">
          {[
            { name: "Profile", route: "/personalDetails" },
            { name: "NationalID", route: "/National" },
            { name: "Education-Details", route: "/educationDetails" },
            { name: "Address-Details", route: "/location" },
            { name: "Travel-Details", route: "/Travel" },
            { name: "Experience-Details", route: "experience" },
            { name: "Family-Details", route: "/familyDetails" },
            { name: "Current-Experience-Details", route: "/current" },
          ].map((tab, index) => (
            <Link to={tab.route} key={index}>
          
            <button
              key={index}
              className="px-3 py-1 ml-3 border-2 border-transparent hover:border-yellow-700"
            >
              {tab.name}
            </button>

            </Link>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-4 mt-3 max-w-7xl mx-auto ">
          {/* Personal Section */}
          <Link to="/personalDetails">
            <div className="bg-white p-4 border  border-black shadow-md rounded-md">
              {/* Flex container for the icon and heading */}
              <div className="flex items-center mb-2 bg-gray-300 rounded-md ">
                <IoPersonSharp size={28} className="mr-2 pl-2" />
                <h3 className="font-semibold text-base ">Personal Details</h3>
              </div>
              <p>Date of Birth: 06/07/1997</p>
              <p>Phone Number: 7036498882</p>
              <p>Gender: Male</p>
              <p>Marital Status: Unmarried</p>  
            </div>
          </Link>

          {/* National ID Section */}
          <Link to="/National">
          <div className="bg-white p-4 shadow-md rounded-md border  border-black">
            <div className="flex items-center mb-2 bg-gray-300 rounded-md ">
              <FaRegIdCard size={28} className="mr-2 pl-2" />
              <h3 className="font-semibold  ">National ID </h3>
            </div>

            <p>Aadhar Card: 1234-5678-9101</p>
            <p>PAN Card: ABCDE1234F</p>
            <p>PAN Card: ABCDE1234F</p>
            <p>PAN Card: ABCDE1234F</p>
          </div>
          </Link>
          {/* Education Details Section */}
          <Link to="/EducationDetails">
            <div className="bg-white p-4 shadow-md rounded-md border  border-black">
              <div className="flex items-center bg-gray-300 mb-2  rounded-md          ">
                <FaBookReader  size={25} className="pl-2 mr-1" />
                <h3 className="font-semibold    rounded-md ">
                  Education Details
                </h3>
              </div>
              <p>Graduation: Bachelor of Technology</p>
              <p>Institute: Some University</p>
              <p>Year: 2019</p>
              <p>Phone Number: 7036498882</p>
              {/* <p>Gender: Male</p> */}
              {/* <p>Marital Status: Unmarried</p> */}
            </div>
          </Link>

          {/* Location Section */}
          <Link to="/location">
          <div className="bg-white p-4 shadow-md rounded-md border  border-black">
            <div className="flex items-center bg-gray-300 mb-2  rounded-md">
              <IoLocationOutline size={28} className="pl-2 mr-1" />
              <h3 className="font-semibold   bg-gray-300  rounded-md ">
                Address Details
              </h3>
            </div>

            <p>Permanent Address: ABC Street, City, Country</p>
            <p>Permanent Address: ABC Street, City, Country</p>
            <p>Permanent Address: ABC Street, City, Country</p>
          </div>
          </Link>
          {/* Travel Details Section */}
          <Link to='/Travel'>
          <div className="bg-white p-4 shadow-md rounded-md border  border-black">
            <div className="flex items-center bg-gray-300 mb-2  rounded-md">
              <PiAirplaneTiltFill size={28} className="pl-2 mr-1" />
              <h3 className="font-semibold  bg-gray-300  rounded-md ">
                Travel Details
              </h3>
            </div>
            <p>Passport: Available</p>
            <p>Visa: None</p>
          </div>
          </Link>
          {/* Experience Details Section */}
          <Link to="/experience">
          <div className="bg-white p-4 shadow-md rounded-md border  border-black">
            <div className="flex items-center bg-gray-300 mb-2  rounded-md">
              <PiSuitcaseSimpleFill size={28} className="pl-2 mr-1" />
              <h3 className="font-semibold  bg-gray-300  rounded-md ">
                Experience Details
              </h3>
            </div>

            <p>Organization: Tech Software</p>
            <p>Experience: 2 Years</p>
            <p>Designation: Frontend Developer</p>
          </div>
          </Link>
          {/* Family Details Section */}
          <Link to="/FamilyDetails">
            <div className="bg-white p-4 shadow-md rounded-md border  border-black">
              <div className="flex items-center bg-gray-300 mb-2  rounded-md">
                <IoMdPersonAdd size={28} className="pl-2 mr-1" />
                <h3 className="font-semibold  bg-gray-300  rounded-md ">
                  Family Details
                </h3>
              </div>
              <p>Name: Arvind</p>
              <p>Relation: Father</p>
            </div>
          </Link>
          {/* Current Experience Details Section */}
          <Link to="/Current">
            <div className="bg-white p-4 shadow-md rounded-md border  border-black">
              <div className="flex items-center bg-gray-300 mb-2  rounded-md">
                <FaLaptop size={28} className="pl-2 mr-1" />
                <h3 className="font-semibold  bg-gray-300  rounded-md ">
                  Current Experience Details
                </h3>
              </div>
              <p>Organization: Tech Software</p>
              <p>Designation: Frontend Developer</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
