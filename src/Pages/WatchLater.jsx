import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux'; // Import useSelector
import { Link } from 'react-router-dom';
import { FaClock, FaListOl, FaLock } from 'react-icons/fa'; // Added FaLock icon

// MOCK UTILS/HOOKS/DATA (Replace these with your actual imports/logic)
const useAxios = () => ({
    sendRequest: async ({ method, url }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (url.includes('user/watch-later')) {
            return {
                data: [
                    { 
                        _id: 'v201', title: 'Advanced Redux Toolkit Patterns', channelName: 'StateMaster', 
                        thumbnail: 'https://via.placeholder.com/200x112/5733FF/ffffff?text=Redux', 
                        views: '22K', duration: '25:00', added: '2 days ago' 
                    },
                    { 
                        _id: 'v202', title: 'MongoDB Indexing Deep Dive', channelName: 'DataGeek', 
                        thumbnail: 'https://via.placeholder.com/200x112/33FFAB/ffffff?text=Mongo', 
                        views: '15K', duration: '18:40', added: '5 days ago' 
                    },
                ]
            };
        }
        return { data: [] };
    }
});
const useSelector = (selector) => {
    // MOCK: Simulate Redux state access
    if (selector.toString().includes('state.user.status')) return false; // Change to false to test logged out state
    return { user: { _id: 'mock-id' } };
};
// END MOCK

function WatchLaterPage() {
    // 1. Get Login Status
    const isLoggedIn = useSelector((state) => state.user.status);
    const currentUser = useSelector((state) => state.user.userData);

    // Ensure useAxios is called conditionally based on actual imports/setup
    const { sendRequest } = useAxios(); 
    const userId = currentUser?.user?._id; 
    
    const [watchLaterVideos, setWatchLaterVideos] = useState(null); 
    const [loading, setLoading] = useState(false); // Changed to false, only set true on fetch
    const [error, setError] = useState(null);

    // Fetch Watch Later videos on component mount
    const fetchWatchLaterVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!userId) {
                throw new Error("User ID is missing.");
            }
            
            console.log("API CALL: Fetching User Watch Later videos...");
            
            // Use your actual API call with sendRequest
            const response = await sendRequest({ method: "get", url: `/api/user/watch-later` });
            setWatchLaterVideos(response.data);

        } catch (err) {
            console.error("Failed to fetch Watch Later videos:", err);
            setError("Could not load your Watch Later list. Please check your connection.");
            setWatchLaterVideos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 2. Only fetch data if the user is logged in
        if (isLoggedIn) {
            fetchWatchLaterVideos();
        } else {
            // If logged out, stop loading and clear data/error (ready for prompt)
            setLoading(false);
            setWatchLaterVideos(null);
            setError(null);
        }
    }, [isLoggedIn, userId]);

    // --- Conditional Rendering ---
    
    // 3. Case: Not Logged In (Show Login Prompt)
    if (!isLoggedIn) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaLock className='w-16 h-16 text-red-500 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-3'>Login to Access Watch Later</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>
                    Please sign in to save videos to your Watch Later list and access them here.
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
    if (loading || watchLaterVideos === null) {
        return (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading your Watch Later list...
            </div>
        );
    }

    // 5. Case: Error
    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    }

    // 6. Case: Logged In but Empty Data
    if (watchLaterVideos.length === 0) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaClock className='w-12 h-12 text-gray-400 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>Your Watch Later List is Empty</h1>
                <p className='text-gray-500 dark:text-gray-400'>Add videos to this list to easily find them later.</p>
            </div>
        );
    }

    // --- Main Content Rendering (List of Watch Later Videos) ---
    return (
        <div className='w-full text-gray-900 dark:text-white'>
            <div className='flex justify-between items-center mb-6 border-b pb-4'>
                <h1 className='text-2xl font-bold'>Watch Later ({watchLaterVideos.length})</h1>
                <button className='text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1'>
                    <FaListOl />
                    <span>Play All</span>
                </button>
            </div>
            
            <div className="space-y-4">
                {watchLaterVideos.map((video) => (
                    <div 
                        key={video._id} 
                        className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition duration-200"
                    >
                        {/* Thumbnail and Details (No changes needed here) */}
                        <div className="relative w-40 h-24 flex-shrink-0">
                            <Link to={`/watch/${video._id}`}>
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover rounded-md" 
                                />
                                <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                                    {video.duration}
                                </span>
                            </Link>
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                            <Link to={`/watch/${video._id}`} className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white hover:text-blue-500">
                                {video.title}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.channelName}</p>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                <span>Added: {video.added}</span>
                                <span className="mx-1">•</span>
                                <span>{video.views} views</span>
                            </div>
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

export default WatchLaterPage;