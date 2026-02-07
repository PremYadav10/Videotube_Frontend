import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import useAxios from "../../Utils/useAxios.jsx";
import { timeAgo } from "../../Utils/formateDuration.js";
import Comment from "../../Components/Comment.jsx";
import RecommendedVideoCard from "../../Components/RecommendedVideoCard.jsx";
import { FaThumbsUp, FaThumbsDown, FaShare, FaClock, FaCheck, FaSpinner } from 'react-icons/fa';
import { useWatchLaterToggle } from '../../Utils/useWatchLaterToggle.jsx'
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
// import { addVideoToLiked, removeVideoFromLiked } from '../features/LikedVideos/likedVideosSlice'; // Example action imports

function Video() {
    const { videoId } = useParams();
    const { sendRequest } = useAxios();
    const dispatch = useDispatch(); // Initialize dispatch

    // --- Global State Access ---
    const isLoggedIn = useSelector((state) => state.user.status);
    const userID = useSelector((state) => state.user.userData?.user._id);    
    const likedVideos = useSelector((state) => state.likedVideos.likedVideoIds);
    const recentVideos = useSelector((state) => state.video.videos); // Recommended videos data

    // --- Local State ---
    const [videoDetails, setVideoDetails] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [error, setError] = useState(null); // Explicit error state
    const [isSubscribed, setIsSubscribed] = useState(false); // Subscribed status
    const [channelId, setChannelId] = useState(null); // Channel ID of the video owner

    // --- Watch Later Hook Integration ---
    const { toggleSaveStatus, isSaved } = useWatchLaterToggle(videoId);
    const isVideoSaved = isSaved;

    // --- Like Status Synchronization (Optimized) ---
    // 1. Memoize the like status check against the global Redux list
    const videoIsCurrentlyLiked = useMemo(() => {
        // Safe guard: check if likedVideos is an array of objects before mapping
        if (!isLoggedIn || !Array.isArray(likedVideos)) return false;

        // Use .some() for O(N) check (faster than O(1) Set creation if array is small)
        // Ensure you access the video ID correctly (item.video?._id)
        return likedVideos.some(item => item.video?._id === videoId);

    }, [likedVideos, videoId, isLoggedIn]);

    // 2. Local State Sync
    const [isLiked, setIsLiked] = useState(videoIsCurrentlyLiked);
    useEffect(() => {
        setIsLiked(videoIsCurrentlyLiked);
    }, [videoIsCurrentlyLiked]);

    // --- Data Fetching and Initial Statuses (Subscribed) ---
    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                // const response = await sendRequest({
                //     url: `/videos/${videoId}`,
                //     method: "GET",
                // });
                const response = await fetch(`http://localhost:8000/api/v1/videos/${videoId}`, {
                    method: "GET",
                    credentials: "include", // Include cookies for authentication
                });
                const data = await response.json();
                console.log("data recive: ",data.data);
                

                setVideoDetails(data.data);
                setChannelId(data.data.channel?._id);
                console.log("chanel id",channelId);
                
                setLikeCount(data.data.views || 0); // Assuming 'views' is the count, but you should use the actual like count from API if available

                // if (isLoggedIn) {
                //     // TODO: Fetch user-specific status for IS_SUBSCRIBED
                //     // This requires a call like GET /subscriptions/is-subscribed/:channelId
                //     setIsSubscribed(false); // Placeholder
                // }
            } catch (err) {
                console.error("Error fetching video:", err);
                // Set to false to show "Not Available" UI
                setVideoDetails(false);
                setError(err.message || "Could not load video.");
            }
        };

        setVideoDetails(null); // Reset details to show loading on videoId change
        fetchVideoDetails();
    }, [videoId, isLoggedIn, sendRequest]);

    // Safety check for channel ID
    // const channelId = videoDetails?.channel?._id;


    // --- Action Handlers ---

    const handleAction = (callback) => {
        if (!isLoggedIn) {
            toast.error("Please log in to perform this action.");
            console.error("User not logged in.");
            return;
        }
        callback();
    };

    const toggleLike = async () => {
        try {
            await sendRequest({
                url: `/likes/toggle/v/${videoId}`,
                method: "POST",
                body: {}
            });

            // Optimistic UI Update & Redux Sync
            const newLikedStatus = !isLiked;
            setIsLiked(newLikedStatus);
            setLikeCount(c => newLikedStatus ? c + 1 : c - 1);

            // TODO: Dispatch Redux action to update global likedVideos list
            // dispatch(newLikedStatus ? addVideoToLiked({ videoId, ... }) : removeVideoFromLiked(videoId));

        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error("Failed to toggle like. Try again.");
            // OPTIONAL: Revert optimistic UI here
        }
    };

    // check subscribe toggle
    
    // const isSubscribedCurrently = useMemo(async () => {
    //      let sbscribedChannels = null;
    //     if (!isLoggedIn) return ;
    //     try {
    //         const response = await sendRequest({ url: `subscriptions/u/${userID}`, method: 'GET' });
    //          sbscribedChannels = response.data;            
    //             console.log("response ",response.data)
    //     } catch (error) {
    //         console.error("Failed to fetch subscribed channels:", error);
    //     }

    //     //     console.log("1");
            
    //     //    // search in the response data if channelId is present if yes setIsSubscribed true else false
    //     //     sbscribedChannels.map((ch) => {
    //     //         // if(ch.channel._id === channelId){
    //     //         //     setIsSubscribed(true);
    //     //             console.log("Subscribed to channel:", ch.channel._id);
    //     //             console.log("current :",channelId);
                    
    //     //         // }
                
    //     //     });

        
    // },[])

    

    const toggleSubscribe = async () => {
        // Safety check - user not try to login ourself
        if( channelId === userID ) {
            toast.error("You cannot subscribe to yourself.");
            return;
        }
        try {
            // console.log("Toggling subscription for channel:", channelId);
            await sendRequest({
                url: `/subscriptions/c/${channelId}`,
                method: "POST",
                body: {}
            });

            // Optimistic UI Update
            setIsSubscribed(s => !s);

        } catch (error) {
            console.error("Error toggling subscription:", error);
            toast.error("Failed to toggle subscription. Try again.");
        }
    };

    // --- Loading/Error State Check ---
    if (videoDetails === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <FaSpinner className="animate-spin w-6 h-6 mr-3" />
                <p className="text-lg animate-pulse">Loading video...</p>
            </div>
        );
    }
    if (videoDetails === false) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <p className="text-lg text-red-500">{error || "Video Not Available or Deleted"}</p>
            </div>
        );
    }

    // Use a safety check for channel data
    const channel = videoDetails.channel;

    // --- Render Component ---
    return (
        // classes old = absolute top-0 left-0 right-0 bg-black min-h-screen text-white z-30 flex flex-col
        <div className="min-h-screen bg-black text-white">
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className="flex flex-col lg:flex-row w-full px-6 py-4 gap-6">

                {/* Left Section - Video Player & Info */}
                <div className="flex-1">
                    {/* Video Player */}
                    {/* <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                        <video
                            src={videoDetails.videoFile}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    </div> */}


                    <div className="w-full flex justify-center items-center bg-black rounded-lg overflow-hidden">
                        <video
                            src={videoDetails.videoFile}
                            controls
                            controlsList="nodownload noremoteplayback"
                            disablePictureInPicture
                            autoPlay
                            loop
                            playsInline
                            className="max-h-[90vh] object-cover rounded-xl"
                        />
                    </div>



                    {/* Title */}
                    <h1 className="text-2xl font-semibold mt-4">{videoDetails.title}</h1>

                    {/* Channel Info & Actions */}
                    <div className="flex items-center justify-between mt-3 border-b border-gray-700 pb-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={channel?.avatar || "/default-avatar.png"}
                                alt="channel"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="font-bold">{channel?.username || channel?.name}</h2>
                                <p className="text-sm text-gray-400">
                                    {channel?.subscribers || 0} subscribers
                                </p>
                            </div>

                            {/* SUBSCRIBE BUTTON */}
                            {isLoggedIn && (
                                <button
                                    onClick={() => handleAction(toggleSubscribe)}
                                    className={`ml-4 px-4 py-2 rounded-full font-semibold text-sm transition ${isSubscribed ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                >
                                    {isSubscribed ? <span className="flex items-center gap-1"><FaCheck /> Subscribed</span> : 'Subscribe'}
                                </button>
                            )}
                        </div>

                        {/* Action Buttons (Like/Save/Share) */}
                        <div className="flex items-center gap-2">

                            {/* LIKE BUTTON */}
                            <button
                                onClick={() => handleAction(toggleLike)}
                                className={`flex items-center gap-1 bg-gray-800 px-4 py-2 rounded-full transition ${isLiked ? 'text-blue-400 hover:bg-gray-700' : 'hover:bg-gray-700'}`}
                            >
                                <FaThumbsUp /> {likeCount}
                            </button>

                            {/* DISLIKE BUTTON (Optional) */}
                            {/* <button
                                onClick={() => handleAction(() => console.log('Dislike action'))}
                                className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
                            >
                                <FaThumbsDown />
                            </button> */}

                            {/* SAVE / WATCH LATER BUTTON */}
                            <button
                                onClick={() => handleAction(() => toggleSaveStatus(videoId))}
                                className={`flex items-center gap-1 bg-gray-800 px-4 py-2 rounded-full transition ${isVideoSaved ? 'text-blue-400 hover:bg-gray-700' : 'hover:bg-gray-700'}`}
                            >
                                {isVideoSaved ? <FaCheck /> : <FaClock />} Save
                            </button>

                            {/* SHARE BUTTON */}
                            <button
                                onClick={() => toast('Sharing functionality coming soon!')}
                                className="flex items-center gap-1 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
                            >
                                <FaShare /> Share
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-900 p-4 rounded-lg mt-4">
                        <p className="text-gray-300">{videoDetails.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {videoDetails.views || 0} views • {timeAgo(videoDetails.createdAt)}
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                        <Comment videoId={videoDetails._id} />
                    </div>
                </div>

                {/* Right Section - Recommended Videos */}
                <div className="w-full lg:w-96 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold ml-4">Recommended</h3>
                    <div className='flex flex-col gap-3 flex-wrap p-2'>
                        {recentVideos.map((video) => (
                            <RecommendedVideoCard
                                key={video._id}
                                videoId={video._id}
                                thumbnail={video.thumbnail}
                                title={video.title}
                                channelName={video.owner.username}
                                duration={video.duration}
                                views={video.views}
                                createdAt={video.createdAt}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Video;