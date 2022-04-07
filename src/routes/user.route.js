import express from 'express';
import {
  createPostByUserId,
  getPostsByUserId,
  getUserById,
} from '../controllers/user.controller.js';

const userRouter = express.Router();

// create post by user ID
userRouter.post('/:userId/post', (req, res) => {
  createPostByUserId(req, res);
});

// get posts by User ID
userRouter.get('/:userId/posts', (req, res) => {
  getPostsByUserId(req, res);
});

// Get user by ID
userRouter.get('/:userId', (req, res) => {
  getUserById(req, res);
});

export default userRouter;
