import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../../api/axiosInstance'


export const loginUserThunk = createAsyncThunk('user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/login',{
                email,
                password
            });
            toast.success("Login successful")
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            toast.error(errorOutput);
            return rejectWithValue(errorOutput)
        }
    }
);

export const registerUserThunk = createAsyncThunk('user/register',
    async ({ fullName, email, password, gender }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/register',{
                fullName,
                email,
                password,
                gender
            });
            toast.success("Account Created Successfully!!");
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            // console.log(errorOutput)
            toast.error(errorOutput);
            return rejectWithValue(errorOutput)
        }
    }
);

export const logoutUserThunk = createAsyncThunk('user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/logout');
            toast.success("Logged Out Successfully!!");
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            // console.log(errorOutput)
            toast.error(errorOutput);
            return rejectWithValue(errorOutput)
        }
    }
);

export const getUserProfileThunk = createAsyncThunk('user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/get-profile');
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            return rejectWithValue(errorOutput)
        }
    }
);

export const getOtherUsersThunk = createAsyncThunk('user/getOtherUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/get-other-users');
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            return rejectWithValue(errorOutput)
        }
    }
);

export const updateProfileThunk = createAsyncThunk('user/updateProfile',
    async ({ fullName, bio, avatar }, { rejectWithValue }) => {
        try {
            const updateData = {};
            if (fullName !== undefined) updateData.fullName = fullName;
            if (bio !== undefined) updateData.bio = bio;
            if (avatar !== undefined) updateData.avatar = avatar;

            const response = await axiosInstance.post('/user/update-profile', updateData);
            toast.success("Profile Updated Successfully!!");
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            toast.error(errorOutput);
            return rejectWithValue(errorOutput)
        }
    }
);

export const updatePasswordThunk = createAsyncThunk('user/updatePassword',
    async ({ oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/user/update-password', {
                oldPassword,
                newPassword
            });
            toast.success("Password Updated Successfully!!");
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            toast.error(errorOutput);
            return rejectWithValue(errorOutput)
        }
    }
);

export const deleteUserThunk = createAsyncThunk('user/deleteUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/user/delete-user');
            toast.success(response?.data?.message || "Account deletion successful");
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage;
            toast.error(errorOutput);
            return rejectWithValue(errorOutput)
        }
    }
);

export const googleAuthThunk = createAsyncThunk(
    'user/googleAuth',
    async ({ credential }, { rejectWithValue }) => {
        try {
            // Send Google credential (ID token) to backend
            const response = await axiosInstance.post('/auth/google', {
                credential,
            });
            
            toast.success("Google login successful!");
            return response.data;

        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || "Google login failed";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);
