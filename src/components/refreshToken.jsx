// // src/refreshToken.js

// import axios from 'axios';

// export const refreshToken = async () => {
//   try {
//     const response = await axios.post('http://192.168.0.245:8080/hrmsapplication/authentication/refreshToken', {}, {
//       withCredentials: true, // Send cookies
//     });

//     if (response.status === 200) {
//       const { accessToken } = response.data;
//       return accessToken;
//     } else {
//       console.error('Failed to refresh token:', response);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     return null;
//   }
// };


// src/refreshToken.js
// import axiosInstance from './axiosConfig';

// export const refreshToken = async () => {
//   try {
//     // Since the refresh token is in an HttpOnly cookie, you don't need to send it manually
//     const response = await axiosInstance.post('https://hrms-render-cloud.onrender.com/hrmsapplication/authentication/refreshToken');
//     const { accessToken } = response.data;
//     localStorage.setItem('accessToken', accessToken);
//     return accessToken;
//   } catch (error) {
//     console.error('Token refresh failed', error);
//     // Optionally, you can dispatch a logout action or redirect to login
//     window.location.href = '/';
//     return null;
//   }
// };
