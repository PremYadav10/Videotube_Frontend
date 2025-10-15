import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
    totalvideos: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
}

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setTotalVideos: (state, action) => {
            state.totalvideos = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
    },
});

export const { setVideos, setLoading, setError, setTotalVideos, setPage, setLimit } = videoSlice.actions;

export default videoSlice.reducer;
