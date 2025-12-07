import React from 'react';
import { Link } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import { FaCheck, FaRegClock } from 'react-icons/fa'; // FaRegClock (empty clock) and FaCheck (check mark)
import Dropdown from "../Components/DropDown.jsx"; // Assuming your Dropdown component
import { formatDuration, timeAgo } from '../Utils/formateDuration.js'; // Your utility functions
import { useWatchLaterToggle } from '../Utils/useWatchLaterToggle.jsx'

function RecommendedVideoCard(props) {
    const { videoId, thumbnail, title, channelName, duration, views, createdAt } = props;
    
    // 1. Initialize the custom hook to get status and toggle function
    const { toggleSaveStatus, isSaved } = useWatchLaterToggle(videoId); 
    
    // 2. Check the saved status for this specific video ID
    const isVideoSaved = isSaved; 

    const formatedDuration = formatDuration(duration);
    const timeSinceUpload = timeAgo(createdAt);

    const handleSaveClick = (e) => {
        // Prevent clicking the dropdown item from bubbling up and navigating the Link
        e.stopPropagation(); 
        
        // Call the hook's toggle function which handles the API, Redux update, and login check
        toggleSaveStatus(videoId); 
    };

    return (
        <div className='flex gap-3 w-full cursor-pointer p-2 rounded-lg transition duration-200 hover:bg-gray-800'>
            
            {/* 1. Thumbnail Section */}
            <Link to={`/video/${videoId}`} className='flex-shrink-0'>
                <div className='relative w-40 h-24 rounded-lg overflow-hidden'> 
                    <img 
                        className='w-full h-full object-cover' 
                        src={thumbnail} 
                        alt={title} 
                    />
                    <span className='absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1 py-0.5 rounded-sm text-xs font-semibold'>
                        {formatedDuration}
                    </span>
                </div>
            </Link>

            {/* 2. Video Details Section */}
            <div className='flex flex-col flex-1 text-white pt-1 min-w-0'>
                <div className='flex justify-between items-start'>
                    
                    {/* Title and Metadata */}
                    <Link to={`/video/${videoId}`} className='flex-1 min-w-0'>
                        <h3 className='text-sm font-semibold line-clamp-2 leading-snug'>
                            {title}
                        </h3> 
                    </Link>
                    
                    {/* Options/Dropdown (Integrated Save Logic) */}
                    <div className='flex-shrink-0 ml-1 text-gray-400 hover:text-white'>
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
                                { label: "📝 Save to Playlist", onClick: () => console.log('Open Playlist Modal') },
                                { label: "Not Interested", onClick: () => console.log('Not Interested') },
                            ]}
                        />
                    </div>
                </div>

                {/* Channel Name and Views */}
                <p className='text-xs text-gray-400 mt-1 line-clamp-1'>
                    {channelName}
                </p>
                <div className='flex text-xs text-gray-500 mt-0.5'>
                    <span>{views} views</span>
                    <span className='mx-1'>•</span>
                    <span>{timeSinceUpload}</span>
                </div>
            </div>
        </div>
    );
}

export default RecommendedVideoCard;