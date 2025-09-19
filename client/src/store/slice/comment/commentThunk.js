import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../../api/axiosInstance'

// Get Comments By Post
export const getCommentsByPostThunk = createAsyncThunk('comment/getCommentsByPost',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/comments/post/${postId}`);
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to fetch comments';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Add Comment
export const addCommentThunk = createAsyncThunk('comment/addComment',
    async ({ postId, text }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/comments/post/${postId}`, {
                text
            });
            toast.success("Comment added successfully!");
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to add comment';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Update Comment
export const updateCommentThunk = createAsyncThunk('comment/updateComment',
    async ({ commentId, text }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/comments/${commentId}`, {
                text
            });
            toast.success("Comment updated successfully!");
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to update comment';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Delete Comment
export const deleteCommentThunk = createAsyncThunk('comment/deleteComment',
    async (commentId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/comments/${commentId}`);
            toast.success("Comment deleted successfully!");
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to delete comment';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);