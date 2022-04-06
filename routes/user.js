const User = require('../models/user');
const express = require('express');
const {body, validationResult} = require('express-validator');

const router = express.Router();

// create post by user ID
router.post(
    '/:userId/post',
    body('title').
        isLength({min: 5}).
        withMessage('must be at least 5 characters long'),
    body('content').
        isLength({min: 25}).
        withMessage('must be at least 25 characters long'),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const post = {
        title: req.body.title,
        content: req.body.content,
      };

      User.findOneAndUpdate({_id: req.params.userId}, {
            $push: {
              blogPosts: post,
            },
          },
          (err, result) => {
            if (!result) {
              res.status(404).json({error: 'no user with that id was found'});
            } else {
              if (err) {
                res.status(500).json(err);
              } else {
                res.status(200).
                    json({message: 'Blog post inserted into user!'});
              }
            }
          });
    });

// get posts by User ID
router.get('/:userId/posts', (req, res) => {
  const query = User.findOne({ _id: req.params.userId });

  query.select('blogPosts')
  query.exec((err, result) => {
    if(!result) {
      res.status(404).json({error: 'no user with that id was found'});
    } else {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({result})
      }
    }
  });
});

// Get user by ID
router.get('/:userId', (req, res) => {
  User.findById(req.params.userId, (err, result) => {
    if (!result) {
      res.status(404).json({error: 'no user with that id was found'});
    } else {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({result});
      }
    }
  });
});

module.exports = router;
