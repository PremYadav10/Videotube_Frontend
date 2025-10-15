import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHistory, FaListAlt, FaThumbsUp, FaClock, FaUserCircle, FaUserPlus } from 'react-icons/fa'; 
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const profileTabs = [
    // We treat them all the same here; the child components handle the public/private logic.
    { to: "history", icon: FaHistory, label: "History" }, 
    { to: "playlists", icon: FaListAlt, label: "Playlists" },
    { to: "liked", icon: FaThumbsUp, label: "Liked Videos" },
    { to: "watch-later", icon: FaClock, label: "Watch Later" },
    { to: "subscriptions", icon: FaUserPlus, label: "Subscriptions" }, 
];

// Fallback image for logged-out state
const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQr96MqXWc6QIXHVqmLTdUBtGAFB8WnuXVXg&s";


const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Assuming currentUser is null or undefined when not logged in
    const currentUser = useSelector((state) => state.user.userData); 
    const isLoggedIn = useSelector((state) => state.user.status);

    // --- Tab-specific Checks ---
    // These are no longer needed to BLOCK the view, but they help with context
    // const currentTabPath = location.pathname.split('/').pop();
    // const currentTab = profileTabs.find(tab => tab.to === currentTabPath);
    
    // Logic to redirect from the base /profile route to the default tab
    useEffect(() => {
        if (location.pathname === '/profile' || location.pathname === '/profile/') {
            // Redirect to the default tab: History
            navigate('history', { replace: true });
        }
    }, [location.pathname, navigate]);


    const tabBaseClass = "flex items-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition duration-200";
    const activeTabClass = "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400";
    const inactiveTabClass = "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500";

    
    // --- Removed the entire "Access Restricted" IF block ---
    
    // --- Determine user details for the header ---
    // Note: Ensure currentUser.user is available when logged in.
    const userDetails = isLoggedIn 
        ? currentUser.user 
        : { fullname: 'Guest User', username: 'guest', avatar: DEFAULT_AVATAR };
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl">
                
                {/* 1. Profile Header */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700 mb-8">
                    <img
                        src={userDetails.avatar}
                        alt={`${userDetails.fullname}'s Avatar`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {userDetails.fullname}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            @{userDetails.username}
                        </p>
                        {isLoggedIn ? (
                            <NavLink to="/settings" className="text-blue-600 text-sm hover:underline mt-1 block">
                                Manage your account
                            </NavLink>
                        ) : (
                            <Link to="/login" className="text-blue-600 text-sm hover:underline mt-1 block">
                                Log in to customize
                            </Link>
                        )}
                    </div>
                </div>

                {/* 2. Tab Navigation */}
                <nav className="flex space-x-2 sm:space-x-4 border-b border-gray-200 dark:border-gray-700 -mb-px">
                    {profileTabs.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) => 
                                `${tabBaseClass} ${isActive ? activeTabClass : inactiveTabClass}`
                            }
                            end={tab.to === 'history'}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* 3. Tab Content Area - ALWAYS RENDERED */}
                <div className="mt-8">
                    {/* The child component (e.g., PlaylistsPage) will now handle its own login prompt */}
                    <Outlet />
                </div>
                
            </div>
        </div>
    );
};

export default ProfilePage;