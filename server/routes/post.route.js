import express from 'express';
import { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost,
    toggleLike,
    getPostsByAuthor
} from '../controllers/post.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/get-all-posts', getAllPosts);
router.get('/get-post/:id', getPostById);
router.get('/get-posts-by-author/:authorId', getPostsByAuthor);

// Protected routes (require authentication)
router.post('/create-post', isAuthenticated, createPost);
router.put('/update-post/:id', isAuthenticated, updatePost);
router.delete('/delete-post/:id', isAuthenticated, deletePost);
router.post('/toggle-like/:id', isAuthenticated, toggleLike);

export default router;