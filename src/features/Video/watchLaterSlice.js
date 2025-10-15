import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Array of video IDs saved to Watch Later for fast checking (O(1) lookup).
    savedVideoIds: [], 
    
    // Crucial for API calls: The MongoDB ID of the user's system "Watch Later" playlist.
    // This ID is fetched once upon login/initialization.
    watchLaterPlaylistId: null,
};

export const watchLaterSlice = createSlice({
    name: "watchLater",
    initialState,
    reducers: {
        /**
         * Action to set the Watch Later Playlist ID after successful fetching on login.
         * Payload: 'mongoDBPlaylistIdString'
         */
        setWatchLaterId: (state, action) => {
            state.watchLaterPlaylistId = action.payload;
        },
        
        /**
         * Action to set the initial list of all saved video IDs upon login/page refresh.
         * Payload: ['videoId1', 'videoId2', ...]
         */
        setSavedVideoIds: (state, action) => {
            if (Array.isArray(action.payload)) {
                 state.savedVideoIds = action.payload;
            }
        },

        /**
         * Action to toggle the save status of a single video ID globally.
         * This is dispatched after a successful API call (add/remove).
         * Payload: 'videoIdToToggle'
         */
        toggleSavedVideo: (state, action) => {
            const videoId = action.payload;
            const index = state.savedVideoIds.indexOf(videoId);
            
            if (index > -1) {
                // If ID exists: Remove (User unsubscribed)
                state.savedVideoIds.splice(index, 1); 
            } else {
                // If ID does not exist: Add to the front (Most recent save)
                state.savedVideoIds.unshift(videoId);
            }
        },
    },
});

export const { 
    setWatchLaterId, 
    setSavedVideoIds, 
    toggleSavedVideo 
} = watchLaterSlice.actions;

export default watchLaterSlice.reducer;