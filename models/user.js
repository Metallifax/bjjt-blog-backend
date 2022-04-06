import mongoose from 'mongoose';

const user = mongoose.Schema({
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
  blogPosts: {
    type: [
      {
        title: {type: String, required: true},
        content: {type: String, required: true},
      }],
    required: false,
  },
});

export default new mongoose.model('User', user);

