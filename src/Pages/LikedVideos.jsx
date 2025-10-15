import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaLock } from 'react-icons/fa'; // Added FaLock
import useAxios from '../Utils/useAxios.jsx'; 



function LikedVideosPage() {
    const isLoggedIn = useSelector((state) => state.user.status);
    const currentUser = useSelector((state) => state.user.userData);
    const dispatch = useDispatch()
    const likedVideos = useSelector((state) => state.likedVideos.likedVideoIds)


    // --- Conditional Rendering ---

    // 3. Case: Not Logged In (Show Login Prompt)
    if (!isLoggedIn) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaLock className='w-16 h-16 text-red-500 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-3'>Login to Access Liked Videos</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>
                    Please sign in to save your favorite videos and view them here.
                </p>
                <Link 
                    to="/login" 
                    className="bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 transition"
                >
                    Sign In
                </Link>
            </div>
        );
    }
    
    // 4. Case: Loading (Only runs if isLoggedIn is true)
    if ( likedVideos === null) {
        return (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading your favorite videos...
            </div>
        );
    }

    // 5. Case: Error (Only runs if fetch failed while logged in)
    // if (error) {
    //     return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    // }

    // 6. Case: Logged In but Empty Data
    if (likedVideos.length === 0) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaThumbsUp className='w-12 h-12 text-gray-400 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>No Videos Liked Yet</h1>
                <p className='text-gray-500 dark:text-gray-400'>Click the "Like" button on a video to save it here!</p>
            </div>
        );
    }

    // --- Main Content Rendering (List of Liked Videos) ---
    return (
        <div className='w-full text-gray-900 dark:text-white'>
            <div className='flex justify-between items-center mb-6 border-b pb-4'>
                <h1 className='text-2xl font-bold'>Liked Videos ({likedVideos.length})</h1>
            </div>
            
            <div className="space-y-4">
                {likedVideos.map((data) => (
                    <div 
                        key={data._id} 
                        className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition duration-200"
                    >
                        {/* ... Video Card Content remains the same ... */}
                        <div className="relative w-40 h-24 flex-shrink-0">
                            <Link to={`/video/${data.video._id}`}>
                                <img 
                                    src={data.video.thumbnail} 
                                    alt={data.video.title} 
                                    className="w-full h-full object-cover rounded-md" 
                                />
                                {/* <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                                    {data.video.duration}
                                </span> */}
                            </Link>
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                            <Link to={`/video/${data.video._id}`} className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white hover:text-blue-500">
                                {data.video.title}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.video.description}</p>
                            {/* <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                <span>{data.video.views} views</span>
                                <span className="mx-1">•</span>
                                <span>{data.video.uploaded}</span>
                            </div> */}
                        </div>

                        <button className="text-gray-400 hover:text-red-500 transition duration-150 p-2 flex-shrink-0">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LikedVideosPage;