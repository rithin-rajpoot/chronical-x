import { createSlice } from '@reduxjs/toolkit'
import { 
    addCommentThunk,
    getCommentsByPostThunk,
    updateCommentThunk,
    deleteCommentThunk
} from './commentThunk.js'

const initialState = {
    comments: [],
    buttonLoading: false,
    screenLoading: false,
    addCommentLoading: false,
    deleteLoading: false,
}

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.comments = [];
        }
    },
    extraReducers: (builder) => {
        // Get Comments By Post
        builder.addCase(getCommentsByPostThunk.pending, (state) => {
            state.screenLoading = true;
        });

        builder.addCase(getCommentsByPostThunk.fulfilled, (state, action) => {
            state.comments = action.payload?.comments || [];
            state.screenLoading = false;
        });

        builder.addCase(getCommentsByPostThunk.rejected, (state) => {
            state.screenLoading = false;
        });

        // Add Comment
        builder.addCase(addCommentThunk.pending, (state) => {
            state.addCommentLoading = true;
        });

        builder.addCase(addCommentThunk.fulfilled, (state, action) => {
            const newComment = action.payload?.comment;
            if (newComment) {
                state.comments.unshift(newComment);
            }
            state.addCommentLoading = false;
        });

        builder.addCase(addCommentThunk.rejected, (state) => {
            state.addCommentLoading = false;
        });

        // Update Comment
        builder.addCase(updateCommentThunk.pending, (state) => {
            state.buttonLoading = true;
        });

        builder.addCase(updateCommentThunk.fulfilled, (state, action) => {
            const updatedComment = action.payload?.comment;
            if (updatedComment) {
                const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
                if (index !== -1) {
                    state.comments[index] = updatedComment;
                }
            }
            state.buttonLoading = false;
        });

        builder.addCase(updateCommentThunk.rejected, (state) => {
            state.buttonLoading = false;
        });

        // Delete Comment
        builder.addCase(deleteCommentThunk.pending, (state) => {
            state.deleteLoading = true;
        });

        builder.addCase(deleteCommentThunk.fulfilled, (state, action) => {
            const deletedCommentId = action.meta.arg; // The comment ID passed to the thunk
            state.comments = state.comments.filter(comment => comment._id !== deletedCommentId);
            state.deleteLoading = false;
        });

        builder.addCase(deleteCommentThunk.rejected, (state) => {
            state.deleteLoading = false;
        });
    },
})

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer