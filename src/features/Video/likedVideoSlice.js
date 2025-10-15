import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // We store an array of video IDs for fast O(1) lookup using .includes()
    // Initial fetch (on login) will populate this array with IDs.
    likedVideoIds: [],
    // You might keep a status to track initial loading, but for simplicity, we focus on the IDs.
};

export const likedVideosSlice = createSlice({
    // 1. Ensure 'name' is descriptive and consistent
    name: "likedVideos", 
    initialState,
    reducers: {
        /**
         * Action to set the entire array of liked video IDs upon initial fetch (e.g., after login).
         * Payload: ['id1', 'id2', 'id3', ...]
         */
        setLikedVideoIds: (state, action) => {
            // Ensure the payload is an array before setting
            if (Array.isArray(action.payload)) {
                 state.likedVideoIds = action.payload;
            }
        },

        /**
         * Action to add a single video ID to the liked list (after a successful LIKE API call).
         * Payload: 'newVideoId'
         */
        addVideoToLiked: (state, action) => {
            const newVideoId = action.payload;
            // Only add if it doesn't already exist in the array (prevents duplicates)
            if (!state.likedVideoIds.includes(newVideoId)) {
                // Prepending (unshift) or Appending (push) is fine. Appending is simpler.
                state.likedVideoIds.push(newVideoId);
            }
        },

        /**
         * Action to remove a single video ID from the liked list (after a successful UNLIKE API call).
         * Payload: 'videoIdToRemove'
         */
        removeVideoFromLiked: (state, action) => {
            const videoIdToRemove = action.payload;
            // Use filter to create a new array excluding the ID
            state.likedVideoIds = state.likedVideoIds.filter(
                (id) => id !== videoIdToRemove
            );
        },
    },
});

// 2. Export actions using the correct slice name (likedVideosSlice)
export const { 
    setLikedVideoIds, 
    addVideoToLiked, 
    removeVideoFromLiked 
} = likedVideosSlice.actions;

// 3. Export the reducer
export default likedVideosSlice.reducer;