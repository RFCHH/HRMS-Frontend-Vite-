import React, { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from '../Assests/rfchh.jpg';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom

const ForgotPassword = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValue, setOtpValue] = useState(""); // OTP value directly handled
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [timer, setTimer] = useState(300); // Timer set to 5 minutes in seconds

  const navigate = useNavigate();  // Initialize useNavigate hook

  const togglePasswordVisibility = () => {
    setShowCreatePassword(!showCreatePassword);
  };

  const togglePassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      setCanResendOtp(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // Format timer as mm:ss
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!employeeId) {
      setErrors({ employeeId: "Input cannot be empty." });
    } else {
      setErrors({});
      try {
        const response = await axios.post("https://hrms-application-oxy0.onrender.com/hrmsapplication/authentication/forgot-password", {
          employeeId: employeeId,
        });
        
        setShowMessage(true); // Show password creation form after ID verification
        setTimer(300); // Reset timer to 5 minutes
        setCanResendOtp(false);
      } catch (error) {
        console.error("Error adding the job:", error);

        // Extract error details
        let errorMessage = "Failed to add the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }

        toast.error(errorMessage); // Show extracted error in toast
      }
    }
  };

  const handleResendOtp = () => {
    setTimer(300); // Reset timer to 5 minutes
    setCanResendOtp(false);
  };

  const handleChangePassword = async () => {
    if (createPassword !== confirmPassword || createPassword.length < 8) {
      setErrors({ confirmPassword: "Passwords do not match or are too short" });
    } else {
      try {
        await axios.patch("https://hrms-application-oxy0.onrender.com/hrmsapplication/authentication/resetPassword", {
          employeeId: employeeId,
          otp: otpValue, // Send OTP here for password reset
          password: createPassword,
        });

        setShowSuccessPopup(true);
        setCreatePassword("");
        setConfirmPassword("");
      } catch (error) {
        console.error("Error adding the job:", error);

        // Extract error details
        let errorMessage = "Failed to add the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }

        toast.error(errorMessage); // Show extracted error in toast
      }
    }
  };

  // Close the success popup and navigate to the login page
  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/');  // Navigate to the login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100">
      <div className="bg-white pl-10 pr-10 p-4 rounded-3xl shadow-lg w-full max-w-md mt-0">
        <img
          src={Logo}
          alt='Logo'
          className='w-50 mb-0 mx-auto'
        />
        <h1 className="text-4xl font-bold mb-6 text-center text-orange-600">Forgot Password</h1>
        <form className="space-y-4">
          {/* Employee ID Input */}
          <div>
            <label className="block text-sm font-bold mb-2 text-left">Employee ID</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button type="button" onClick={handleVerify} className="bg-orange-600 text-white py-2 px-4 rounded-2xl h-[40px] w-[70px] focus:outline-none">
                Verify
              </button>
            </div>
            {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
          </div>

          {/* OTP and New Password Fields */}
          {showMessage && (
            <>
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">OTP</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    maxLength="6"
                    className="w-[50%] h-[50px] outline-none rounded-xl bg-gray-300 text-black text-center"
                  />
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="bg-orange-600 text-white py-2 px-6 rounded-2xl h-[40px] w-[150px] focus:outline-none flex items-center justify-center mt-2"
                    disabled={!canResendOtp}
                  >
                    Resend OTP
                  </button>
                </div>
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                {timer > 0 && <p className="bg-orange-600 text-white py-2 px-6 rounded-2xl h-[40px] w-[150px] focus:outline-none text-left mt-2 ">Resend OTP in {formatTimer()}</p>}
              </div>

              {/* Create New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Create New Password</label>
                <div className="flex space-x-2">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 focus:outline-none">
                    {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.createPassword && <p className="text-red-500 text-sm mt-1">{errors.createPassword}</p>}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="flex space-x-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                  <button type="button" onClick={togglePassword} className="text-gray-500 focus:outline-none">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Reset Password Button */}
              <button type="button" onClick={handleChangePassword} className="bg-orange-600 text-white py-2 px-4 rounded-lg w-full focus:outline-none">
                Reset Password
              </button>
            </>
          )}
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <button className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 focus:outline-none" onClick={closeSuccessPopup}>
                <ImCross />
              </button>
              <h3 className="text-xl font-bold mb-4">Password Reset Successful!</h3>
              <p>Your password has been reset successfully. You can now log in with your new password.</p>
              <button className="bg-orange-600 text-white py-2 px-4 rounded-lg mt-4 focus:outline-none" onClick={closeSuccessPopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
