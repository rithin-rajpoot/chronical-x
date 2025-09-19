import { createSlice } from '@reduxjs/toolkit'
import { 
    createPostThunk, 
    getAllPostsThunk, 
    getPostByIdThunk, 
    updatePostThunk, 
    deletePostThunk,
    toggleLikeThunk,
    getPostsByAuthorThunk
} from './postThunk.js'

const initialState = {
    posts: [],
    currentPost: null,
    authorPosts: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNext: false,
        hasPrev: false
    },
    buttonLoading: false,
    screenLoading: false,
    createPostLoading: false,
    deleteLoading: false,
    likeLoading: false,
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        clearCurrentPost: (state) => {
            state.currentPost = null;
        },
        clearPosts: (state) => {
            state.posts = [];
        },
        clearAuthorPosts: (state) => {
            state.authorPosts = [];
        }
    },
    extraReducers: (builder) => {
        // Get All Posts
        builder.addCase(getAllPostsThunk.pending, (state) => {
            state.screenLoading = true;
        });

        builder.addCase(getAllPostsThunk.fulfilled, (state, action) => {
            state.posts = action.payload?.responseData?.posts || [];
            state.pagination = action.payload?.responseData?.pagination || state.pagination;
            state.screenLoading = false;
        });

        builder.addCase(getAllPostsThunk.rejected, (state) => {
            state.screenLoading = false;
        });

        // Get Post By ID
        builder.addCase(getPostByIdThunk.pending, (state) => {
            state.screenLoading = true;
        });

        builder.addCase(getPostByIdThunk.fulfilled, (state, action) => {
            state.currentPost = action.payload?.responseData || null;
            state.screenLoading = false;
        });

        builder.addCase(getPostByIdThunk.rejected, (state) => {
            state.screenLoading = false;
        });

        // Get Posts By Author
        builder.addCase(getPostsByAuthorThunk.pending, (state) => {
            state.screenLoading = true;
        });

        builder.addCase(getPostsByAuthorThunk.fulfilled, (state, action) => {
            state.authorPosts = action.payload?.responseData?.posts || [];
            state.screenLoading = false;
        });

        builder.addCase(getPostsByAuthorThunk.rejected, (state) => {
            state.screenLoading = false;
        });

        // Create Post
        builder.addCase(createPostThunk.pending, (state) => {
            state.createPostLoading = true;
        });

        builder.addCase(createPostThunk.fulfilled, (state, action) => {
            const newPost = action.payload?.responseData;
            if (newPost) {
                state.posts.unshift(newPost);
            }
            state.createPostLoading = false;
        });

        builder.addCase(createPostThunk.rejected, (state) => {
            state.createPostLoading = false;
        });

        // Update Post
        builder.addCase(updatePostThunk.pending, (state) => {
            state.buttonLoading = true;
        });

        builder.addCase(updatePostThunk.fulfilled, (state, action) => {
            const updatedPost = action.payload?.responseData;
            if (updatedPost) {
                const index = state.posts.findIndex(post => post._id === updatedPost._id);
                if (index !== -1) {
                    state.posts[index] = updatedPost;
                }
                state.currentPost = updatedPost;
            }
            state.buttonLoading = false;
        });

        builder.addCase(updatePostThunk.rejected, (state) => {
            state.buttonLoading = false;
        });

        // Delete Post
        builder.addCase(deletePostThunk.pending, (state) => {
            state.deleteLoading = true;
        });

        builder.addCase(deletePostThunk.fulfilled, (state, action) => {
            const deletedPostId = action.meta.arg; // The post ID passed to the thunk
            state.posts = state.posts.filter(post => post._id !== deletedPostId);
            state.authorPosts = state.authorPosts.filter(post => post._id !== deletedPostId);
            if (state.currentPost && state.currentPost._id === deletedPostId) {
                state.currentPost = null;
            }
            state.deleteLoading = false;
        });

        builder.addCase(deletePostThunk.rejected, (state) => {
            state.deleteLoading = false;
        });

        // Toggle Like
        builder.addCase(toggleLikeThunk.pending, (state) => {
            state.likeLoading = true;
        });

        builder.addCase(toggleLikeThunk.fulfilled, (state, action) => {
            const updatedPost = action.payload?.responseData;
            if (updatedPost) {
                const index = state.posts.findIndex(post => post._id === updatedPost._id);
                if (index !== -1) {
                    state.posts[index] = updatedPost;
                }
                if (state.currentPost && state.currentPost._id === updatedPost._id) {
                    state.currentPost = updatedPost;
                }
                const authorIndex = state.authorPosts.findIndex(post => post._id === updatedPost._id);
                if (authorIndex !== -1) {
                    state.authorPosts[authorIndex] = updatedPost;
                }
            }
            state.likeLoading = false;
        });

        builder.addCase(toggleLikeThunk.rejected, (state) => {
            state.likeLoading = false;
        });
    },
})

export const { clearCurrentPost, clearPosts, clearAuthorPosts } = postSlice.actions;

export default postSlice.reducer