import { useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const useWatchLaterToggle = (videoId) => {

    const savedVideoIds = useSelector(state => state.watchLater?.savedVideoIds || []); // Default to empty array for safety
    const [isSaved, setIsSaved] = useState(savedVideoIds.includes(videoId));
    const [loading, setLoading] = useState(false);
    const isLoggedIn = useSelector(state => state.user?.status);
    const BaseUrl = import.meta.env.BASE_URL;


    const toggleSaveStatus = async (videoId, playlistId) => {
        if (!isLoggedIn) {
            toast.error("Please log in to save videos to Watch Later.");
            throw new Error("User not logged in.");
        }

        if (!videoId || !playlistId) {
            console.error("Video ID or Playlist ID missing!");
            return;
        }

        setLoading(true);

        try {
            // Determine URL based on toggle
            const endpoint = isSaved
                ? `/playlist/remove/${videoId}/${playlistId}`
                : `/playlist/add/${videoId}/${playlistId}`;

            // Use POST (or PATCH if your server actually expects it)
            const response = await axios.post(endpoint, null, {
                baseURL: BaseUrl, // replace with your base URL
                withCredentials: true, // cookies will be sent
            });

            if (response.data.success) {

                toast.success(isSaved
                ? 'Video removed from Watch Later' 
                : 'Video saved to Watch Later');

                setIsSaved(!isSaved);
            
            } else {
                console.error("Server rejected request:", response.data.message);
            }
             
        } catch (err) {
            console.error("Watch Later Toggle Error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return { isSaved, loading, toggleSaveStatus };
};

export { useWatchLaterToggle };