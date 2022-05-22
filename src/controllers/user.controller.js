import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import log from '../utils/logger.js';

export const createPostByUserId = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const post = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
  };

  if (post.title === '' || post.title === undefined)
    return res.status(400).json({ param: 'title', error: 'Cannot be empty' });
  if (post.content === '' || post.content === undefined)
    return res.status(400).json({ param: 'content', error: 'Cannot be empty' });
  if (post.imageUrl === '' || post.imageUrl === undefined)
    return res
      .status(400)
      .json({ param: 'imageUrl', error: 'Cannot be empty' });

  User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $push: {
        blogPosts: post,
      },
    },
    (err, result) => {
      if (!result) {
        res.status(404).json({ error: 'no user with that id was found' });
      } else {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({ message: 'Blog post inserted into user!' });
        }
      }
    },
  );
};

export const getPostsByUserId = (req, res) => {
  const query = User.findOne({ _id: req.params.userId });

  query.select('blogPosts');
  query.exec((err, result) => {
    if (!result) {
      res.status(404).json({ error: 'no user with that id was found' });
    } else {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ result });
      }
    }
  });
};

export const getUserById = (req, res) => {
  User.findById(req.params.userId, (err, result) => {
    if (!result) {
      res.status(404).json({ error: 'no user with that id was found' });
    } else {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ result });
      }
    }
  });
};

export const getPosts = (req, res) => {
  const query = User.find({});

  query.select('blogPosts');
  query.exec((err, result) => {
    if (!result) {
      res.status(404).json({ error: 'no blog posts were found!' });
    } else {
      if (err) {
        res.status(500).json(err);
      } else {
        const flattened = result.map((user) => user.blogPosts).flat();
        const sorted = flattened.sort(
          (item1, item2) => item2.createdAt - item1.createdAt,
        );
        log.info({ result: sorted });
        res.status(200).json({ result });
      }
    }
  });
};
