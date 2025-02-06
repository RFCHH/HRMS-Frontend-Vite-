import { useState, useEffect } from 'react';
import axiosInstance from "./axiosConfig";
import { FaLessThan } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const OrganizationCreation = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [employeeDomain, setEmployeeDomain] = useState('');
  const [weekOfOne, setWeekOfOne] = useState('');
  const [weekOfTwo, setWeekOfTwo] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [rootDesignation, setRootDesignation] = useState('');
  const [multiLevel, setMultiLevel] = useState(true);
  const [isNewOrganization, setIsNewOrganization] = useState(true); 
  const [organizationId, setOrganizationId] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [emailId, setEmailId] = useState('');
  const [ mailType,setMailType] = useState('')
  const [passKey, setPassKey] = useState('');

  const orgId = localStorage.getItem('organizationId');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday','Noweekoff'];

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axiosInstance.get('hrmsapplication/designations/getAllDesignations');
        setDesignationOptions(response.data);
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };

    fetchDesignations();
  }, []);

  const handleDaySelect = (day, week) => {
    if (week === 1) {
      setWeekOfOne(day);
    } else if (week === 2) {
      setWeekOfTwo(day);
    }
  };

  const handleSave = async () => {
    const organizationData = {
      organizationName,
      employeeDomain,
      logoUrl,
      rootDesignation,
      weekOfOne,
      weekOfTwo,
      multiLevel,
      organizationId,
      emailId,
      mailType,
      passKey, 
    };

    const errors = {};
    if (!rootDesignation) errors.rootDesignation = 'Please select a root designation.';
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      if (isNewOrganization) {
      
        const response = await axiosInstance.post(
          'hrmsapplication/organization/create',
          organizationData
        );
        console.log('Organization created:', response.data);
        setOrganizationId(response.data.organizationId); // Set organization ID from the response
        setIsNewOrganization(false); // Mark as created
        toast.success("Data added successfully!");
      } else {
        // PATCH call for updating an existing organization
        const response = await axiosInstance.patch(
          'hrmsapplication/organization/update',
          organizationData // Include the organization ID
        );
        toast.success("Data loaded successfully!");
        console.log('Organization updated:', response.data);
      }
    } catch (error) {
      console.error('Error saving/updating organization:', error);
      toast.error("Kindly recheck the form.");
    }
  };

  const fetchOrganizationData = async () => {
    try {
      const response = await axiosInstance.get(
        `hrmsapplication/organization/getOrganization${orgId}`
      );

      const data = response.data;
      setOrganizationName(data.organizationName);
      setEmployeeDomain(data.employeeDomain);
      setLogoUrl(data.logoUrl);
      setRootDesignation(data.rootDesignation);
      setWeekOfOne(data.weekOfOne);
      setWeekOfTwo(data.weekOfTwo);
      setMultiLevel(data.multiLevel);
      setEmailId(data.emailId || ''); 
      setPassKey(data.passKey || ''); 
      setMailType(data.mailType || '');
      setOrganizationId(data.organizationId); 
      setIsNewOrganization(false);
    } catch (error) {
      console.error('Failed to fetch organization data:', error);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">

      <NavLink
        to='/admindashboard'
        className="flex items-center justify-start px-2 py-2 overflow-x-auto bg-blue-950 border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
        <FaLessThan className="text-white mr-2" />
        <button>
          <span className="text font-semibold text-white">Previous Page</span>
        </button>
      </NavLink>
      <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">{isNewOrganization ? 'Create Organization' : 'Update Organization'}</h1>

          <div className="mb-6 shadow-md p-4 rounded-lg``">
            <label className="block text-lg font-semibold mb-2">Organization Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter organization name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          <div className="mb-6 shadow-md p-4 rounded-lg">
            <label className="block text-lg font-semibold mb-2">Employee ID Domain</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter employee domain"
              value={employeeDomain}
              onChange={(e) => setEmployeeDomain(e.target.value)}
            />
          </div>

          <div className="col-span-1 mb-6 shadow-md p-4 rounded-lg">
            <label className="block mb-1">Root Designation:</label>
            <select
              name="rootDesignation"
              value={rootDesignation}
              onChange={(e) => setRootDesignation(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-lg"
            >
              {designationOptions.length > 0 ? (
                designationOptions.map((option, index) => (
                  <option key={index} value={option.designation}>
                    {option.designation}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
            {formErrors.rootDesignation && (
              <p className="text-red-600 text-sm mt-1">{formErrors.rootDesignation}</p>
            )}
          </div>

          <div className="mb-6 shadow-md p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Approval Type</h2>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="approvalType"
                  value="single"
                  checked={!multiLevel}
                  onChange={() => setMultiLevel(false)}
                  className="mr-2"
                />
                Single Level
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="approvalType"
                  value="multi"
                  checked={multiLevel}
                  onChange={() => setMultiLevel(true)}
                  className="mr-2"
                />
                Multi Level
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">Select Week Offs</h2>

            <div className="shadow-md p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Week Off 1</h3>
              <select
                value={weekOfOne}
                onChange={(e) => handleDaySelect(e.target.value, 1)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="shadow-md p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Week Off 2</h3>
              <select
                value={weekOfTwo}
                onChange={(e) => handleDaySelect(e.target.value, 2)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6 shadow-md p-4 rounded-lg">
            <label className="block text-lg font-semibold mb-2">Email ID</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter email ID"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
            {formErrors.emailId && (
              <p className="text-red-600 text-sm mt-1">{formErrors.emailId}</p>
            )}
          </div>
          <div className="mb-6 shadow-md p-4 rounded-lg">
  <label className="block text-lg font-semibold mb-2">MailType</label>
  <select
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={mailType}  
    onChange={(e) => setMailType(e.target.value)}  
  >
    <option value="ZOHO">ZOHO</option>
    <option value="GMAIL">GMAIL</option>
  </select>
</div>



          <div className="mb-6 shadow-md p-4 rounded-lg">
            <label className="block text-lg font-semibold mb-2">Pass Key</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter pass key"
              value={passKey}
              onChange={(e) => setPassKey(e.target.value)}
            />
            {formErrors.passKey && (
              <p className="text-red-600 text-sm mt-1">{formErrors.passKey}</p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {isNewOrganization ? 'Save All' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default OrganizationCreation;
