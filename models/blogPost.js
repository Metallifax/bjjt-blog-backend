const mongoose = require('mongoose');

const blogPost = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = {
  BlogPost: new mongoose.model('BlogPost', blogPost),
  BlogPostSchema: blogPost
};
