import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaHistory } from 'react-icons/fa'; // Ensure FaHistory is imported
import useAxios from '../Utils/useAxios'; 

// MOCK UTILS/DATA (Add any needed mock data structures here)
// Example Mock History Item structure (needed for rendering later)
// const mockHistoryItem = { 
//     id: 1, title: "Video 1: React State", channel: "DevChannel", 
//     thumbnail: "https://via.placeholder.com/150", views: "10K" 
// };
// END MOCK

const HistoryPage = () => {
    // Check Redux status to determine if the user is logged in
    const isLoggedIn = useSelector((state) => state.user.status);
    const { sendRequest } = useAxios(); 

    const [historyItems, setHistoryItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // NOTE: If the user is logged out, the backend should return an empty array or handle the optional auth gracefully.
            const res = await sendRequest({
                method: "get",
                url: "/users/history" // Your API route for history
            });
            
            // Assuming res.data contains the array of videos
            setHistoryItems(res.data);
            
        } catch (err) {
            console.error("Error fetching history:", err);
            // This error handler is for network/server failures when the user IS logged in.
            setError("Failed to load history. Please try again.");
            setHistoryItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 2. Only fetch history if the user is logged in
        if (isLoggedIn) {
            fetchHistory();
        } else {
            // 3. If logged out, set state to show the prompt UI
            setLoading(false); 
            setHistoryItems(null); // Set to null to ensure we hit the prompt, not the empty array state
            setError(null);
        }
    }, [isLoggedIn, sendRequest]); // Re-run effect when login status changes

    // --- Conditional Rendering ---
    
    // 4. Case: Not Logged In (Show Login Prompt)
    if (!isLoggedIn) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
                <FaUserCircle className='w-16 h-16 text-blue-500 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-3'>Login to Track Your History</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>
                    Sign in to save videos you watch and easily find them here later.
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
    
    // 5. Case: Loading (Only runs if isLoggedIn is true)
    if (loading || historyItems === null) {
        return (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading your watch history...
            </div>
        );
    }

    // 6. Case: API Error (Only runs if isLoggedIn is true and fetch failed)
    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    }

    // 7. Case: Logged In but Empty History (historyItems is an empty array)
    if (historyItems.length === 0) {
        return ( 
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <FaHistory className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>No Watch History</h1>
                <p>You haven't watched any videos yet. Start watching now!</p>
            </div>
        );
    }

    // 8. Case: Logged In and History Available (Main Content)
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b pb-2">Watch History ({historyItems.length})</h2>
            
            <div className="flex justify-end">
                <button className="text-sm text-red-500 hover:text-red-700 font-medium">
                    Clear All Watch History
                </button>
            </div>
            
            {/* List Rendering */}
            {historyItems.map((video) => (
                <div key={video.id} className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition duration-200">
                    <img src={video.thumbnail || 'https://via.placeholder.com/150'} alt={video.title} className="w-40 h-24 object-cover rounded-md flex-shrink-0" />
                    <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{video.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.channel}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{video.views} views</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;