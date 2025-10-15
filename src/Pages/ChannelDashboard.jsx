import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaVideo, FaUsers, FaUserFriends } from 'react-icons/fa'; 
import useAxios from '../Utils/useAxios'; 
import { useSelector } from 'react-redux'; 

const ChannelDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.user.userData); 
    
   

    const tabBaseClass = "py-3 px-6 text-lg font-semibold border-b-2 transition duration-200";
    const activeTabClass = "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400";
    const inactiveTabClass = "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500";



    useEffect(() => {
        // Redirect to default tab: 'stats'
        if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
            navigate("stats", { replace: true });
        }
    }, [navigate, location.pathname]);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl">
                
                {/* 1. Channel Header (No redundant stats here) */}
                <div 
                    className="relative w-full h-48 bg-cover bg-center rounded-xl overflow-hidden shadow-2xl"
                    style={{ backgroundImage: `url(${currentUser.user.coverImage})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute inset-0 p-6 flex items-end">
                        <div className="flex items-center space-x-4">
                            <img
                                src={currentUser.user.avatar}
                                alt="Channel Avatar"
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-xl"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    {currentUser.user.fullname}
                                </h1>
                                <p className="text-md text-gray-300">
                                    @{currentUser.user.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- REMOVED REDUNDANT STAT CARD GRID HERE --- */}
                

                {/* 2. Tab Navigation - ADDED SUBSCRIBERS TAB */}
                <nav className="flex space-x-6 border-b border-gray-300 dark:border-gray-700 mt-8 -mb-px">
                    <NavLink
                        to="stats"
                        className={({ isActive }) => 
                            `${tabBaseClass} ${isActive ? activeTabClass : inactiveTabClass}`
                        }
                    >
                        <FaChartLine className="w-5 h-5" />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="videos"
                        className={({ isActive }) => 
                            `${tabBaseClass} ${isActive ? activeTabClass : inactiveTabClass}`
                        }
                    >
                        <FaVideo className="w-5 h-5" />
                        <span>Your Content</span>
                    </NavLink>
                    <NavLink
                        to="subscribers" // <-- NEW TAB
                        className={({ isActive }) => 
                            `${tabBaseClass} ${isActive ? activeTabClass : inactiveTabClass}`
                        }
                    >
                        <FaUserFriends className="w-5 h-5" />
                        <span>Subscribers</span>
                    </NavLink>
                </nav>

                {/* 3. Tab Content Area (Outlet context remains the same) */}
                <div className="mt-8">
                    <Outlet />
                </div>
                
            </div>
        </div>
    );
};

export default ChannelDashboard;