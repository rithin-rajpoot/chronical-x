import { createSlice } from '@reduxjs/toolkit'
import { deleteUserThunk, getOtherUsersThunk, getUserProfileThunk, googleAuthThunk, loginUserThunk, logoutUserThunk, registerUserThunk, updateProfileThunk, updatePasswordThunk } from './userThunk.js'

const initialState = {
    isAuthenticated: false,
    userProfile: null,
    buttonLoading: false,
    screenLoading: true,
    otherUsers: [],
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Login 
        builder.addCase(loginUserThunk.pending, (state, action) => {
            state.buttonLoading = true;
        });

        builder.addCase(loginUserThunk.fulfilled, (state, action) => {
            state.userProfile = action.payload?.responseData?.user
            state.isAuthenticated = true;
            state.buttonLoading = false;
        });

        builder.addCase(loginUserThunk.rejected, (state, action) => {
            state.buttonLoading = false;
        });


        // Register
        builder.addCase(registerUserThunk.pending, (state, action) => {
            state.buttonLoading = true;
        });

        builder.addCase(registerUserThunk.fulfilled, (state, action) => {
            state.userProfile = action.payload?.responseData?.user
            state.buttonLoading = false;
            state.isAuthenticated = true;
        });

        builder.addCase(registerUserThunk.rejected, (state, action) => {
            state.buttonLoading = false;
        });


        // Logout
        builder.addCase(logoutUserThunk.pending, (state, action) => {
            state.buttonLoading = true;
            state.screenLoading = true;
        });

        builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
            state.userProfile = null;
            state.otherUsers = null;
            state.isAuthenticated = false;
            state.buttonLoading = false;
            state.screenLoading = false;
        });

        builder.addCase(logoutUserThunk.rejected, (state, action) => {
            state.buttonLoading = false;
        });


        // Get user profile
        builder.addCase(getUserProfileThunk.pending, (state, action) => {
        });

        builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.userProfile = action.payload?.responseData;
            state.screenLoading = false;
        });

        builder.addCase(getUserProfileThunk.rejected, (state, action) => {
            state.screenLoading = false;
        });

        // Get Other Users profile
        builder.addCase(getOtherUsersThunk.pending, (state, action) => {
            state.screenLoading = true;
        });

        builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
            state.screenLoading = false;
            state.otherUsers = action.payload?.responseData;
        });

        builder.addCase(getOtherUsersThunk.rejected, (state, action) => {
            state.screenLoading = false;
        });

        // update user profile
        builder.addCase(updateProfileThunk.pending, (state, action) => {
            state.screenLoading = true;
        });

        builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
            state.screenLoading = false;
            state.userProfile = action.payload?.responseData;
        });

        builder.addCase(updateProfileThunk.rejected, (state, action) => {
            state.screenLoading = false;
        });

        // delete account
        builder.addCase(deleteUserThunk.pending, (state, action) => {
            state.screenLoading = true;
        });

        builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
            state.userProfile = null;
            state.otherUsers = null;
            state.isAuthenticated = false;
            state.buttonLoading = false;
            state.screenLoading = false;
        });

        builder.addCase(deleteUserThunk.rejected, (state, action) => {
            state.screenLoading = false;
        });

        // Google Login
        builder.addCase(googleAuthThunk.pending, (state) => {
            state.buttonLoading = true;
        });

        builder.addCase(googleAuthThunk.fulfilled, (state, action) => {
            state.userProfile = action.payload?.responseData?.user;
            state.isAuthenticated = true;
            state.buttonLoading = false;
        });

        builder.addCase(googleAuthThunk.rejected, (state) => {
            state.buttonLoading = false;
        });

        // Update Password
        builder.addCase(updatePasswordThunk.pending, (state) => {
            state.buttonLoading = true;
        });

        builder.addCase(updatePasswordThunk.fulfilled, (state) => {
            state.buttonLoading = false;
        });

        builder.addCase(updatePasswordThunk.rejected, (state) => {
            state.buttonLoading = false;
        });
    },
})
export const { setSelectedUser, updateDeletedUser } = userSlice.actions;

export default userSlice.reducer