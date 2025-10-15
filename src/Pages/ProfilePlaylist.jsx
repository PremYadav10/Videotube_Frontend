import React, { useEffect, useState } from 'react';
import useAxios from '../Utils/useAxios.jsx'; 
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom';
import { FaPlus, FaListAlt, FaLock } from 'react-icons/fa'; // Added FaLock
import convertIsoToSimpleDate from "../Utils/formateDuration"


function PlaylistsPage() { 
    // 1. Get Login Status
    const isLoggedIn = useSelector((state) => state.user.status);
    const currentUser = useSelector((state) => state.user.userData);
    
    // Check for essential data access (assuming user object exists when logged in)
    const userId = currentUser?.user?._id;

    const { sendRequest } = useAxios();
    const [playlistData, setPlaylistData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    // Get user playlist
    const getPlaylists = async () => {
        setLoading(true);
        setError(null);
        try {
            // Safety check: ensure userId is available before API call
            if (!userId) {
                // This shouldn't happen if isLoggedIn is true, but good practice
                throw new Error("User ID is unavailable."); 
            }
            
            const res = await sendRequest({ method: "get", url: `/playlist/user/${userId}` })
            console.log("response :", res);
            setPlaylistData(res.data)
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
            // Set a user-friendly error message
            setError("Failed to load playlists. Check your network or permissions."); 
            setPlaylistData([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 2. Only fetch data if the user is logged in
        if (isLoggedIn) {
            getPlaylists();
        } else {
            // If logged out, stop loading and clear data/error (ready for prompt)
            setLoading(false);
            setPlaylistData(null); 
            setError(null);
        }
        // Depend on isLoggedIn and userId to trigger refetching only when status changes
    }, [isLoggedIn, userId]); 

    // --- Conditional Rendering ---
    
    // 3. Case: Not Logged In (The required UI)
    if (!isLoggedIn) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaLock className='w-16 h-16 text-red-500 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-3'>Login to Manage Playlists</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>
                    Please sign in to create, edit, and view your personal video collections.
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
    if (loading) {
        return (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading your playlists...
            </div>
        );
    }
    
    // 5. Case: Error (Only runs if isLoggedIn is true and API failed)
    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    }

    // 6. Case: Logged In but Empty Data
    if (playlistData && playlistData.length === 0) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaListAlt className='w-12 h-12 text-gray-400 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>No Playlists Found</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>It looks like you haven't created any playlists yet.</p>
                <button className="flex flex-row items-center bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition duration-300 gap-1 cursor-pointer">
                    <FaPlus className='w-4 h-4' /> Create New Playlist
                </button>
            </div>
        );
    }

    // --- Main Content Rendering (if logged in and data exists) ---
    return (
        <div className='w-full text-gray-900 dark:text-white'>
            <div className='flex justify-between items-center mb-6 border-b pb-4'>
                <h1 className='text-2xl font-bold'>Your Playlists ({playlistData.length})</h1>
                <button className="flex flex-row items-center bg-blue-600 text-white p-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 gap-1 cursor-pointer text-sm">
                    <FaPlus /> Create New Playlist
                </button>
            </div>
            
            {/* Playlist Cards Grid/List */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {/* Note: Added safety check (playlist.videos?.length) for the count overlay */}
                {playlistData.map((playlist) => (
                    <div 
                        key={playlist._id} 
                        className='flex flex-col rounded-xl overflow-hidden shadow-lg dark:bg-gray-800 hover:shadow-xl transition duration-300 transform hover:scale-[1.02]'
                    >
                        {/* Video Thumbnail Section */}
                        <div className='w-full aspect-video overflow-hidden relative'>
                            <Link to={`/playlist/${playlist._id}`}> 
                                <img 
                                    className='w-full h-full object-cover transition duration-300 hover:opacity-80' 
                                    src={playlist.firstVideoThumbnail || 'https://via.placeholder.com/200x112/333333/ffffff?text=Playlist'} 
                                    alt="Playlist Thumbnail" 
                                /> 
                            </Link>
                            {/* Overlay for video count */}
                            <div className='absolute bottom-0 right-0 bg-black bg-opacity-70 text-white p-1 text-xs rounded-tl-lg'>
                                {playlist.videos?.length || 0} videos
                            </div>
                        </div>

                        {/* Playlist Details Section */}
                        <div className='flex flex-col p-3'>
                            <h3 className='text-base font-semibold line-clamp-2 text-gray-900 dark:text-white'>{playlist.name}</h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1'>
                                {playlist.description || 'No description available.'}
                            </p>
                            <div className='flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2'>
                                <Link to={`/playlist/${playlist._id}`} className='text-blue-500 hover:text-blue-600 font-medium'>
                                    View Full Playlist
                                </Link>
                                <span>{convertIsoToSimpleDate(playlist.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlaylistsPage;