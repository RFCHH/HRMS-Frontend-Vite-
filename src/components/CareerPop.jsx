import { useState, useEffect } from "react";

function EditCareerPopup({ onSave, onClose, career }) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobLocation: "",
    noOfRequirements: "",
    numberOfYears: "",
    numberOfMonths: "",
    age: "",
    salaryFrom: "",
    salaryTo: "",
    jobType: "",
    skillSet: "",
    workMode: "",
    publishDate: "",
    expiryDate: "",
    jobDescription: "",
  });
  const [errors, setErrors] = useState({});

  // Pre-fill the form if editing an existing career
  useEffect(() => {
    if (career) {
      setFormData(career);
    }
  }, [career]);

  const validateForm = () => {
    let validationsErrors = {};

    ["jobTitle", "jobLocation"].forEach((field) => {
      if (!formData[field]) {
        validationsErrors[field] = `${field} is required.`;
      } else if (!/^[A-Za-z0-9 ,.-]+$/.test(formData[field])) {
        validationsErrors[field] = `${field} must only contain letters, numbers, spaces, commas, periods, and hyphens.`;
      } else if (formData[field].length < 2) {
        validationsErrors[field] = `It must be min 2 characters`;
      } else if (formData[field].length > 20) {
        validationsErrors[field] = `${field} is to long`;
      }
    });

    if (!formData.noOfRequirements) {
      validationsErrors.noOfRequirements = " Requirements is required.";
    } else if (!/^\d+$/.test(formData.noOfRequirements)) {
      validationsErrors.noOfRequirements = "It must be a number.";
    } else if (parseInt(formData.noOfRequirements, 10) === 0) {
      validationsErrors.noOfRequirements = "0 is not allowed.";
    }
    // Validate experience years
    if (formData.numberOfYears === "" || formData.numberOfYears === undefined) {
      validationsErrors.numberOfYears = "Experience years are required.";
    } else if (!/^\d+$/.test(formData.numberOfYears)) {
      validationsErrors.numberOfYears = "Experience years must be a number.";
    } else if (parseInt(formData.numberOfYears, 10) > 61) {
      validationsErrors.numberOfYears = "Only up to 60 years accepted.";
    }

    // Validate experience years
    if (formData.numberOfMonths === "" || formData.numberOfMonths === undefined) {
      validationsErrors.numberOfMonths = "Experience months are required.";
    } else if (!/^\d+$/.test(formData.numberOfMonths)) {
      validationsErrors.numberOfMonths = "Experience months must be a number.";
    } else if (parseInt(formData.numberOfMonths, 10) > 11) {
      validationsErrors.numberOfMonths = "Only up to 60 months accepted.";
    }

    if (!/^\d{2}$/.test(formData.age)) {
      validationsErrors.age = "It must be 2 digits.";
    } else if (formData.age < 18 || formData.age > 99) {
      validationsErrors.age = "should be 18 to 99.";
    } else if (!formData.age || formData.age <= 0) {
      formData.age = "---";
    } else {
      delete validationsErrors.age;
    }

    //workmode validataion
    if (!formData.workMode) {
      validationsErrors.workMode = "Work Mode is required";
    }
    //jobtype validations
    if (!formData.jobType) {
      validationsErrors.jobType = "Job Type is required";
    }
    // Validate salaryFrom
    // Validate salaryFrom
    // Validate salaryFrom
    if (formData.salaryFrom === "" || formData.salaryFrom === undefined) {
      validationsErrors.salaryFrom = "Salary From is required.";
    } else if (!/^\d+$/.test(formData.salaryFrom)) {
      validationsErrors.salaryFrom = "Salary From must be a non-negative integer.";
    } else if (formData.salaryFrom < 0 || formData.salaryFrom > 9999999999) {
      validationsErrors.salaryFrom = "Salary From must be between 0 and 9999999999.";
    }
    if (formData.salaryTo === "" || formData.salaryTo === undefined) {
      validationsErrors.salaryTo = "Salary To is required.";
    } else if (!/^\d+$/.test(formData.salaryFrom)) {
      validationsErrors.salaryTo = "Salary To must be a non-negative integer.";
    } else if (formData.salaryTo < 0 || formData.salaryTo > 9999999999) {
      validationsErrors.salaryTo = "Salary To must be between 0 and 9999999999.";
    }


    //validate skillset
    if (!formData.skillSet) {
      validationsErrors.skillSet = "Skill Set is required";
    }

    // Validate jobDescription
    if (!formData.jobDescription) {
      validationsErrors.jobDescription = "Job Description is required.";
    } else if (formData.jobDescription.length < 50) {
      validationsErrors.jobDescription =
        "Job Description must be at least 50-300 characters.";
    } else if (formData.jobDescription.length > 300) {
      validationsErrors.jobDescription =
        "Job Description should not be morethan 300 characters";
    }
    if (!formData.publishDate) {
      validationsErrors.publishDate = "Publish Date is required.";
    }
    if (!formData.expiryDate) {
      validationsErrors.expiryDate = "Expired Date is required.";
    }
    setErrors(validationsErrors);
    return Object.keys(validationsErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    //for preventing space ..
    const regex = /^[a-zA-Z].*[\s]*$/;
    if (
      [
        "jobTitle",
        "jobLocation",
        "jobDescription",

      ].includes(name)
    ) {
      if (value === "" || regex.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        setErrors({
          ...errors,
          [name]: "No space allowed",
        });
        return;
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData); // Pass the form data back to the parent
    }
  };
  const getTodayDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-[700px] max-h-screen overflow-y-auto sm:w-[700px]">
        <h2 className="text-lg font-bold mb-4">New Career</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2">
            <div>
              <label className="block text-gray-900">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.jobTitle && (
                <span className="text-red-800 block h-3">
                  {errors.jobTitle}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Job Location</label>
              <input
                type="text"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.jobLocation && (
                <span className="text-red-800 block h-3">
                  {errors.jobLocation}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">No Of Requirements</label>{" "}
              <input
                type="text"
                name="noOfRequirements"
                placeholder="No of Requirements"
                value={formData.noOfRequirements}
                minLength={1}
                maxLength={5}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full md:w-"
              />
              {errors.noOfRequirements && (
                <span className="text-red-800 block h-3">
                  {errors.noOfRequirements}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Experience Year</label>
              <select
                name="numberOfYears"
                value={formData.numberOfYears}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Year</option>

                {Array.from({ length: 61 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {errors.numberOfYears && (
                <span className="text-red-800 block h-3">
                  {errors.numberOfYears}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Experience Months</label>
              <select
                name="numberOfMonths"
                value={formData.numberOfMonths}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Month</option>
                {/* Options for months from 0 to 11 */}
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {errors.numberOfMonths && (
                <span className="text-red-800 block h-3">
                  {errors.numberOfMonths}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Job Type</option>
                <option value="CONTRACTTOHIRE">Contract To Hire</option>
                <option value="FULLTIME">Full Time</option>
                <option value="PARTTIME">Part Time</option>
                <option value="FREELANCING">Freelance</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              {errors.jobType && (
                <span className="text-red-800 block h-3">{errors.jobType}</span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Work Mode</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="office">Office</option>
              </select>
              {errors.workMode && (
                <span className="text-red-800 block h-3">
                  {errors.workMode}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={formData.age}
                minLength={2}
                maxLength={2}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.age && (
                <span className="text-red-800 block h-3">{errors.age}</span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Salary From:</label>{" "}
              <input
                type="text"
                name="salaryFrom"
                placeholder="Salary From"
                value={formData.salaryFrom}
                minLength={1}
                maxLength={10}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.salaryFrom && (
                <span className="text-red-800 block h-3">
                  {errors.salaryFrom}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Salary To:</label>
              <input
                type="text"
                name="salaryTo"
                placeholder="Salary To"
                value={formData.salaryTo}
                minLength={1}
                maxLength={10}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.salaryTo && (
                <span className="text-red-800 block h-3">
                  {errors.salaryTo}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Skill Set:</label>
              <input
                type="text"
                name="skillSet"
                placeholder="Skills"
                value={formData.skillSet}
                onChange={handleChange}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.skillSet && (
                <span className="text-red-800 block h-3">
                  {errors.skillSet}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block text-gray-700">Publish Date:</label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                min={getTomorrowDate()}
                className="border p-2 border-gray-500 rounded-md w-full"
              />
              {errors.publishDate && (
                <span className="text-red-800 block h-3">
                  {errors.publishDate}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700">Expiry Date:</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                min={getTodayDate()}
                onKeyDown={(e) => e.preventDefault()}
                className="border p-2 border-gray-500 rounded-md"
              />
              {errors.expiryDate && (
                <span className="text-red-800 block h-3">
                  {errors.expiryDate}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="block  text-gray-700"> Job Description</label>
              <textarea
                name="jobDescription"
                // placeholder="Job Description........"
                value={formData.jobDescription}
                onChange={handleChange}
                className="border p-2 w-full border-gray-500 rounded-md h-16"
                // className="border p-2 col-4 border-gray-500 rounded-md"
                rows="3"
              ></textarea>
              {errors.jobDescription && (
                <span className="text-red-800 block ">
                  {errors.jobDescription}
                </span>
              )}
            </div>

            {/* Add other form fields similarly */}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 mr-2 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCareerPopup;
