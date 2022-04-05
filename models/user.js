const mongoose = require('mongoose');
const {BlogPostSchema} = require('./blogPost');

const user = mongoose.Schema({
  displayName: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  blogPosts: {
    type: [BlogPostSchema],
    required: false
  }
});

module.exports = new mongoose.model("User", user);

