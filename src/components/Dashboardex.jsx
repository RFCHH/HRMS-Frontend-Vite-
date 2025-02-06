import React, { useEffect, useState } from "react";
import { AiTwotoneHome } from "react-icons/ai";
import { IoPersonSharp, IoLocationOutline } from "react-icons/io5";
import { FaRegIdCard, FaBookReader } from "react-icons/fa";
import { PiSuitcaseSimpleFill, PiAirplaneTiltFill } from "react-icons/pi";
import { TiGroup } from "react-icons/ti";
import { Link } from "react-router-dom";

// Define color variables
const COLORS = {
  text: {
    indigo600: "text-indigo-600",
    green600: "text-green-600",
    purple600: "text-purple-600",
    yellow600: "text-yellow-600",
    red600: "text-red-600",
    teal600: "text-teal-600",
    pink600: "text-pink-600",
    indigo500: "text-indigo-500",
    white: "text-white",
    black: "text-black",
    grayA3: "text-[#9795A3]",
    gray700: "text-[#4B55639]", // Adjust as needed
  },
  background: {
    gray50: "bg-[#f3f6fd]",
    white: "bg-white",
    gradientToR: "bg-[#0e0e23]", // Example gradient
    // gradientToR: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500", // Example gradient
    bg0e0e23: "bg-[#0e0e23]",
    gray200: "border-[#0e0e23]",
  },
  hover: {
    darkBg: "hover:bg-[#0e0e23]",
    darkText: "hover:text-white",
  },
};

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const mockData = {
    employeeProfileDetails: {
      firstname: "Jonson",
      employeeId: "HRMS123",
      employeeDesignation: "Software Developer",
      dob: "1990-01-01",
      phoneNumber: "1234567890",
      doj: "2020-01-01",
    },
    educationDetails: {
      degree: "B.Tech",
      institutionName: "XYZ University",
      yearOfPass: "2012",
    },
    currentExperienceDetails: {
      organisationName: "TechCorp",
      experience: "2",
      designation: "Senior Developer",
    },
    experienceDetails: {
      organisationName: "OldTech",
      experience: "3",
      designation: "Junior Developer",
    },
    familyDetails: {
      name: "Doe Family",
      relation: "Father",
    },
    AddressDetails: {
      houseNumber: "123",
      street: "Main Street",
      village: "Sample Village",
      town: "Sample Town",
      district: "Sample District",
      state: "Sample State",
      country: "Sample Country",
      pincode: "123456",
    },
    nationalIDDetails: {
      nationalId: "Passport",
      nationalIDNum: "A1234567",
    },
    travelDetails: {
      passportNumber: "A1234567",
      issueDate: "2015-01-01",
      expireDate: "2025-01-01",
    },
  };

  const id = "HRMS5";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.119:8080/hrmsapplication/employee/getProfileDashboard/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployeeData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmployeeData(mockData);
      }
    };

    fetchData();
  }, []);

  if (!employeeData) {
    return (
      <div className={`flex items-center justify-center h-screen ${COLORS.background.gray50}`}>
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-current mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <h2 className="mt-4 text-xl text-gray-700">
            Loading... Please wait while we fetch your data.
          </h2>
        </div>
      </div>
    );
  }

  const {
    employeeProfileDetails,
    educationDetails,
    currentExperienceDetails,
    experienceDetails,
    familyDetails,
    AddressDetails,
    nationalIDDetails,
    travelDetails,
  } = employeeData;

  const tabs = [
    { name: "Profile", route: "/personalDetails" },
    { name: "National ID", route: "/National" },
    { name: "Education", route: "/educationDetails" },
    { name: "Address", route: "/location" },
    { name: "Travel", route: "/Travel" },
    { name: "Experience", route: "/experience" },
    { name: "Family", route: "/familyDetails" },
    { name: "Current Experience", route: "/current" },
  ];

  const cardData = [
    {
      title: "Profile",
      icon: <IoPersonSharp size={28} className={COLORS.text.indigo600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {employeeProfileDetails?.firstname}
          </p>
          <p>
            <span className="font-semibold">DOB:</span>{" "}
            {employeeProfileDetails?.dob}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {employeeProfileDetails?.phoneNumber}
          </p>
          <p>
            <span className="font-semibold">DOJ:</span>{" "}
            {employeeProfileDetails?.doj}
          </p>
        </>
      ),
      link: `/personalDetails/${id}`,
    },
    {
      title: "National ID",
      icon: <FaRegIdCard size={28} className={COLORS.text.green600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">ID Type:</span>{" "}
            {nationalIDDetails?.nationalId}
          </p>
          <p>
            <span className="font-semibold">ID Number:</span>{" "}
            {nationalIDDetails?.nationalIDNum}
          </p>
        </>
      ),
      link: "/National",
    },
    {
      title: "Education",
      icon: <FaBookReader size={28} className={COLORS.text.purple600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">Degree:</span>{" "}
            {educationDetails?.degree}
          </p>
          <p>
            <span className="font-semibold">Institute:</span>{" "}
            {educationDetails?.institutionName}
          </p>
          <p>
            <span className="font-semibold">Year:</span>{" "}
            {educationDetails?.yearOfPass}
          </p>
        </>
      ),
      link: "/educationDetails",
    },
    {
      title: "Address",
      icon: <IoLocationOutline size={28} className={COLORS.text.yellow600} />,
      content: (
        <p>
          {`${AddressDetails?.houseNumber}, ${AddressDetails?.street}, ${AddressDetails?.village}, ${AddressDetails?.town}, ${AddressDetails?.district}, ${AddressDetails?.state}, ${AddressDetails?.country} - ${AddressDetails?.pincode}`}
        </p>
      ),
      link: "/location",
    },
    {
      title: "Travel",
      icon: <PiAirplaneTiltFill size={28} className={COLORS.text.indigo600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">Passport:</span>{" "}
            {travelDetails?.passportNumber}
          </p>
          <p>
            <span className="font-semibold">Issue Date:</span>{" "}
            {travelDetails?.issueDate}
          </p>
          <p>
            <span className="font-semibold">Expire Date:</span>{" "}
            {travelDetails?.expireDate}
          </p>
        </>
      ),
      link: "/Travel",
    },
    {
      title: "Experience",
      icon: <PiSuitcaseSimpleFill size={28} className={COLORS.text.red600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">Organization:</span>{" "}
            {experienceDetails?.organisationName}
          </p>
          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {experienceDetails?.experience} Years
          </p>
          <p>
            <span className="font-semibold">Designation:</span>{" "}
            {experienceDetails?.designation}
          </p>
        </>
      ),
      link: "/experience",
    },
    {
      title: "Family",
      icon: <TiGroup size={28} className={COLORS.text.teal600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">Father's Name:</span>{" "}
            {familyDetails?.name}
          </p>
          <p>
            <span className="font-semibold">Relationship:</span>{" "}
            {familyDetails?.relation}
          </p>
          <p>
            <span className="font-semibold">Marital Status:</span> Unmarried
          </p>
        </>
      ),
      link: "/familyDetails",
    },
    {
      title: "Current Experience",
      icon: <PiSuitcaseSimpleFill size={28} className={COLORS.text.pink600} />,
      content: (
        <>
          <p>
            <span className="font-semibold">Organization:</span>{" "}
            {currentExperienceDetails?.organisationName}
          </p>
          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {currentExperienceDetails?.experience} Years
          </p>
          <p>
            <span className="font-semibold">Designation:</span>{" "}
            {currentExperienceDetails?.designation}
          </p>
        </>
      ),
      link: "/current",
    },
  ];

  return (
    <div className={COLORS.background.gray50 + " min-h-screen"}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 ${COLORS.background.gradientToR}`}>
        {/* <div className="flex items-center">
          <AiTwotoneHome size={30} className="text-white mr-3" />
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        </div> */}
        {/* You can add a Navbar or User Profile here if needed */}
      </header>

      {/* Profile Section */}
      <section
        className={`mt-6 max-w-7xl mx-auto p-6 ${COLORS.background.white} ${COLORS.text.grayA3} shadow-lg rounded-lg flex items-center space-x-6`}
      >
        <img
          src="/rfchh.jpg"
          alt="Profile"
          className={`w-24 h-24 rounded-full border-4 ${COLORS.background.gray200} object-cover`}
        />
        <div>
          <h2 className={`text-2xl font-[Inter] sans-serif ${COLORS.text.black}`}>
            {employeeProfileDetails?.firstname}{" "}
            <span className={COLORS.text.black}>
              ({employeeProfileDetails?.employeeId})
            </span>
          </h2>
          <p className={COLORS.text.black}>
            {employeeProfileDetails?.employeeDesignation}
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="mt-8 max-w-7xl mx-auto px-6">
        <div
          className={`flex flex-wrap ${COLORS.background.white} shadow-md rounded-lg overflow-hidden`}
          style={{ borderRadius: "3.35rem" }}
        >
          {tabs.map((tab, index) => (
            <Link to={tab.route} key={index} className="flex-1">
              <button
                className={`w-full py-3 px-4 text-center ${COLORS.text.black} ${COLORS.hover.darkBg} ${COLORS.hover.darkText} transition-colors duration-200`}
              >
                {tab.name}
              </button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Content Grid */}
      <main className="mt-8 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <Link to={card.link} key={index}>
            <div
              className={`bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full flex flex-col`}
              style={{ borderRadius: "3.375rem" }}
            >
              <div className="flex items-center mb-4">
                {card.icon}
                <h3 className={`text-xl font-semibold ${COLORS.text.black} ml-3`}>
                  {card.title}
                </h3>
              </div>
              <div className={`flex-1 ${COLORS.text.grayA3} space-y-2`}>
                {card.content}
              </div>
              <div className="mt-4">
                <span className={`${COLORS.text.indigo500} hover:underline`}>
                  View Details &raquo;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer (Optional) */}
      <footer className={`mt-12 py-4 ${COLORS.background.bg0e0e23} shadow-inner`}>
        <div className={`max-w-7xl mx-auto text-center ${COLORS.text.grayA3}`}>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
