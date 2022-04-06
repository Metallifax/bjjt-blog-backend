import jwt from 'jsonwebtoken';

const tokenSecret = 'temp-secret';

const middleware = {
  verify: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).json({ error: 'please provide a token' });
    } else {
      jwt.verify(token.split(' ')[1], tokenSecret, (err, value) => {
        if (err) {
          res.status(500).json({ error: 'failed to authenticate' });
        }
        req.user = value.data;
        next();
      });
    }
  },
};

export default middleware;
