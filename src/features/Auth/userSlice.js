import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    status: false,
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.userData = action.payload;
            state.status = true;
        },
        logout: (state) => {
            state.userData = null;
            state.status = false;
        },

        // ✅ Update account details (fullname + email)
        updateAccountDetails: (state, action) => {
            if (state.userData && state.userData.user) {
                state.userData.user.fullname = action.payload.fullname;
                state.userData.user.email = action.payload.email;
            }
        },

        // ✅ Update profile picture (avatar)
        updateProfilePicture: (state, action) => {
            if (state.userData && state.userData.user) {
                state.userData.user.avatar = action.payload;
            }
        },


    // ✅ Update channel cover image
    updateChannelCoverImage: (state, action) => {
            if (state.userData && state.userData.user) {
                state.userData.user.coverImage = action.payload;
            }
        },

    },
});

export const {
    login,
    logout,
    updateAccountDetails,
    updateProfilePicture,
    updateChannelCoverImage,
} = userSlice.actions;

export default userSlice.reducer;
