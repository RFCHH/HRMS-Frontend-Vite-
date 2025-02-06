// login.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash,FaSyncAlt} from 'react-icons/fa';
import { useNavigate ,Link} from 'react-router-dom';
import Logo from '../Assests/rfchh.jpg'
import { toast } from "react-toastify";

function generateCaptcha() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}


// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }

function Login() {
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors] = useState({
    employeeIdError: '',
    passwordError: '',
    captchaError: '',
    serverError: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); 
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const handleMouseEnter = () => {
    setPasswordVisibility(true); 
  };

  const handleMouseLeave = () => {
    setPasswordVisibility(false); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: '',
      serverError: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      employeeIdError: '',
      passwordError: '',
      captchaError: '',
      serverError: '',
    });

    let hasError = false;

    if (formData.employeeId.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        employeeIdError: 'Please enter your User ID',
      }));
      hasError = true;
    }

    if (formData.password.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: 'Please enter your password',
      }));
      hasError = true;
    }

    if (captcha !== captchaInput) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        captchaError: 'Enter the correct CAPTCHA',
      }));
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const queryParams = new URLSearchParams({
      employeeId: formData.employeeId,
      password: formData.password,
    });

    setIsLoading(true);

    try {
      const response = await fetch(`https://hrms-application-oxy0.onrender.com/hrmsapplication/authentication/login?${queryParams.toString()}`, {
        method: 'POST',
        });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
      }

      if (response.ok) {
        console.log('Login successful:', data);
        // alert('Login successful');

        const { token, refreshToken ,userRole,organizationId} = data; 
        localStorage.setItem('Token', token); 
        localStorage.setItem('UserRole',userRole);
        localStorage.setItem('organizationId',organizationId);
     
        
        const EmpId = formData.employeeId;  
        sessionStorage.setItem('EmpId', EmpId );
        localStorage.setItem('EmpId', EmpId );
        console.log(EmpId)
        setCookie('refreshToken', refreshToken, 7); 
        // const tokenExpiryTimeInMillis = 10 * 60 * 1000; // 10 minutes as an example,
        // localStorage.setItem('TokenExpiry', Date.now() + tokenExpiryTimeInMillis);
        // setTimeout(refreshToken, tokenExpiryTimeInMillis - 1 * 60 * 1000); //Set a timer to refresh token proactively 1 minute before expiry
        if(userRole === 'ROLE_ADMIN'){  
          console.log('Navigating to dashboard');
          navigate("/AdminDashboard");
        }else if(userRole === 'ROLE_ONBOARDING'){
          navigate('/Onboarding/Dashboard')
        }
         else {
          console.log('navigated to employeeDashboard');
          navigate(`/userdashboard`);          
        }     
        
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          serverError: data?.message || 'Login failed. Please try again.',
        }));
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
      }
    }
    catch (error) {
      console.error("Error during login:", error);
      
      // Extract error details
      let errorMessage = "An unexpected error occurred. Please try again later.";
      
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
    
      // Show extracted error message in toast
      toast.error(errorMessage);
    
      // Optionally update state with the error
      setErrors((prevErrors) => ({
        ...prevErrors,
        serverError: errorMessage,
      }));
    }    
     finally {
      setIsLoading(false);
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setErrors((prevErrors) => ({
      ...prevErrors,
      captchaError: '',
    }));
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-neutral-100'>
      <div className='bg-white p-10 rounded-3xl shadow-lg w-full max-w-md mt-0'>
        <form onSubmit={handleSubmit}>
          <img
            src={Logo}
            alt='Logo'
            className='w-50 mb-0 mx-auto'
          />
          <h1 className='text-4xl font-bold mb-6 text-center text-orange-600'>
            Login
          </h1>
          
          {errors.serverError && (
            <div className='mb-4'>
              <p className='text-red-500 text-sm text-center'>
                {errors.serverError}
              </p>
            </div>
          )}
          <div className='mb-3 relative'>
            <label className='block text-sm font-bold mb-2 text-left'>Employee ID</label>

            <input
              type='text'
              name='employeeId'
              value={formData.employeeId}
              onChange={handleChange}
              required
              className={`w-full p-2 border ${errors.employeeIdError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.employeeIdError && (
              <p className='text-red-500 text-sm text-left mt-1'>
                {errors.employeeIdError}
              </p>
            )}
          </div>
          <div className='mb-4 relative'>
            <label className='block text-sm font-bold mb-2 text-left'>
              Password
            </label>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full p-2 border ${
                errors.passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            <div
          className='absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </div>
            {errors.passwordError && (
              <p className='text-red-500 text-sm text-left mt-1'>
                {errors.passwordError}
              </p>
            )}
             <div className="text-right mt-1">
              <Link
                to="/forgot"
                className="text-sm text-orange-500 hover:underline p-2"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className='mb-4 flex items-center'>
            <div className='bg-black text-white p-2 rounded text-xl w-32 text-center'
            onCopy={(e) => e.preventDefault()}
              style={{ userSelect: 'none' }} >
              {captcha}
            </div>
            <button
              type='button'
              onClick={handleRefreshCaptcha}
              className='p-1 ml-2'
            >
              <span><FaSyncAlt /></span>
            </button>
            <div className='flex-1 ml-2 relative'>
              <input
                type='text'
                placeholder='Enter CAPTCHA'
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.slice(0, 6))}
                required
                className={`w-full p-2 border ${
                  errors.captchaError ? 'border-red-500' : 'border-gray-300'
                } rounded-md`}
              />
              {errors.captchaError && (
                <div className='absolute bottom-0 translate-y-full'>
                  <p className='text-red-500 text-sm text-left mt-1'>
                    {errors.captchaError}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <button
            type='submit'
            className='w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 shadow-sm mt-5 mb-5'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
         
        </form>
      </div>
    </div>
  );
}

export default Login;
