import express from 'express';
import middleware from '../middleware.js';
import {
  createPostByUserId,
  getPostsByUserId,
  getUserById,
  getPosts,
} from '../controllers/user.controller.js';

const userRouter = express.Router();

// create post by user ID
userRouter.post('/:userId/post', middleware.verify, createPostByUserId);

// get posts by User ID
userRouter.get('/:userId/posts', getPostsByUserId);

// get all posts
userRouter.get('/posts', middleware.verify, getPosts);

// Get user by ID
userRouter.get('/:userId', getUserById);

export default userRouter;
