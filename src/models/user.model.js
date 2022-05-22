import mongoose from 'mongoose';

const userModel = mongoose.Schema({
  displayName: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  blogPosts: {
    type: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        imageUrl: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now, set: (v) => v.Date.now() },
      },
    ],
    required: false,
  },
});

export default new mongoose.model('User', userModel);
