import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaVideo } from 'react-icons/fa'; // Ensure FaVideo is imported
import useAxios from "../Utils/useAxios"; // Correct import

const ChannelVideosPage = () => {
    const { sendRequest } = useAxios(); 
    
    const [videos, setVideos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchChannelVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("API CALL: Fetching Channel Videos...");

            const response = await sendRequest({ url: '/dashboard/videos', method: 'GET' });
            console.log("response",response);
            
            setVideos(response.data);
            
        } catch (err) {
            // Note: The error is likely an Axios error here
            console.error("Failed to fetch videos:", err);
            setError("Could not load your video content.");
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Include sendRequest in dependency array because it comes from a hook
        // If useAxios ensures sendRequest is memoized (via useCallback), this is safe.
        fetchChannelVideos();
        setLoading(false)
    }, [sendRequest]); 
    
    // --- Conditional Rendering ---
    if (loading) {
        return <div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading your video content...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    }

    if (!videos || videos.length === 0) {
        return (
            <div className='p-10 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaVideo className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>No Videos Uploaded</h1>
                <p className='text-gray-500 dark:text-gray-400'>Start your channel journey by uploading your first video!</p>
                <Link to="/upload" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                    Upload Video
                </Link>
            </div>
        );
    }
    
    // ... (rest of the component code for video list) ...
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Uploaded Videos ({videos.length})</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Video</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {videos.map((video) => (
                            <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">

                                         <Link to={`/video/${video._id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2">
                                                                                    <img className="w-20 h-12 rounded mr-3 object-cover flex-shrink-0" src={video.thumbnail} alt={video.title} />
                                        </Link>
                                        <Link to={`/video/${video._id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2">
                                            {video.title}
                                        </Link>
                                        
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {video.views.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-3"
                                        onClick={() => console.log(`Edit video ${video._id}`)}
                                        title="Edit Video Metadata"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                        onClick={() => console.log(`Delete video ${video._id}`)}
                                        title="Delete Video"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChannelVideosPage;