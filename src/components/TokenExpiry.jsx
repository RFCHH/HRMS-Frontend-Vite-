import axios from 'axios';
import React, { useEffect, useState } from 'react';


const TokenExpiredPopup = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const intervalForSession = setInterval(validateTokenExpiry,  5000)
        return () => clearInterval(intervalForSession)
    })

    const validateTokenExpiry = () => {
        console.log('these method has called');
        
        const expiryTimeFromLocal = localStorage.getItem('TokenExpiry');
        const currentTime = new Date().getTime();
        if (expiryTimeFromLocal && currentTime >= expiryTimeFromLocal) {
            setIsPopupOpen(true);
        }
    }

    const closeModal = () => {
        setIsPopupOpen(false);
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

    const getFreshToken = async () => {
        try {
            const refreshToken = getCookie('refreshToken');
            console.log("Refresh token:", refreshToken);
            const response = await axios.post('hrms-application-a6vr.onrender.com/hrmsapplication/authentication/refreshToken', {
            // const response = await axios.post('hrmsapplication/authentication/refreshToken', {
                refreshToken,
                employeeId: localStorage.getItem('EmpId')
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
            });
            console.log(response);

        } catch (error) {
            console.log(error);

        }
    };


    if (!isPopupOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Session Expired</h2>
                <p>Your session has expired. Would you like to continue?</p>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={getFreshToken}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Continue
                    </button>
                    <button
                        onClick={closeModal}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenExpiredPopup;