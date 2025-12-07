// import { useDispatch, useSelector } from 'react-redux';
// import useAxios from './useAxios';
// import { toggleSavedVideo } from '../features/Video/watchLaterSlice.js' // Assuming this path is correct

// export const useWatchLaterToggle = () => {
//     const dispatch = useDispatch();
//     const { sendRequest } = useAxios();

//     // --- Redux State Access (Polished and Safer Selectors) ---
//     // 1. Check login status safely (Assuming state.user might be undefined when logged out)
//     const isLoggedIn = useSelector(state => state.user?.status);

//     // 2. Access the Watch Later ID and the list of saved IDs from the 'watchLater' slice
//     const WL_PLAYLIST_ID = useSelector(state => state.watchLater?.watchLaterPlaylistId);
//     const savedVideoIds = useSelector(state => state.watchLater?.savedVideoIds || []); // Default to empty array for safety

//     // /**
//     //  * Toggles the save status of a video on the backend and updates the Redux store.
//     //  * @param {string} videoId - The ID of the video to add or remove.
//     //  * @returns {boolean} The new save status (true if added/saved, false if removed).
//     //  */
//     const toggleSaveStatus = async (videoId) => {

//         // --- 1. Client-Side Validation ---
//         if (!isLoggedIn) {
//             alert("Please log in to save videos to Watch Later.");
//             // Throwing an error ensures the calling component (VideoCard) can catch and stop execution
//             throw new Error("User not logged in.");
//         }
//         if (!WL_PLAYLIST_ID) {
//             alert("Error: Watch Later playlist ID is unavailable. Try refreshing or logging in again.");
//             throw new Error("Watch Later Playlist ID is missing.");

//         }
//         // if (!WL_PLAYLIST_ID) {
//         //     try {
//         //         const res = await sendRequest({ method: "get", url: "/playlist/watch-later-id" });
//         //         const playlistId = res.data._id;
//         //         if (!playlistId) throw new Error("No Watch Later playlist found.");
//         //         dispatch(setWatchLaterId(playlistId));
//         //         WL_PLAYLIST_ID = playlistId; // now safe
//         //     } catch (err) {
//         //         alert("Failed to fetch Watch Later playlist ID. Please try again.");
//         //         throw err;
//         //     }
//         // }


//         const isCurrentlySaved = savedVideoIds.includes(videoId);

//         // 2. Construct API Request
//         // The URL dynamically chooses between the ADD and REMOVE routes using the PL_ID.
//         const endpoint = isCurrentlySaved
//             ? `/playlist/remove/${videoId}/${WL_PLAYLIST_ID}` // PATCH /playlist/remove/:videoId/:playlistId
//             : `/playlist/add/${videoId}/${WL_PLAYLIST_ID}`;   // PATCH /playlist/add/:videoId/:playlistId

//         try {
//             // 3. Execute API Call (using PATCH method which is appropriate for adding/removing resources)
//             // await sendRequest({
//             //     url: endpoint,
//             //     method: "PATCH",
//             //     body: null // Explicitly send no body to prevent JSON parsing errors on the server
//             // });

//             // 3. Execute API Call
//             await sendRequest({
//                 url: endpoint,
//                 method: "PATCH",
//                 // body: null, // no body needed for this endpoint
//                 withCredentials: true // ✅ ensures cookies are sent if backend uses sessions
//             });


//             // 4. Optimistic Redux Update
//             dispatch(toggleSavedVideo(videoId));

//             return !isCurrentlySaved; // Return the final status (true if now saved, false if now removed)

//         } catch (error) {
//             console.error("Watch Later Toggle Error:", error.response?.data?.message || error.message);
//             const action = isCurrentlySaved ? 'remove' : 'add';
//             alert(`Failed to ${action} video from Watch Later. Please try again.`);
//             throw error; // Propagate error back to the UI component
//         }
//     };

//     // --- Public Hook Return ---
//     return {
//         toggleSaveStatus,
//         // isSaved: A quick function that checks the status against the Redux array
//         isSaved: (videoId) => savedVideoIds.includes(videoId),
//     };
// };


import { useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const useWatchLaterToggle = (videoId) => {

    const savedVideoIds = useSelector(state => state.watchLater?.savedVideoIds || []); // Default to empty array for safety
    const [isSaved, setIsSaved] = useState(savedVideoIds.includes(videoId));
    const [loading, setLoading] = useState(false);
    const isLoggedIn = useSelector(state => state.user?.status);


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
                baseURL: "http://localhost:8000/api/v1", // replace with your base URL
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