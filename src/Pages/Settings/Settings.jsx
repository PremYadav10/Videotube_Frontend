import React from 'react';
import { FaUser, FaLock, FaImage, FaCamera } from 'react-icons/fa6'; 
import { AiOutlineArrowRight } from 'react-icons/ai'; 
import { FaUserCircle, FaSignInAlt } from 'react-icons/fa'; // For the login prompt
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


// --- User Profile Header Sub-Component (No changes needed) ---

const UserProfileHeader = ({ user, navigate }) => {
    return (
        <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Cover Image */}
            <div 
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${user.coverImage})` }}
            >
                {/* Optional: Add a subtle overlay for better text contrast */}
                <div className="absolute inset-0 bg-black opacity-30"></div>
            </div>

            {/* Avatar and Info */}
            <div className="relative p-4 pt-0 -mt-16 sm:p-6 sm:pt-0 sm:-mt-20">
                <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-xl"
                />
                <div className="mt-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.fullName}
                    </h2>
                    <p className="text-md text-gray-500 dark:text-gray-400">
                        @{user.username}
                    </p>
                    {/* Direct link to profile picture sub-component */}
                    <button 
                        onClick={() => navigate('profile-picture')}
                        className="mt-2 text-blue-500 text-sm hover:text-blue-600 transition duration-150"
                    >
                        Change Profile Picture
                    </button>
                </div>
            </div>
        </div>
    );
};

// ------------------------------------------

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const currentUserData = useSelector((state) => state.user.userData);
    const currentUser = currentUserData?.user;
    const isLoggedIn = useSelector((state) => state.user.status);


     if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-500 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl text-center">
                    <FaSignInAlt className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        Access to Account Settings requires authentication.
                    </p>
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white py-2 px-8 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }
    
    // Check if the current path is exactly '/settings' (no child route active)
    const isMainSettingsPage = location.pathname === '/settings' || location.pathname === '/settings/';

    // Define all navigation points based on your relative route structure
    const settingOptions = [
        {
            title: "Update Account Details",
            description: "Change your email, and full name.",
            Icon: FaUser, 
            onClick: () => navigate("update-account-details"), // Relative navigation
        },
        {
            title: "Change Password",
            description: "Update your current password for security.",
            Icon: FaLock, 
            onClick: () => navigate("change-password"), // Relative navigation
        },
        {
            title: "Update Profile Picture",
            description: "Upload a new avatar or profile image.",
            Icon: FaImage, 
            onClick: () => navigate("profile-picture"), // Relative navigation
        },
        {
            title: "Update Channel Cover Image",
            description: "Change your channel's main banner/cover photo.",
            Icon: FaCamera, 
            onClick: () => navigate("cover-image"), // Relative navigation
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl">
                
                {/* 1. Profile Header - Always visible */}
                <UserProfileHeader user={currentUser} navigate={navigate} />

                {/* 2. Main Title */}
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b pb-4">
                    Account Settings
                </h1>
                
                {/* 3. Conditional Content */}
                
                {/* If on a sub-route, the Outlet renders the sub-component (e.g., UpdateAccountDetails) */}
                {/* The sub-component ITSELF will contain the "Go Back" button at its top. */}
                {!isMainSettingsPage && (
                    <div className="setting-details-area mb-8">
                        <Outlet />
                    </div>
                )}
                

                {/* If on the main /settings page, render the menu list */}
                {isMainSettingsPage && (
                    <div className="space-y-4">
                        {settingOptions.map((option) => (
                            <div
                                key={option.title}
                                className="
                                    flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md 
                                    hover:shadow-lg transition duration-200 cursor-pointer border-l-4 border-blue-500 
                                    transform hover:scale-[1.01]
                                "
                                onClick={option.onClick} 
                            >
                                <div className="flex items-center space-x-4">
                                    <option.Icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {option.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                                <AiOutlineArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                        ))}
                    </div>
                )}


                {/* 4. Deactivate Account Button (Always at the bottom) */}
                <div className={`mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 ${!isMainSettingsPage ? 'mt-0' : ''}`}>
                   <Link to="/logout">
                    <button 
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition font-semibold"
                    >
                        Signout Acoount
                    </button>
                   </Link> 
                </div>
            </div>
        </div>
    );
};

export default Settings;