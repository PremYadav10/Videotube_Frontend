import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaLock } from 'react-icons/fa6'; 
import useAxios from '../../Utils/useAxios';
// import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa6'; // Uncomment for icons

const ChangePasswordForm = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {sendRequest} = useAxios()
    
    // UI states for feedback
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' }); // { type: 'success'|'error'|'info', text: '...' }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' }); // Clear previous messages

        // 1. Client-Side Validation: Check if new passwords match
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New password and confirm password do not match!' });
            return;
        }

        // 2. Client-Side Validation: Basic password strength check (optional but recommended)
        if (newPassword.length < 8) {
             setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
             return;
        }

        setIsLoading(true);
        
         try {
            console.log("inside try print event",e);
            console.log("oldPassword", e.target.oldPassword.value,
                  "newPassword", e.target.newPassword.value);
            
            
              const res = await sendRequest({
                url: "/users/change-password",
                method: "POST",
                body: {
                  oldPassword: e.target.oldPassword.value,
                  newPassword: e.target.newPassword.value
                },
              });

              console.log(res);
            
        
              console.log("/update-pass", res);
              setMessage({
                type: "success",
                text: "Password updated successfully! ✅",
              });

            } catch (error) {
              console.error("Error while updating user:", error);
              setMessage({
                type: "error",
                text: "Something went wrong. Please try again.",
              });
            }
    };

    const getMessageStyle = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-400 dark:bg-green-900 dark:text-green-300';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-400 dark:bg-red-900 dark:text-red-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'hidden';
        }
    };
    
    // Function to navigate back to the parent route (/settings)
    const handleGoBack = () => {
        navigate('..'); // Navigates up one level in the route hierarchy
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-auto mb-8 border border-gray-200 dark:border-gray-700">
            
            {/* Top Bar with Back Button */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <FaLock className="w-6 h-6 text-gray-400" />
                    <span>Change Password</span>
                </h3>
                <button 
                    onClick={handleGoBack}
                    className="flex items-center text-gray-500 hover:text-blue-600 transition duration-150 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Back to Settings"
                >
                    <FaChevronLeft className="w-5 h-5" />
                </button>
            </div>
            
            {/* Feedback Message */}
            {message.text && (
                <div className={`p-3 mb-6 border rounded-md ${getMessageStyle(message.type)}`}>
                    <p className="flex items-center space-x-2">
                        {/* Add icons here if using FaCheckCircle/FaExclamationCircle */}
                        <span>{message.text}</span>
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Old Password Field (Security Check) */}
                <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current/Old Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter your current password"
                    />
                </div>

                {/* 2. New Password Field */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter a new password (min 8 characters)"
                    />
                </div>
                
                {/* 3. Confirm New Password Field */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Confirm your new password"
                    />
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-500 transition duration-150 mt-8"
                >
                    {isLoading ? (
                        "Updating Password..."
                    ) : (
                        "Change Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;