import express from 'express';
import middleware from '../middleware.js';
import {
  createPostByUserId,
  getPostsByUserId,
  getUserById,
} from '../controllers/user.controller.js';

const userRouter = express.Router();

// create post by user ID
userRouter.post('/:userId/post', middleware.verify, createPostByUserId);

// get posts by User ID
userRouter.get('/:userId/posts', getPostsByUserId);

// Get user by ID
userRouter.get('/:userId', getUserById);

export default userRouter;
