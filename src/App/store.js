import { configureStore } from "@reduxjs/toolkit";
import  useReducer  from "../features/Auth/userSlice.js"
import sidebarReducer from "../features/Sidebar/sidebarSlice.js"
import likedVideosReducer from "../features/Video/likedVideoSlice.js"
import videoReducer from "../features/Video/videoSlice.js"
import watchLaterReducer from "../features/Video/watchLaterSlice.js"

export const store = configureStore({
  reducer: {
     user: useReducer,
     sidebar: sidebarReducer,
     likedVideos:likedVideosReducer,
     video:videoReducer,
     watchLater:watchLaterReducer
    },
});