import React from 'react';
import { Link } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import { FaRegClock, FaCheck } from 'react-icons/fa'; // Import check and clock icons
import Dropdown from "../Components/DropDown.jsx"; 
import { formatDuration, timeAgo } from '../Utils/formateDuration.js'; // Your utility functions
import { useWatchLaterToggle } from '../Utils/useWatchLaterToggle.jsx'

function VideoCard(props) {
    const { videoId, thumbnail, title, channelName, duration, views, createdAt, channelAvatar } = props;

    // 1. Initialize the custom hook
    const { toggleSaveStatus, isSaved } = useWatchLaterToggle();
    
    // 2. Check the saved status for this specific video ID
    const isVideoSaved = isSaved(videoId); 

    const formatedDuration = formatDuration(duration);
    const timeSinceUpload = timeAgo(createdAt);

    const handleSaveClick = (e) => {
        // Prevent clicking the dropdown item from bubbling up and navigating the Link
        e.preventDefault(); 
        e.stopPropagation(); 
        
        // Call the hook's toggle function (handles API and Redux update)
        toggleSaveStatus(videoId); 
    };

    return (
        // Added dark theme classes for better consistency
        <div className='flex flex-col w-full max-w-xs cursor-pointer bg-transparent hover:bg-gray-800/50 rounded-lg pb-2 transition duration-150'>
            
            {/* Video Thumbnail Section */}
            <Link to={`/video/${videoId}`}>
                <div className='relative w-full aspect-video rounded-xl overflow-hidden mb-2'>
                    <img 
                        className='w-full h-full object-cover' 
                        src={thumbnail} 
                        alt="Video Thumbnail" 
                    />
                    <span className='absolute bottom-1 right-2 bg-black bg-opacity-80 text-white px-1 py-0.5 rounded-sm text-xs font-semibold'>
                        {formatedDuration}
                    </span>
                </div> 
            </Link>

            {/* Video Details Section */}
            <div className='flex gap-2 p-1'>
                
                {/* Channel Avatar */}
                <div className='flex-shrink-0'>
                    {/* Link to channel profile page (assuming route is /c/:channelName or /c/:channelId) */}
                    <Link to={`/channel/${channelName}`}>
                        <img 
                            className='w-9 h-9 rounded-full object-cover' 
                            src={channelAvatar} 
                            alt={`${channelName} Avatar`} 
                        />
                    </Link>
                </div> 

                {/* Title and Metadata */}
                <div className='flex flex-col flex-1 text-white min-w-0'>
                    <div className='flex justify-between items-start w-full'>
                        
                        <div className='flex-1 min-w-0'>
                            <Link to={`/video/${videoId}`}>
                                <h3 className='text-sm font-semibold line-clamp-2 leading-snug hover:text-gray-300'>
                                    {title}
                                </h3> 
                            </Link>
                            <p className='text-xs text-gray-400 mt-1 hover:text-gray-300'>
                                <Link to={`/channel/${channelName}`}>{channelName}</Link>
                            </p>
                            <div className='flex text-xs text-gray-500 mt-0.5'>
                                <span>{views} views</span>
                                <span className='mx-1'>•</span>
                                <span>{timeSinceUpload}</span>
                            </div>
                        </div>
                        
                        {/* Dropdown Menu */}
                        <div className='ml-2 flex-shrink-0 text-gray-400 hover:text-white'>
                            <Dropdown
                                triggerLabel={
                                    <HiDotsVertical className='w-5 hover:scale-105' />
                                }
                                items={[
                                    { 
                                        // 🎯 DYNAMIC WATCH LATER OPTION
                                        label: isVideoSaved 
                                            ? (<span className='flex items-center gap-2'><FaCheck className='text-blue-400'/> Saved (Remove)</span>) 
                                            : (<span className='flex items-center gap-2'><FaRegClock /> Save to Watch Later</span>), 
                                        onClick: handleSaveClick // Calls the toggle function
                                    },
                                    { label: "📝 Save to playlist", onClick: () => console.log('Open Playlist Modal') },
                                    { label: "📹 Download", to: "/download" },
                                    { label: "Share", to: "/share" },
                                    { label: "Not Interested", onClick: () => console.log('Not Interested') },
                                    { label: ` Add to queue`, to: "/queue" },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;