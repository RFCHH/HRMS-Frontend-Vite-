import { useState, useEffect } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import React from "react";
import { FaLessThan } from "react-icons/fa";
import axiosInstance from "./axiosConfig";
import { useParams, Link } from "react-router-dom";
import { toast,  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Location() {
  const [formData, setFormData] = useState({
    PresentAddress: {
      hno: "",
      street: "",
      village: "",
      town: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    PermanentAddress: {
      hno: "",
      street: "",
      village: "",
      town: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    OfficeAddress: {
      buildingNameFloor: "",
      street: "",
      village: "",
      town: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
  });
  const { employeeId } = useParams();
  const [save, setSave] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [currentAddressType, setCurrentAddressType] = useState("");
  const userRole = localStorage.getItem("UserRole");

  const [isPermAddressNull, setIsPermAddressNull] = useState(false);
  const [isOfficeAddressNull, setIsOfficeAddressNull] = useState(false);
  const [isPresentAddressNull, setIsPresentAddressNull] = useState(false);

  const [addressData, setAddressData] = useState({
    buildingNameFloor: "",
    hno: "",
    street: "",
    village: "",
    town: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
  });
  const togglePopup = (e, addressType = "") => {
    setShowPopup(!showPopup);
    if (addressType) {
      setCurrentAddressType(addressType);
      e.preventDefault();
      setAddressData(formData[addressType]);
      setSave(false);
      setSecond(false);
      setThird(false);
    }
    setErrors("");
  };
  const handleNameChar = (e) => {
    const key = e.key;
    const input = e.target;
    const cursorPosition = input.selectionStart;
    if (
      key === "Backspace" ||
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown"
    ) {
      return;
    }
    if (key === " " && cursorPosition === 0) {
      e.preventDefault();
      return;
    }
    if (!/^[0-9A-Za-z\-\/., ]$/.test(key)) {
      e.preventDefault();
    }
  };

  const validate = () => {
    let errors = {};

    const alphabetAndSpaceRegex = /^(?!\s)(?!.*\s$)[a-zA-Z\s\/]+$/;  
    const permissiveRegex = /^[A-Za-z0-9\s\-\/.,]+$/;

    if (currentAddressType !== "OfficeAddress") {
      if (!addressData.hno || addressData.hno === "") {
        errors.hno = "H.NO is required";
      } else if (!/^[A-Za-z0-9/-]{1,10}$/.test(addressData.hno)) {
        errors.hno = "H.NO must be between 1 and 10 characters";
      }
    }

    if (currentAddressType === "OfficeAddress") {
      if (
        !addressData.buildingNameFloor || addressData.buildingNameFloor === ""
      ) {
        errors.buildingNameFloor = "Building Name is required";
      } else if (
        !/^[a-zA-Z0-9\s,-]{4,40}$/.test(addressData.buildingNameFloor)
      ) {
        errors.buildingNameFloor =
          "Building Name must be between 4 and 40 characters";
      }
    }

    if (!addressData.street || addressData.street === "") {
      errors.street = "Street is required";
    } else if (!permissiveRegex.test(addressData.street)) {
      errors.street = "Street can contain letters, numbers, spaces";
    }

    if (!addressData.village || addressData.village === "") {
      errors.village = "Village is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.village)) {
      errors.village = "It must be a string without spaces";
    }

    if (!addressData.town || addressData.town === "") {
      errors.town = "Town is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.town)) {
      errors.town = "It must be a string without spaces";
    }

    if (!addressData.district || addressData.district === "") {
      errors.district = "District is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.district)) {
      errors.district = "It must be a string without spaces";
    }

    if (!addressData.state || addressData.state === "") {
      errors.state = "State is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.state)) {
      errors.state = "It must be a string without spaces";
    }

    if (!addressData.country || addressData.country === "") {
      errors.country = "Country is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.country)) {
      errors.country = "It must be a string without spaces";
    }

    const pincodePattern = /^\d{6}$/;
    const pincodeStartWithZeroPattern = /^(0)/;
    const sameDigitPattern = /^(\d)\1{5}$/;
    if (!addressData.pincode || addressData.pincode === "") {
      errors.pincode = "Pincode is required";
    } else if (!/^\d+$/.test(addressData.pincode)) {
      errors.pincode = "It must be a number";
    } else if (!pincodePattern.test(addressData.pincode)) {
      errors.pincode = "Pincode must be exactly 6 digits";
    } else if (pincodeStartWithZeroPattern.test(addressData.pincode)) {
      errors.pincode = "Can't start with zero";
    } else if (sameDigitPattern.test(addressData.pincode)) {
      errors.pincode = "Pincode can't be all the same digit";
    }

    return errors;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };
  const handleEdit = (addressType) => {
    setCurrentAddressType(addressType);
    setAddressData(formData[addressType]);
    togglePopup();
  };
  const handleSave = () => {
    setSave(true);
  };
  const handleSecond = () => {
    setSecond(true);
  };
  const handleThird = () => {
    setThird(true);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const updatedFormData = {
        ...formData,
        [currentAddressType]: addressData,
      };
      setFormData(updatedFormData);

      const requestBody = {
        ...addressData,
        houseNumber: addressData.hno,
        employeeId: employeeId
      };
      delete requestBody.hno;

      let url = "";
      let method = "";

      switch (currentAddressType) {
        case "PresentAddress":
          if (isPresentAddressNull) {
            url = `hrmsapplication/location/createPresentAddress?employeeId=${employeeId}`;
            method = "POST";
          } else {
            url = `hrmsapplication/location/UpdatePresentAddress`;
            method = "PATCH";
          }

          break;

        case "PermanentAddress":
          if (isPermAddressNull) {
            url = `hrmsapplication/location/CreatePermanentAddress?employeeId=${employeeId}`;
            method = "POST";
          } else {
            url = `hrmsapplication/location/UpdatePermanentAddress`;
            method = "PATCH";
          }
          break;

        case "OfficeAddress":
          if (isOfficeAddressNull) {
            url = `hrmsapplication/location/createOfficeAddress?employeeId=${employeeId}`;
            method = "POST";
          } else {
            url = `hrmsapplication/location/UpdateOfficeAddress`;
            method = "PATCH";
          }

          break;

        default:
          break;
      }

      // if (!isOfficeAddressNull || !isPermAddressNull)
      //    {
      //     method = "PATCH";
      //     if (currentAddressType === "PresentAddress") {
      //         url = `hrmsapplication/location/UpdatePresentAddress`;
      //     } else if (currentAddressType === "PermanentAddress") {
      //         url = `hrmsapplication/location/UpdatePermanentAddress`;
      //     } else if (currentAddressType === "OfficeAddress") {
      //         url = `hrmsapplication/location/UpdateOfficeAddress`;
      //     }
      // } else {
      //     method = "POST";
      //     if (currentAddressType === "PresentAddress") {
      //         url = `hrmsapplication/location/createPresentAddress?employeeId=${employeeId}`;
      //     } else if (currentAddressType === "PermanentAddress") {
      //         url = `hrmsapplication/location/CreatePermanentAddress?employeeId=${employeeId}`;
      //     } else if (currentAddressType === "OfficeAddress") {
      //         url = `hrmsapplication/location/createOfficeAddress?employeeId=${employeeId}`;
      //     }
      // }
      console.log("Request method:", method);
      console.log("Request URL:", url);

      try {
        const response = await axiosInstance({
          method: method,
          url: url,
          data: requestBody,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Address saved successfully:", response.data);
        setShowPopup(false);
        if (currentAddressType === "PresentAddress") {
          handleSave();
        } else if (currentAddressType === "PermanentAddress") {
          handleSecond();
        } else if (currentAddressType === "OfficeAddress") {
          handleThird();
        }
      } catch (error) {
        console.error("Error saving address:", error);
        toast.error("kindly recheck the Form");
        if (error.response) {
          console.log("Server response error:", error.response.data);
        }
      }
    } else {
      console.log("Validation Errors:", validationErrors);
    }
  };

  const changeaddress = async (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        PermanentAddress: { ...prevFormData.PresentAddress },
      }));
      setSecond(true);

      const requestBody = {
        ...formData.PresentAddress,
        houseNumber: formData.PresentAddress.hno,
        employeeId: employeeId
      };
      delete requestBody.hno;
      let url;
      let method;

      if (isPermAddressNull) {
        url = `hrmsapplication/location/CreatePermanentAddress?employeeId=${employeeId}`;
        method = "POST";
      } else {
        url = `hrmsapplication/location/UpdatePermanentAddress`;
        method = "PATCH";
      }

      try {
        const response = await axiosInstance({
          method: method,
          url: url,
          data: requestBody,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Permanent address saved successfully:", response.data);
        setShowPopup(false);
        handleSecond();
      } catch (error) {
        console.error("Error saving permanent address:", error);
        toast.error("kindly recheck the Form");
        if (error.response) {
          console.log("Server response error:", error.response.data);
        }
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        PermanentAddress: {
          hno: "",
          street: "",
          village: "",
          town: "",
          district: "",
          state: "",
          country: "",
          pincode: "",
        },
      }));
      setSecond(false);
    }
  };

  useEffect(() => {
    const fetchCurrentDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `hrmsapplication/location/${employeeId}`
        );

        const data = response.data;
        if (data.presentadress) {
          handleSave(data.presentadress);
        } else {
          setSave(false);
        }

        if (data.permanentadress) {
          handleSecond(data.permanentadress);
        } else {
          setSecond(false);
        }

        if (data.officeaddress) {
          handleThird(data.officeaddress);
        } else {
          setThird(false);
        }
        setFormData({
          PresentAddress: data.presentadress
            ? {
              hno: data.presentadress?.houseNumber,
              street: data.presentadress?.street,
              village: data.presentadress?.village,
              town: data.presentadress.town,
              district: data.presentadress.district,
              state: data.presentadress.state,
              country: data.presentadress.country,
              pincode: data.presentadress.pincode,
            }
            : {},
          PermanentAddress: data.permanentadress
            ? {
              hno: data.permanentadress.houseNumber,
              street: data.permanentadress.street,
              village: data.permanentadress.village,
              town: data.permanentadress.town,
              district: data.permanentadress.district,
              state: data.permanentadress.state,
              country: data.permanentadress.country,
              pincode: data.permanentadress.pincode,
            }
            : {},
          OfficeAddress: data.officeaddress
            ? {
              buildingNameFloor: data.officeaddress.buildingNameFloor,
              street: data.officeaddress.street,
              village: data.officeaddress.village,
              town: data.officeaddress.town,
              district: data.officeaddress.district,
              state: data.officeaddress.state,
              country: data.officeaddress.country,
              pincode: data.officeaddress.pincode,
            }
            : {},
        });
        console.log("Feteched data:", data);
        if (data.permanentadress === null) {
          setIsPermAddressNull(true);
        }
        if (data.presentadress === null) {
          setIsPresentAddressNull(true);
        }
        if (data.officeaddress === null) {
          setIsOfficeAddressNull(true);
        }
      } catch (error) {
        console.error("Error fetching Current Experience Details:", error);
        toast.error("kindly recheck the Form");
      }
    };
    fetchCurrentDetails();
  }, [employeeId]);
  return (
    <>
      <div className="col-span-11 sm-text overflow-x-auto">
        <div className="flex flex-wrap items-center justify-start p-2  border-2 border-gray-800 bg-blue-950 rounded-md w-[150px] mb-3 mt-5 ml-5 ">
          <FaLessThan className="text-white mr-2" />
          <Link to={`/dashboard/${employeeId}`}>
            <button>
              <span className="font-semibold text-white">
                Previous Page
              </span>
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="p-4 border-black">
        <div className="overflow-auto mx-auto px-4 md:px-12 lg:px-40">
          <table className="min-w-full bg-white border-black border-2 border-solid rounded-t-md table-auto">
            <thead>
              <tr className="relative  border-black border-2 border-solid bg-gray-300">
                <th
                  className="py-2 px-4 border-b border-black text-left"
                  colSpan="8"
                >
                  Present Address
                  {userRole === "ROLE_ADMIN" && (
                    <span
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-black/10 p-1 rounded"
                      onClick={() => handleEdit("PresentAddress")}
                    >
                      <BsPencilSquare />
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-2 px-4 border-black border-2 border-solidz">
                  H.No
                </th>
                <th className="py-2 px-4   border-black border-2 border-solid">
                  Street
                </th>
                <th className="py-2 px-4   border-black border-2 border-solid">
                  Village
                </th>
                <th className="py-2 px-4   border-black border-2 border-solid">
                  Town
                </th>
                <th className="py-2 px-4   border-black border-2 border-solid">
                  District
                </th>
                <th className="py-2 px-4   border-black border-2 border-solid">
                  State
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Country
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Pincode
                </th>
              </tr>
              {save && (
                <tr>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.hno}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.street}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.village}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.town}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.district}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.state}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.country}
                  </td>
                  <td className="py-2 px-4  border-black border-2 text-center overflow-x-auto max-w-[50px] ">
                    {formData.PresentAddress.pincode}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {userRole === "ROLE_ADMIN" && (
            <div>
              <input type="checkbox" onChange={changeaddress} />
              <label className="text-1xl ml-1">
                Permanent Address same as Present Address
              </label>
            </div>
          )}
          <table className="min-w-full bg-white border-collapse border mt-4 border-black  border-solid">
            <thead>
              <tr className="relative  border-black border-2 border-solid bg-gray-300">
                <th
                  className="py-2 px-4 border-b border-black  text-left"
                  colSpan="8"
                >
                  Permanent Address
                  {userRole === "ROLE_ADMIN" && (
                    <span
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-black/10 p-1 rounded"
                      onClick={() => handleEdit("PermanentAddress")}
                    >
                      <BsPencilSquare />
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  {" "}
                  H.No
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Street
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Village
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Town
                </th>
                <th className="py-2 px-4 border-black border-2 border-solid">
                  District
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  State
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Country
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Pincode
                </th>
              </tr>
              {second && (
                <tr>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.hno}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.street}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.village}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.town}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.district}
                  </td>
                  <td className="py-2 px-4 text-center  border-black border-2 border-solid max-w-[50px]  overflow-x-auto ">
                    {formData.PermanentAddress.state}
                  </td>
                  <td className="py-2 px-4 text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.country}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.PermanentAddress.pincode}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <table className="min-w-full bg-white border-collapse border  mt-4 border-black  border-solid">
            <thead>
              <tr className="relative  border-black border-2 border-solid bg-gray-300">
                <th
                  className="py-2 px-4 border-b border-black text-left"
                  colSpan="8"
                >
                  Office Address
                  {userRole === "ROLE_ADMIN" && (
                    <span
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-black/10 p-1 rounded"
                      onClick={() => handleEdit("OfficeAddress")}
                    >
                      <BsPencilSquare />
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  {" "}
                  B.Na
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Street
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Village
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Town
                </th>
                <th className="py-2 px-4 border-black border-2 border-solid">
                  District
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  State
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Country
                </th>
                <th className="py-2 px-4  border-black border-2 border-solid">
                  Pincode
                </th>
              </tr>
              {third && (
                <tr>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.buildingNameFloor}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.street}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.village}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.town}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.district}
                  </td>
                  <td className="py-2 px-4 text-center  border-black border-2 border-solid max-w-[50px]  overflow-x-auto ">
                    {formData.OfficeAddress.state}
                  </td>
                  <td className="py-2 px-4 text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.country}
                  </td>
                  <td className="py-2 px-4  text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] ">
                    {formData.OfficeAddress.pincode}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto ">
            <div className="flex justify-between items-center mb-4 bg-blue-950 rounded-lg pl-2 pr-2 w-full p-2  top-0 z-10">
              <h2 className="text-xl text-white w-full">
                Edit {currentAddressType.replace("Address", "")} Address
              </h2>
              <button
                onClick={togglePopup}
                className="text-white rounded-full p-1 ml-2"
              >
                <MdCancelPresentation size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
                {/* H.No or Building Name */}
                <div className="col-span-1">
                  <label
                    className="block mb-1 font-medium"
                    htmlFor={
                      currentAddressType === "OfficeAddress"
                        ? "buildingNameFloor"
                        : "hno"
                    }
                  >
                    {currentAddressType === "OfficeAddress" ? "Building Name" : "H.NO"}
                  </label>
                  <input
                    type="text"
                    id={
                      currentAddressType === "OfficeAddress"
                        ? "buildingNameFloor"
                        : "hno"
                    }
                    name={
                      currentAddressType === "OfficeAddress"
                        ? "buildingNameFloor"
                        : "hno"
                    }
                    value={
                      currentAddressType === "OfficeAddress"
                        ? addressData.buildingNameFloor || ""
                        : addressData.hno
                    }
                    onChange={handleChange}
                    onKeyDown={
                      currentAddressType !== "OfficeAddress" ? handleNameChar : undefined
                    }
                    maxLength={40}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {currentAddressType === "OfficeAddress"
                    ? errors.buildingNameFloor && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.buildingNameFloor}
                      </p>
                    )
                    : errors.hno && (
                      <p className="text-red-500 text-sm mt-1">{errors.hno}</p>
                    )}
                </div>

                {/* Street */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="street">
                    Street
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={addressData.street}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                {/* Village */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="village">
                    Village
                  </label>
                  <input
                    type="text"
                    id="village"
                    name="village"
                    value={addressData.village}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.village && (
                    <p className="text-red-500 text-sm mt-1">{errors.village}</p>
                  )}
                </div>

                {/* Town */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="town">
                    Town
                  </label>
                  <input
                    type="text"
                    id="town"
                    name="town"
                    value={addressData.town}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={20}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.town && (
                    <p className="text-red-500 text-sm mt-1">{errors.town}</p>
                  )}
                </div>

                {/* District */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="district">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={addressData.district}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                  )}
                </div>

                {/* State */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="state">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                {/* Country */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="country">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={addressData.country}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                {/* Pincode */}
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="pincode">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={addressData.pincode}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={6}
                    onKeyDown={handleNameChar}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={togglePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </>
  );
}
export default Location;
