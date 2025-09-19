import express from 'express';
import { 
  deleteUser, 
  getOtherUsers, 
  getProfile, 
  login, 
  logout, 
  register, 
  updateProfile,
  updatePassword  // Added missing import
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/get-profile', isAuthenticated, getProfile);
router.get('/get-other-users', isAuthenticated, getOtherUsers);
router.post('/logout', isAuthenticated, logout);
router.post('/update-profile', isAuthenticated, updateProfile);
router.put('/update-password', isAuthenticated, updatePassword); // Added missing route
router.delete('/delete-user', isAuthenticated, deleteUser);

export default router;