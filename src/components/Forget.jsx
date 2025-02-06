import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Popup = () => {
  const [inputValue, setInputValue] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [hidePassword, setHidePassword] = useState(false);
  const [otp, setOtp] = useState(false); // Controls OTP display
  const [timer, setTimer] = useState(60); // Timer for OTP resend
  const [canResendOtp, setCanResendOtp] = useState(false); // Controls Resend OTP button
  const navigate = useNavigate();

  //   const togglePasswordVisibility=()=>{
  //     setHidePassword(!hidePassword);
  //   }

  const toggleCreatePasswordVisibility = () => {
    setShowCreatePassword(!showCreatePassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Timer countdown effect
  useEffect(() => {
    let countdown;
    if (otp && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      setCanResendOtp(true);
    }
    return () => clearInterval(countdown);
  }, [otp, timer]);

  const validateEmail = (email) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      Symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const validatePasswords = () => {
    let passwordErrors = {};
    if (createPassword.length < 8) {
      passwordErrors.createPassword =
        "Password must be at least 8 characters long";
    } else if (!validatePasswordStrength(createPassword)) {
      passwordErrors.createPassword =
        "Password must include uppercase, lowercase letters, and numbers";
    }
    if (createPassword !== confirmPassword) {
      passwordErrors.confirmPassword = "Passwords do not match";
    }
    return passwordErrors;
  };
  // navigate to SuccessPage
  const handleClick = () => {
    navigate("/SuccessPage");
  };

  const handleVerify = () => {
    if (!validateEmail(inputValue)) {
      setErrors({ email: "Please enter a valid email address" });
    } else {
      setErrors({});
      console.log("Verified: ", inputValue);
      setOtp(true); // Simulate OTP being sent and display OTP fields
      setTimer(60); // Start the 60-second timera
      setCanResendOtp(false); // Disable resend option until timer runs out
    }
  };

  const handleResendOtp = () => {
    console.log("OTP resent to: ", inputValue);
    setTimer(60); // Reset the timer to 60 seconds
    setCanResendOtp(false); // Disable resend button until timer runs out again
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordErrors = validatePasswords();

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
    } else if (!validateEmail(inputValue)) {
      setErrors({ email: "Please enter a valid email address" });
    } else {
      setErrors({});
      // Handle form submission
      console.log("Form Submitted with:", {
        inputValue,
        createPassword,
        confirmPassword,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="containers bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-500">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* {/ Email Input /} */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Email id or number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={handleVerify}
                className="bg-green-500 text-white py-2 px-4 rounded-2xl h-[40px] w-[70px]  hover:bg-green-400 focus:outline-none"
                disabled={otp && !canResendOtp} // Disable during OTP verification
              >
                Verify
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* {/ OTP Input (only displayed if OTP is triggered) /} */}
          {otp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength="6"
                  className="w-[50%] h-[50px] outline-none rounded-xl bg-green-500 text-white text-center"
                />
              </div>
              {/* {/ Timer display /} */}
              {timer > 0 ? (
                <p className="text-sm text-green-500 mt-2">
                  Resend OTP in {timer} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-slate-50 hover:underline mt-2  rounded-lg p-2  bg-yellow-500"
                  disabled={!canResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}

          {/* {/ Password Creation Input /} */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showCreatePassword ? "password" : "text"}
                placeholder="Create a new password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                maxLength={10}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              {errors.createPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.createPassword}
                </p>
              )}
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-600"
                onClick={toggleCreatePasswordVisibility}
              >
                {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {createPassword && (
              <span className="text-green-500 space-y-2">
                {/* {/ Password Strength /} */}
                <div className="flex items-center">
                  {createPassword.length >= 8 &&
                  /[A-Z]/.test(createPassword) &&
                  /\d/.test(createPassword) &&
                  /[!@#$%^&*(),.?":{}|<>]/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-gray-300" />
                  )}
                  <p>
                    Password strength:
                    {createPassword.length < 8 ||
                    !/[A-Z]/.test(createPassword) ||
                    !/\d/.test(createPassword) ||
                    !/[!@#$%^&*(),.?":{}|<>]/.test(createPassword)
                      ? " weak"
                      : " strong"}
                  </p>
                </div>

                {/* {/ Length Validation /} */}
                <div className="flex items-center">
                  {createPassword.length >= 8 ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-gray-300" />
                  )}
                  <p>Password must be at least 8 characters long</p>
                </div>

                {/* {/ Uppercase Letter Validation /} */}
                <div className="flex items-center">
                  {/[A-Z]/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-gray-300" />
                  )}
                  <p>Contains uppercase letters</p>
                </div>

                {/* {/ Number Validation /} */}
                <div className="flex items-center">
                  {/\d/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-gray-300" />
                  )}
                  <p>Contains numbers</p>
                </div>

                {/* {/ Symbol Validation /} */}
                <div className="flex items-center">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-gray-300" />
                  )}
                  <p>Contains symbols</p>
                </div>
              </span>
            )}
          </div>

          {/* {/ Confirm Password Input /} */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                maxLength={10}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* {/ Submit Button /} */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>

          {/* {/ Link to Login /} */}
          <div className="text-center mt-4">
            <p>
              Back to{" "}
              <Link
                to="/login"
                className="text-green-500 hover:text-green-700"
                onClick={handleClick}
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
