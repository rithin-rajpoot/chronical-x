import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../../api/axiosInstance'

// Get All Posts
export const getAllPostsThunk = createAsyncThunk('post/getAllPosts',
    async ({ page = 1, limit = 10, tag, author } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);
            if (tag) params.append('tag', tag);
            if (author) params.append('author', author);
            
            const response = await axiosInstance.get(`/posts/get-all-posts?${params}`);
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to fetch posts';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Get Post By ID
export const getPostByIdThunk = createAsyncThunk('post/getPostById',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/posts/get-post/${postId}`);
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to fetch post';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Create Post
export const createPostThunk = createAsyncThunk('post/createPost',
    async ({ title, content, coverImage, tags }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/posts/create-post', {
                title,
                content,
                coverImage,
                tags
            });
            toast.success("Post created successfully!");
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to create post';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Update Post
export const updatePostThunk = createAsyncThunk('post/updatePost',
    async ({ postId, title, content, coverImage, tags }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/posts/update-post/${postId}`, {
                title,
                content,
                coverImage,
                tags
            });
            toast.success("Post updated successfully!");
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to update post';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Delete Post
export const deletePostThunk = createAsyncThunk('post/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/posts/delete-post/${postId}`);
            toast.success("Post deleted successfully!");
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to delete post';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Toggle Like Post
export const toggleLikeThunk = createAsyncThunk('post/toggleLike',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/posts/toggle-like/${postId}`);
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to toggle like';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

// Get Posts By Author
export const getPostsByAuthorThunk = createAsyncThunk('post/getPostsByAuthor',
    async (authorId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/posts/get-posts-by-author/${authorId}`);
            return response.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.errMessage || 'Failed to fetch author posts';
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);