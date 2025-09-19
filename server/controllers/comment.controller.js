import Comment from '../models/comments.model.js';
import Post from '../models/posts.model.js';
import { asyncHandler } from '../utilities/asyncHandler.utility.js';
import { errorHandler } from '../utilities/errorHandler.utility.js';

// Add a comment to a post
export const addComment = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { postId } = req.params;
    if (!text) {
        return next(new errorHandler('Comment text is required', 400));
    }
    const post = await Post.findById(postId);
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }
    const comment = await Comment.create({
        text,
        author: req.user._id,
        post: postId
    });
    
    // Populate the author information before sending response
    await comment.populate('author', '-password');
    
    res.status(201).json({ success: true, comment });
});

// Get all comments for a post
export const getCommentsByPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('author', '-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
});

// Update a comment
export const updateComment = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate('author', '-password');
    if (!comment) {
        return next(new errorHandler('Comment not found', 404));
    }
    if (comment.author._id.toString() !== req.user._id.toString()) {
        return next(new errorHandler('Unauthorized', 403));
    }
    comment.text = text || comment.text;
    await comment.save();
    
    res.status(200).json({ success: true, comment });
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return next(new errorHandler('Comment not found', 404));
    }
    if (comment.author.toString() !== req.user._id.toString()) {
        return next(new errorHandler('Unauthorized', 403));
    }
    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
});
