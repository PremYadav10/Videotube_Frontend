import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../Utils/useAxios';
import VideoCard from "../../Components/VideoCard.jsx"; 
import timeAgo from "../../Utils/formateDuration.js"; 

function Playlist() {
    const { playlistId } = useParams();
    const { sendRequest } = useAxios();
    const [playlistData, setPlaylistData] = useState(null); // Use null for initial state to control loading
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlaylistDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await sendRequest({
                url: `/playlist/${playlistId}`,
                method: "GET",
            });
            setPlaylistData(response.data);
            console.log("Playlist Details Fetched:", response);
        } catch (err) {
            console.error("Error fetching playlist:", err);
            setError("Failed to load playlist details. It may not exist or be private.");
            setPlaylistData({ videos: [] }); // Set videos to empty array to render empty state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylistDetails();
    }, [playlistId]);

    // --- Conditional Rendering ---

    if (loading) {
        return (
            <div className='min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-white p-4 flex items-center justify-center'>
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h1 className='text-xl ml-4'>Loading Playlist...</h1>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className='min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-red-500 p-4 flex items-center justify-center'>
                <h1 className='text-xl'>Error: {error}</h1>
            </div>
        );
    }

    if (playlistData &&  !playlistData.videos[0]?.title ) {
        return (
            <div className='min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-white p-4 flex items-center justify-center'>
                <h1 className='text-4xl text-gray-400 dark:text-gray-600'>This Playlist is Empty</h1>
            </div>
        );
    }
    
    // --- Main Content ---
    return (
        <div className='min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8'>
            {/* Playlist Header/Metadata */}
            <div className='mb-6 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-3xl text-gray-900 dark:text-white font-bold line-clamp-2'>{playlistData.name}</h3>
                <p className='text-base text-gray-600 dark:text-gray-400 mt-2'>{playlistData.description || 'No description available' }</p>
                <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
                    {playlistData.videos.length} Videos • Last updated: {timeAgo(playlistData.updatedAt)}
                </p>
                {/* Optional: Add a button here to Share/Edit Playlist (if user is the owner) */}
            </div>

            {/* Video List */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {/* Ensure VideoCard is passed the full owner object if needed */}
                {playlistData.videos.map(video => (
                    <VideoCard
                        key={video._id}
                        videoId={video._id}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        channelName={video.owner.username}
                        duration={video.duration}
                        views={video.views}
                        createdAt={video.createdAt}
                        channelAvatar={video.owner.avatar}
                    />
                ))}
            </div>
        </div>
    );
}

export default Playlist;