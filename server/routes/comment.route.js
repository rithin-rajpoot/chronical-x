import express from 'express';
import { addComment, getCommentsByPost, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all comments for a post (public)
router.get('/post/:postId', getCommentsByPost);

// Add a comment to a post (protected)
router.post('/post/:postId', isAuthenticated, addComment);

// Update a comment (protected)
router.put('/:commentId', isAuthenticated, updateComment);

// Delete a comment (protected)
router.delete('/:commentId', isAuthenticated, deleteComment);

export default router;